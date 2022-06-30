# Ana-Maria Olteniceanu
# Linh Nguyen
# Eduardo Costa Martins

from src.models.item_models import Artifact, LabelType
from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select, func, distinct
from src.models.item_models import Labelling, Label
from src.models.auth_models import UserSchema, User
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
@params p_id: int, id of the project
@returns a dictionary indexed by user id mapping to the number of conflicts 
         the user has in the project given by p_id. A user with 0 conflicts
         is not indexed.
"""
def nr_user_conflicts(p_id):
    # Number of differing labels per label type and artifact
    per_label_type = select(
        # Artifact id
        Labelling.a_id,
        # Label type id (can get rid of this maybe?)
        Labelling.lt_id,
        # Distinct labels for a label type (renamed to 'label_count')
        func.count(distinct(Labelling.l_id)).label('label_count')
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
        # Counts as a conflict if there is more than one distinct label for a label type
    ).where(
        per_label_type.c.label_count > 1
        # Grouped by artifact
    ).group_by(
        per_label_type.c.a_id
    ).subquery()

    # Pair each user with artifacts they have labelled and the conflicts for that artifact
    per_user_artifact = select(
        Labelling.u_id, Labelling.a_id, per_artifact.c.conflict_count.label(
            'conflict_count')
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


""""
Author: Ana-Maria Olteniceanu
Author: Linh Nguyen
@params p_id: int, id of the project
@returns a list of dictionaries of the form:
{
    "a_id": the id of the artifact with a conflct
    "a_data": the data of the artifact 
    "lt_id": the id of the label type with a 
        conflict in the artifact
    "lt_name": the name of the label type
    "users": serialized list of users who labelled this artifact
}
"""
def project_conflicts(p_id, admin, u_id):
    # Artifact IDs involved with this users
    a_per_user = select(distinct(Labelling.a_id)).where(Labelling.u_id == u_id)
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
        Labelling.p_id == p_id)
    if not admin:
        per_label_type = per_label_type.where(Labelling.a_id.in_(a_per_user))

    # Grouped by artifacts and by label type
    per_label_type = per_label_type.group_by(
        Labelling.a_id,
        Labelling.lt_id
    ).subquery()

    # Conflicts per artifact
    per_artifact = select(
        # Artifact id
        per_label_type.c.a_id,
        # Label type id of the conflict
        per_label_type.c.lt_id
        # Counts as a conflict if there is more than one distinct label for a label type
    ).where(
        per_label_type.c.label_count > 1
    )

    # Artifacts with conflicts
    artifacts_with_conflicts = select(
        # Artifact id
        per_label_type.c.a_id,
        # Counts as a conflict if there is more than one distinct label for a label type
    ).where(
        per_label_type.c.label_count > 1
    )

    # Label types with conflicts
    label_types_with_conflicts = select(
        # Label type id
        per_label_type.c.lt_id,
    ).where(
        # Counts as a conflict if there is more than one distinct label for a label type
        per_label_type.c.label_count > 1
    )

    # Get the list of conflicts
    conflicts = db.session.execute(per_artifact).all()
    # Get the list of artifacts with conflicts
    artifacts = set(db.session.scalars(select(Artifact).where(
        Artifact.id.in_(artifacts_with_conflicts))).all())
    # Get the list of label types with conflicts
    label_types = set(db.session.scalars(select(LabelType).where(
        LabelType.id.in_(label_types_with_conflicts))).all())

    # Dictionary mapping all ids of artifacts with artifact objects
    conflict_artifacts = {}
    for artifact in artifacts:
        conflict_artifacts[artifact.id] = artifact

    # Dictionary mapping all ids of label types with label type objects
    conflict_label_types = {}
    for label_type in label_types:
        conflict_label_types[label_type.id] = label_type

    # List of dictionaries to be sent to frontend
    info_list = []

    # User schema to serialize users
    user_schema = UserSchema()

    # Add a dictionary of conflict data to the list of dictionaries
    for conflict in conflicts:
        # Get the users involved in this conflicts
        users = set(conflict_artifacts[conflict[0]].users)
        # Add information to a dictionary
        info = {
            "a_id": conflict[0],
            "a_data": conflict_artifacts[conflict[0]].data,
            "lt_id": conflict[1],
            "lt_name": conflict_label_types[conflict[1]].name,
            "users": user_schema.dump(users, many=True)
            }
        
        # Add the dictionary to the list of dictionaries
        info_list.append(info)

    # Return the list
    return info_list


"""
Route to send conflict information to the frontend
@returns list of dictionaries of the form:
{
    "a_id": the id of the artifact with a conflct
    "a_data": the data of the artifact 
    "lt_id": the id of the label type with a 
        conflict in the artifact
    "lt_name": the name of the label type
    "users": serialized list of users who labelled this artifact
}
"""
@conflict_routes.route("/conflictmanagement", methods=["GET"])
@login_required
@in_project
def conflict_management_page(*, user, membership):
    # Get args
    args = request.args

    # What args are required
    required = ['p_id']

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    # Assigning project ID
    p_id = args['p_id']

    return make_response(jsonify(project_conflicts(p_id, membership.admin, user.id)))
"""
Author: Linh Nguyen & Ana-Maria Olteniceanu
Route to send labelling made by a specific user concerning a certain conflict to the frontend
@returns dictionary with username as key and value is dictionary of the form:
{
    u_id: user ID
    id: label ID
    name: label name
    description: label description
    lt_id: label type ID
}
"""
@conflict_routes.route("/LabelPerUser", methods=["GET"])
@login_required
@in_project
def single_label_per_user():
    # Get args
    args = request.args

    # What args are required
    required = ['p_id', 'a_id', 'lt_id']

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    # Subquery to select the user ids of the users who made a labelling of this label id
    user_per_lt = select(Labelling.u_id).where(
        Labelling.lt_id == args['lt_id'])

    # Get the usernames, the label names and the descriptions of the labels given to this artifact
    userInfo = db.session.execute(select(distinct(User.username), User.id, Labelling.l_id, Label.name, Label.description)
                                  .where(User.id.in_(user_per_lt), User.id == Labelling.u_id, Labelling.l_id == Label.id,
                                         Labelling.lt_id == args['lt_id'], Labelling.a_id == args['a_id'])).all()

    # Processing the response from the database to send to the front-end label ID, name and description
    response = {}
    for labeller in userInfo:
        response[labeller[0]] = {"u_id": labeller[1], "id": labeller[2],
                                 "name": labeller[3], "description": labeller[4], "lt_id": args['lt_id']}

    return make_response(response)
