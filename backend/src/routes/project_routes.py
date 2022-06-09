# Veerle Furst
# Eduardo Costa Martins
# Ana-Maria Olteniceanu

from cProfile import label
from datetime import datetime
from multiprocessing import ProcessError
from src.models.project_models import Membership
from flask import current_app as app
from src.models import db
from src.models.auth_models import User, UserSchema, UserStatus, SuperAdmin
from src.models.item_models import Artifact, LabelType, Labelling
from src.models.project_models import Membership, Project, ProjectSchema
from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select, func, distinct
from sqlalchemy.orm import aliased
from src.app_util import login_required
from datetime import time, timedelta

project_routes = Blueprint("project", __name__, url_prefix="/project")

"""
For getting the project information 
@returns a list of dictionaries of the form:
{
    project : the serialized project
    projectAdmin : if the user is an admin
    projectNrArtifacts : number of artifacts in the project
    projectNrCLArtifacts : number of completed artifacts in the project
    projectUsers : number of users in the project
}
"""
@project_routes.route("/home", methods=["GET"])
@login_required
def home_page(*, user):

    # Get membership of the user
    projects_of_user = db.session.execute(
        select(Membership).where(Membership.u_id==user.id)
    ).scalars().all()

    # List for project information
    projects_info = []

    # Schema to serialize the Project
    project_schema = ProjectSchema()
    # Schema to serialize the User
    user_schema = UserSchema()

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
        project_artifacts_stmt = select(Artifact).where(Artifact.p_id==project_id)
        project_artifacts = db.session.execute(project_artifacts_stmt).scalars().all()
        # Get the number of total artifacts
        project_nr_artifacts = len(project_artifacts)
        # Get the number of completely labelled artifacts for each project
        project_nr_cl_artifacts = len(db.session.execute(
            project_artifacts_stmt.where(Artifact.completed==True)
        ).scalars().all())

        # Get the users in the project
        project_users = project.users
        # Serialize all users
        users = []  
        for user in project_users:
            user_dumped = user_schema.dump(user)
            user_dumped.pop("password")
            users.append(user_dumped)
        
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

"""
For getting all users that can be added to a project
@returns a list of users that are not super admins, and not the authenticated user
"""
@project_routes.route("/users", methods=["GET"])
@login_required
def get_users(*, user):

    # Make a list of all approved users
    all_users = db.session.execute(select(User).where(User.status==UserStatus.approved,
            User.type != 'super_admin',
            User.id != user.id)).scalars().all()

    # Schema to serialize the User
    user_schema = UserSchema()

    # Convert the list of users to json
    response_users = jsonify(user_schema.dump(all_users, many=True))

    # Return the list of users
    return make_response(response_users)

"""
For creating a new project
"""
@project_routes.route("/creation", methods=["POST"])
@login_required
def create_project(*, user):

    # Get the information given by the frontend
    project_info = request.json

    # Load the project data into a project object
    project_schema = ProjectSchema()
    project = project_schema.load(project_info["project"])

    # Add the project to the database
    db.session.add(project)
    db.session.commit()
    
    # Get the ids of all users 
    users = project_info["users"]
    # Append the user to the project users attribute
    project.users.extend(users)
    # Also append the user that created the project as an admin
    project.users.append({
        'u_id' : user.id,
        'admin' : True
    })
    # Get the ids of all super_admins
    # For some reason returns a tuple with one element, so we need to get the first element
    super_admin_ids = db.session.execute(select(SuperAdmin.id))
    # Each element in the collection is a tuple (one tuple in this case)
    # Add all super admins as admins
    for super_admin_id in super_admin_ids:
        project.users.append({
            'u_id' : super_admin_id[0],
            'admin' : True
        })
    # Commit the users
    db.session.commit()

    # Get the label types from frontend
    type_names = project_info["labelTypes"]
    # Add each label type to the database
    for type_name in type_names:
        # Create a label type object
        label_type = LabelType(p_id=project.id, name=type_name)
        
        # Add the label type to the database
        db.session.add(label_type)
        db.session.commit()
    return make_response('OK', 200)

"""
For getting data from a single project
"""
@project_routes.route("/singleProject", methods=["GET"])
@login_required
def single_project(*, user):
    # Get project id from the request
    p_id = request.args.get('p_id')

    # Get the project
    project = __get_project(p_id)

    # Schema to serialize the Project
    project_schema = ProjectSchema()
    # Schema to serialize the User
    user_schema = UserSchema()

    # Convert project to JSON
    project_json = project_schema.dump(project)

    # Get the artifacts for each project 
    project_artifacts_stmt = select(Artifact).where(Artifact.p_id==p_id)
    project_artifacts = db.session.execute(project_artifacts_stmt).scalars().all()
    # Get the number of total artifacts
    project_nr_artifacts = len(project_artifacts)
    # Get the number of completely labelled artifacts for each project
    project_nr_cl_artifacts = len(db.session.execute(
        project_artifacts_stmt.where(Artifact.completed==True)
    ).scalars().all())

    # Get the users in the project
    project_users = project.users
    # Serialize all users
    users = []  
    for user in project_users:
        user_dumped = user_schema.dump(user)
        user_dumped.pop("password")
        users.append(user_dumped)
        
    # Put all values into a dictonary
    info = {
        "project" : project_json,
        "projectNrArtifacts": project_nr_artifacts,
        "projectNrCLArtifacts": project_nr_cl_artifacts,
        "projectUsers": users
        }

    # Convert dictionary to json
    dict_json = jsonify(info)

    # Return the list of dictionaries
    return make_response(dict_json)

"""
For getting statistics from a single project
"""
@project_routes.route("/projectStats", methods=["GET"])
@login_required
def project_stats(*, user):
    # Get project id from request
    p_id = request.args.get('p_id')

    # Count conflicts in the project
    total_conflicts, user_conflicts = __count_conflicts(p_id)

    # Get all the users in the project
    project = db.session.execute(
        select(Project).where(Project.id==p_id)
    ).scalars().all()[0]

    # List of all stats per user
    stats = []
    for user in project.users:
        # Get username
        username = user.username

        # Set of artifacts user has labelled
        artifacts = set()
        # List of themes user has used
        themes = set()

        # Average time spent labelling
        # avg_time = __avg_time(user)

        # Total time in seconds spent labelling
        total_time = 0

        # Loop through each labelling to get the necessary data
        for labelling in user.labellings:
            # Add the artifact associated with this labelling to the set of artifacts
            artifacts.add(labelling.artifact)
            # Add the themes associated with this labelling to the list of themes
            themes.add(theme for theme in labelling.label.themes)
            # Add the time spent labelling to the total time
            total_time += __time_in_seconds(labelling.time)

        # Get number of artifacts
        artifacts_num = len(artifacts)
        
        # Get number of themes
        themes_num = len(themes)

        # Get average time of labelling in seconds
        if len(user.labellings) > 0:
            avg_time = total_time / len(user.labellings)
        else:
            # If there are no labelling set average time to 0
            avg_time = 0

        # TODO: Get number of conflicts
        conflicts = 0

        # Add all data to a dictionary
        info = {
            "username": username,
            "nr_labelled": artifacts_num,
            "time": avg_time,
            "nr_themes": themes_num,
            "nr_conflicts": conflicts
        }

        # Add dictionary to list of dictionaries
        stats.append(info)

    # Convert the list of dictionaries to json
    dict_json = jsonify(stats)

    # Return the list of dictionaries
    return make_response(dict_json)

# Function that gets the project with ID p_id
def __get_project(p_id):
    return db.session.get(Project, p_id)

# Function that converts a datetime.time variable into 
# the number of seconds it's equivalent with
def __time_in_seconds(time):
    return (time.hour * 60 + time.minute) * 60 + time.second

# Function that returns the number of conflicts in a project
# and a dictionary with the number of conflicts each user is involved in
def __count_conflicts(p_id):
    # Get artifacts from the current project
    artifacts = db.session.scalars(
            select(Labelling.u_id).where(Labelling.p_id==p_id).group_by(Labelling.a_id, Labelling.lt_id, Labelling.l_id)
            ).all()
def nr_project_conflicts(p_id):
    # Number of differing labels per label type and artifact
    per_label_type = select(
        Labelling.a_id, # Artifact id
        Labelling.lt_id, # Label type id (can get rid of this maybe?)
        func.count(distinct(Labelling.l_id)).label('label_count') # Distinct labels for a label type (renamed to 'label_count')
    ).where(
        Labelling.p_id == p_id # In the given project
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

    per_project = select(
        func.sum(per_artifact.c.conflict_count) # Sum conflicts across all artifacts
    )

    result = db.session.scalar(per_project)

    if not result:
        result = 0

    return result

"""
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

    per_user_artifact = select(
        Labelling.u_id, Labelling.a_id, per_artifact.c.conflict_count.label('conflict_count')
    ).where(
        Labelling.a_id == per_artifact.c.a_id
    ).group_by(
        Labelling.a_id, Labelling.u_id
    ).subquery()

    per_user = select(
        per_user_artifact.c.u_id, func.sum(per_user_artifact.c.conflict_count)
    ).group_by(
        per_user_artifact.c.u_id
    )

    results = db.session.execute(per_user).all()

    # TODO: Add zeros automatically
    results = dict(
        (u_id, int(conflicts)) for u_id, conflicts in results
    )

    return results
