# Ana-Maria Olteniceanu
# Linh Nguyen
# Eduardo Costa Martins

from src.models.item_models import Artifact, LabelType
from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select, func, distinct
from src.models.item_models import Labelling
from src.models.auth_models import UserSchema
from src.models import db
from src.app_util import login_required, check_args, in_project

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

def project_conflicts(p_id):
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
        per_label_type.c.a_id, # Artifact id
        per_label_type.c.lt_id # Label type id of the conflict
    ).where(
        per_label_type.c.label_count > 1 # Counts as a conflict if there is more than one distinct label for a label type
    )

    # Artifacts with conflicts
    artifacts_with_conflicts = select(
        per_label_type.c.a_id, # Artifact id
    ).where(
        per_label_type.c.label_count > 1 # Counts as a conflict if there is more than one distinct label for a label type
    ).subquery()

    # Artifacts with conflicts
    label_types_with_conflicts = select(
        per_label_type.c.lt_id, # Label type id
    ).where(
        per_label_type.c.label_count > 1 # Counts as a conflict if there is more than one distinct label for a label type
    ).subquery()

    conflicts = db.session.execute(per_artifact).all()
    artifacts = set(db.session.scalars(select(Artifact).where(Artifact.id.in_(artifacts_with_conflicts))).all())
    label_types = set(db.session.scalars(select(LabelType).where(LabelType.id.in_(label_types_with_conflicts))).all())

    # Dictionary mapping all ids of artifacts with 
    conflict_artifacts = {}
    for artifact in artifacts:
        conflict_artifacts[artifact.id] = artifact

    conflict_label_types = {}
    for label_type in label_types:
        conflict_label_types[label_type.id] = label_type

    info_list = []

    user_schema = UserSchema()

    for conflict in conflicts:
        # Get the users involved in this conflicts
        users = set(conflict_artifacts[conflict[0]].users)
        info = {
            "a_id": conflict[0],
            "a_data": conflict_artifacts[conflict[0]].data,
            "lt_name": conflict_label_types[conflict[1]].name,
            "users": user_schema.dump(users, many=True)
            }
        info_list.append(info)

    json_list = jsonify(info_list)
    return make_response(json_list)

@conflict_routes.route("/conflictmanagement", methods=["GET"])
@login_required
@in_project
def conflict_management_page():
    # Get args 
    args = request.args

    # TODO: Check that required args are passed
    
    return project_conflicts(args['p_id'])