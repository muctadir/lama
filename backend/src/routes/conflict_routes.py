# Ana-Maria Olteniceanu

from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select, func, distinct
from src.models.item_models import Labelling
from src.models import db

conflict_routes = Blueprint("conflict", __name__, url_prefix="/conflict")

"""
Author: Eduardo Costa Martins
Returns the number of conflicts in a project
@params p_id: int, id of the project
@returns the number of conflicts in project with id p_id
"""
def nr_project_conflicts(p_id):
    # Number of differing labels per label type and artifact
    per_label_type = select(
        # Artifact id
        Labelling.a_id,
        # Label type id (can get rid of this maybe?)
        Labelling.lt_id,
        # Distinct labels for a label type (renamed to 'label_count')
        func.count(distinct(Labelling.l_id)).label('label_count')
    # In the given project
    ).where(
        Labelling.p_id == p_id
    # Grouped by artifacts and by label type
    ).group_by(
        Labelling.a_id,
        Labelling.lt_id
    ).subquery()

    # Number of conflicts per artifact
    per_artifact = select(
        # Artifact id
        per_label_type.c.a_id,
        # Number of conflicts (replace count with a_id?)
        func.count(per_label_type.c.lt_id).label('conflict_count')
    ).where(
        # Counts as a conflict if there is more than one distinct label for a label type
        per_label_type.c.label_count > 1
    ).group_by(
        # Grouped by artifact
        per_label_type.c.a_id
    ).subquery()

    # Sum conflicts across all artifacts
    per_project = select(
        func.sum(per_artifact.c.conflict_count)
    )

    # Make the per_project query to the database
    result = db.session.scalar(per_project)

    # If the query didn't come up with anything,
    #  then there are 0 conflicts
    if not result:
        result = 0

    return result

"""
Author: Eduardo Costa Martins
@returns a dictionary indexed by user id mapping to the number of conflicts 
         the user has in the project given by p_id. A user with 0 conflicts
         is not indexed.
"""
def nr_user_conflicts(p_id):

    # Number of differing labels per label type and artifact
    per_label_type = select(
        Labelling.a_id, # Artifact id
        Labelling.lt_id, # Label type id (can get rid of this maybe?)
        func.count(distinct(Labelling.l_id)).label('label_count') # Distinct labels for a label type (renamed to 'label_count')
    ).where(
        Labelling.p_id == p_id
    ).group_by(
        Labelling.a_id, # Grouped by artifacts and
        Labelling.lt_id # by label type
    ).subquery()

    # Number of conflicts per artifact
    per_artifact = select(
        per_label_type.c.a_id, # Artifact id
        func.count(per_label_type.c.lt_id).label('conflict_count') # Number of conflicts (replace count with a_id?)
    ).where(
        per_label_type.c.label_count > 1 # Counts as a conflict if there is more than one distinct label for a label type
    ).group_by(
        per_label_type.c.a_id # Grouped by artifact
    ).subquery()

    # Pair each user with artifacts they have labelled and the conflicts for that artifact
    per_user_artifact = select(
        Labelling.u_id, Labelling.a_id, per_artifact.c.conflict_count.label('conflict_count')
    ).where(
        Labelling.a_id == per_artifact.c.a_id
    ).group_by(
        Labelling.a_id, Labelling.u_id
    ).subquery()

    # Sum the number of conflicts for each user 
    # (which is summing the conflicts for each artifact the user has labelled)
    per_user = select(
        per_user_artifact.c.u_id, func.sum(per_user_artifact.c.conflict_count)
    ).group_by(
        per_user_artifact.c.u_id
    )

    # Make the per_user query to the database
    results = db.session.execute(per_user).all()

    # Put the results of the query in a dictionary
    results = dict(
        (u_id, int(conflicts)) for u_id, conflicts in results
    )

    return results

@conflict_routes.route("/home", methods=["GET"])
@login_required
def conflicts_home_page(*, user):

    # Get membership of the user
    projects_of_user = db.session.scalars(
        select(
            Membership
        ).where(
            Membership.u_id==user.id,
            Membership.deleted==0
        )
    ).all()

    # List for project information
    projects_info = []

    # Schema to serialize the Project
    project_schema = ProjectSchema()

    # For loop for admin, users, #artifacts
    for membership_project in projects_of_user:

        # Make project variable 
        project = membership_project.project

        # Convert project to JSON
        project_json = project_schema.dump(project)
        
        # Get the project id
        project_id = project.id

        # Get admin status 
        projects_admin = membership_project.admin

        # Get the artifacts for each project 
        project_artifacts_stmt = select(func.count(Artifact.id)).where(Artifact.p_id==project_id)
        project_artifacts = db.session.scalar(project_artifacts_stmt)
        # Get the number of total artifacts
        project_nr_artifacts = project_artifacts
        # Get the number of completely labelled artifacts for each project
        project_nr_cl_artifacts = db.session.scalar(
            project_artifacts_stmt.where(Artifact.completed==True)
        )

        # Get the serialized users in the project
        users = get_serialized_users(project.users)
        
        # Put all values into a dictonary
        info = {
            "project" : project_json,
            "projectAdmin": projects_admin,
            "projectNrArtifacts": project_nr_artifacts,
            "projectNrCLArtifacts": project_nr_cl_artifacts,
            "projectUsers": users
        }
        # Append the dictionary to the list
        projects_info.append(info)

    # Convert the list of dictionaries to json
    dict_json = jsonify(projects_info)

    # Return the list of dictionaries
    return make_response(dict_json)