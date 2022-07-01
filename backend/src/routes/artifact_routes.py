# Victoria Bogachenkova
# Ana-Maria Olteniceanu
# Eduardo Costa Martis
# Thea Bradley

from src.models.project_models import Project
from src.models import db
from src.models.item_models import Artifact, Labelling, LabelType
from src.models.change_models import ChangeType
from src.models.project_models import Project
from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select, func, distinct
from src.app_util import login_required, not_frozen, in_project, check_args
from sqlalchemy.exc import OperationalError
from src.models.auth_models import User
from src.searching.search import search_func_all_res, best_search_results
from hashlib import blake2b

artifact_routes = Blueprint("artifact", __name__, url_prefix="/artifact")

# Route to return all the artifact data for a specific page
# That is visible to the logged in user
@artifact_routes.route("/artifactmanagement", methods=["GET"])
@login_required
@in_project
def get_artifacts(*, user, membership):
    # Get args from request
    args = request.args
    # What args are required
    required = ('p_id', 'page', 'page_size', 'seek_index', 'seek_page')

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    p_id = args['p_id']
    # The page of artifacts we are trying to retrieve
    page = int(args['page']) - 1
    # How many pages we can skip by using the seek index
    seek_page = int(args['seek_page']) - 1
    page_size = int(args['page_size'])
    # The indexes we can skip using the where clause. See below explanation for how the seek method works.
    seek_index = args['seek_index']
    # Get the number of label types in the project
    n_label_types = db.session.scalar(
        select(func.count(distinct(LabelType.id)))
        .where(LabelType.p_id == p_id)
    )

    # We use seek method for pagination. Offset in SQL is slow since it still goes through
    # all the rows before discarding them. Keep a seek index of the max index we can discard.
    # We also keep the seek page to see how many pages we still need to offset.
    # NB: seek method only works when we order by index since it is unique and non-nullable
    # Check if user is admin for the project and get artifacts
    if membership.admin:
        # If the user is admin, then get any artifact in the project for a certain page
        artifacts = db.session.scalars(
            select(Artifact)
            .where(
                Artifact.p_id == p_id,
                Artifact.id > seek_index)
            .offset((page - seek_page - 1) * page_size)
            .limit(page_size)
        ).all()
        # Get the number of artifacts in the project
        n_artifacts = db.session.scalar(
            select(func.count(Artifact.id))
            .where(Artifact.p_id == p_id)
        )
    else:
        # If user isn't admin, then get all artifacts the user has labelled

        # Get only the artifacts the user has labelled in the current project (for a certain page)
        artifacts = db.session.scalars(
            select(Artifact)
            .where(
                Artifact.id == Labelling.a_id,
                Labelling.u_id == user.id,
                Labelling.p_id == p_id,
                Artifact.id > seek_index)
            .distinct()
            .offset((page - seek_page - 1) * page_size)
            .limit(page_size)
        ).all()
        # Get the number of artifacts the user has labelled
        n_artifacts = db.session.scalar(
            select(func.count(distinct(Artifact.id)))
            .where(
                Artifact.id == Labelling.a_id,
                Labelling.u_id == user.id,
                Labelling.p_id == p_id)
        )
    # List of artifacts and their labellings to be passed to frontend
    artifact_info = [__get_artifact_info(artifact) for artifact in artifacts]

    response = {
        'info': artifact_info,
        'nArtifacts': n_artifacts,
        'nLabelTypes': n_label_types
    }

    # Return the list of dictionaries
    return make_response(jsonify(response))

# Route to create artifacts
@artifact_routes.route("/creation", methods=["POST"])
@login_required
@in_project
@not_frozen
def add_new_artifacts(*, user, membership):
    # Get args from request
    args = request.json['params']
    # What args are required
    required = ['p_id', 'artifacts']

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    # Get the information given by the frontend
    artifact_info = args['artifacts']['array']

    # List of artifacts to be added
    artifact_object = []

    # Schema to serialize the Artifact
    artifact_schema = Artifact.__marshmallow__()

    # Generate a unique identifier
    identifier = generate_artifact_identifier(args['p_id'])

    # Set the identifier for each artifact and add them to the list of artifact data
    for artifact in artifact_info:
        # Give artifact the identifier
        artifact['identifier'] = identifier
        # Add artifact to the list
        artifact_object.append(artifact_schema.load(artifact))

    # Add the artifact to the database
    db.session.add_all(artifact_object)

    # Flushing updates the ids of the objects to what they actually are in the db
    db.session.flush()

    # Retrieve the ids from the artifacts
    artifact_ids = [artifact.id for artifact in artifact_object]

    # Store the creations in the changelog
    __record_creations(artifact_ids, user.id, args['p_id'])

    # Try commiting the changes
    try:
        db.session.commit()
    except OperationalError as e:
        return make_response('Internal Server Error', 503)

    return make_response({
        'identifier': identifier,
        'admin': membership.admin}, 201)


"""
Route to return the data of a single artifact 
@returns a dictionary of shape
{
  "artifact": the  serialized requested artifact,
  "username": the username of the user making the request,
  "admin": true if the current user is project admin, false otherwise,
  "users": serialized list of users who labelled this artifact
}: 
If extended == 'true', then the response also had the additional values:
{
  "artifact_children": list of the ids of the current artifact's children,
  "artifact_labellings": formatted labellings of the artifact
}
"""
@artifact_routes.route("/singleArtifact", methods=["GET"])
@login_required
@in_project
def single_artifact(*, user, membership):
    # Get args from request
    args = request.args
    # What args are required
    required = ['p_id', 'a_id', 'extended']

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    a_id = args['a_id']

    # Check if the user has access to this artifact
    if not __check_artifact_access(membership.admin, user.id, a_id):
        return make_response("User has not labelled this artifact", 401)

    # Get the current artifact
    artifact = __get_artifact(a_id)

    # Schema to serialize the artifact
    artifact_schema = Artifact.__marshmallow__()

    # Schema to serialize users
    user_schema = User.__marshmallow__()

    # Convert artifact to JSON
    artifact_json = artifact_schema.dump(artifact)

    # Get users who labelled this artifact
    users = db.session.scalars(select(User)
                               .where(Labelling.p_id == args['p_id'], Labelling.u_id == User.id, Labelling.a_id == a_id)
                               .distinct()).all()

    # Serialize users
    users_json = user_schema.dump(users, many=True)

    # Put all values into a dictionary
    info = {
        # The artifact object
        "artifact": artifact_json,
        # Username of the user who requests to see the artifact
        "username": user.username,
        # Admin status of the user who requests to see the artifact
        "admin": membership.admin,
        # List of users who labelled the artifact
        "users": users_json
    }

    # If the extended data was requested, append the requested data
    if args['extended'] == 'true':
        info.update(__get_extended(artifact))

    # Jsonify the dictionary with information
    dict_json = jsonify(info)

    # Return the dictionary
    return make_response(dict_json)

# Route that returns artifacts based on a user's search terms
@artifact_routes.route('/search', methods=['GET'])
@login_required
@in_project
def search(*, user, membership):

    # Get arguments
    args = request.args
    # Required arguments
    required = ['p_id', 'search_words']

    # Check if required agruments are supplied
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    # Get the project id
    p_id = int(args['p_id'])

    # If the user is a admin
    if membership.admin:
        # Get all artifact
        artifacts = db.session.scalars(
            select(Artifact).where(Artifact.p_id == p_id)
        ).all()
    else:
        # Get all artifacts the user has labelled
        artifacts = db.session.scalars(
            select(Artifact).where(Artifact.p_id == p_id,
                                   Labelling.a_id == Artifact.id,
                                   Labelling.u_id == user.id).distinct()
        ).all()

    # The columns we search through
    search_columns = ['id', 'data']

    # Getting result of search
    results = search_func_all_res(
        args['search_words'], artifacts, 'id', search_columns)
    # Take the best results
    clean_results = best_search_results(
        results, len(args['search_words'].split()))
    # Gets the actual artifact object from the search
    artifacts_results = [result['item'] for result in clean_results]

    # Get artifact info (it's already serialised)
    info = [__get_artifact_info(artifact) for artifact in artifacts_results]

    # Return the list of artifacts from the search
    return make_response(jsonify(info))


"""
Function that returns a dictionary with the extended artifact information
@param artifact: the artifact about which information is requested
@returns a dictionary of form:
{
    "artifact_children": list of the ids of the current artifact's children,
    "artifact_labellings": formatted labellings of the artifact
}
"""
def __get_extended(artifact):
    # Children of the artifact
    artifact_children = []

    for child in artifact.children:
        artifact_children.append(child.id)

    # Formatted labellings of the artifact
    labellings_formatted = __aggregate_labellings(artifact)

    # Return the data
    return {
        "artifact_children": artifact_children,
        "artifact_labellings": labellings_formatted
    }


"""
A function that returns the formatted version of an artifact's labellings
@param artifact: the artifact whose labellings are requested
@returns a dictionary whose keys are the usernames of the users who labelled the artifact
and with values that are dictionaries with each label type as key and values dictionary of form:
{
    'name': name of the label in the labelling,
    'labelRemark': remark given to the current labelling,
    'u_id': the id of the user who made the labelling,
    'id': the label id of the label,
    'description': the description of the label, 
    'lt_id': id of the label type which is the key associated with this dictionary
    }
"""
def __aggregate_labellings(artifact):
    # Get all the labellings of the artifact
    labellings = artifact.labellings

    # List containing the resulted aggregated labellings
    result = {}

    # Start aggregating labelling only if the artifact has them
    if len(labellings) > 0:
        # For each labelling
        for labelling in labellings:
            # Get the the user who made the labelling
            user = labelling.user

            # What to add to result
            addition = {
                # Name if the added label
                'name': labelling.label.name,
                # The remark associated with the labelling
                'labelRemark': labelling.remark,
                # The id of the user who made the labelling
                'u_id': user.id,
                # The label id of the label
                'id': labelling.l_id,
                # The description of the label
                'description': labelling.label.description,
                # The label type id of the label
                'lt_id': labelling.lt_id
            }

            # If the user is not in result, create an entry in result for them
            if user.username not in result:
                result[user.username] = {}
            # Put the addition in result, under the right user and the right label type
            result[user.username][labelling.label_type.name] = addition
        return result

# Route that returns a random artifact
@artifact_routes.route("/randomArtifact", methods=["GET"])
@login_required
@in_project
def random_artifact(*, user):
    # Get args from request
    args = request.args
    # What args are required
    required = ['p_id']

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    # Get the project id
    p_id = int(args['p_id'])

    # Get a random
    artifact = get_random_artifact(user.id, p_id)

    if not artifact:
        return make_response('No artifact')

    childIds = db.session.scalars(
        select(Artifact.id)
        .where(artifact.id == Artifact.parent_id)
    ).all()
    # Schemas to serialize the artifact
    artifact_schema = Artifact.__marshmallow__()

    dict_json = jsonify({
        'artifact': artifact_schema.dump(artifact),
        'parentId': artifact.parent_id,
        'childIds': childIds
    })

    return make_response(dict_json)

# Route that returns the list of users who labelled a specific artifact
@artifact_routes.route("/getLabellers", methods=["GET"])
@login_required
@in_project
def get_labellers(*, user, membership):
    # Get args from request
    args = request.args
    # What args are required
    required = ['p_id', 'a_id']
    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    # Check if the current user has access to the artifact
    # if not __check_artifact_access(membership.admin, user.id, args['a_id']):
    #     return make_response("User has not labelled this artifact", 401)

    labellers = db.session.scalars(
        select(User)
        .where(
            User.id == Labelling.u_id,
            Labelling.a_id == args['a_id']
        )
        .distinct()
    ).all()
    user_schema = User.__marshmallow__()
    json_labellers = jsonify(user_schema.dump(labellers, many=True))

    return make_response(json_labellers)

# Author: Eduardo Costa Martins
# Posts the split to the database
@artifact_routes.route("/split", methods=["POST"])
@login_required
@in_project
@not_frozen
def post_split(*, user):
    args = request.json['params']

    # What args are required
    required = ['p_id', 'parent_id', 'identifier', 'start', 'end', 'data']
    # Check if required args are present
    if not check_args(required, args):
        return make_response("Bad Request", 400)

    # Check if the provided identifier matches the identifier of the parent artifact
    # and if the data provided is the same as the substring indicated by start and end
    if not (db.session.scalar(select(Artifact.identifier).where(
        Artifact.id == args['parent_id'])) == args['identifier']
        and
        db.session.scalar(select(Artifact.data).where(
            Artifact.id == args['parent_id']))[int(args['start']):int(args['end'])] == args['data']):
        return make_response("Bad Request", 400)
    # Declare new artifact
    new_artifact = Artifact(**args)
    # Add the new artifact
    db.session.add(new_artifact)
    # Updates the id for the new artifact
    db.session.flush()
    # Records the split in the artifact changelog
    __record_split(user.id, args['p_id'], new_artifact.id, args['parent_id'])

    try:
        # Commit the artifact
        db.session.commit()
    except OperationalError:
        make_response("Internal Service Error", 503)

    return make_response(str(new_artifact.id), 200)

# Gets a random artifact which has not been already labelled by the user
def get_random_artifact(u_id, p_id):
    # Criteria for artifact completion
    criteria = db.session.scalar(
        select(Project.criteria).where(Project.id == p_id))

    # Artifact ids that have been labelled by enough people
    # NB: Even with conflicts, it still should not be seen by more people
    labellings = select(
        Labelling.a_id,
        Labelling.lt_id,
        func.count(Labelling.l_id).label('label_count')
    ).where(
        Labelling.p_id == p_id
    ).group_by(
        Labelling.a_id,
        Labelling.lt_id
    ).subquery()

    min_labellings = select(
        labellings.c.a_id,
        func.min(labellings.c.label_count).label('min_count')
    ).group_by(
        labellings.c.a_id
    ).subquery()

    completed = select(
        min_labellings.c.a_id
    ).where(
        min_labellings.c.min_count >= criteria
    )

    # Artifact ids that the user has already labelled
    labelled = select(distinct(Labelling.a_id)).where(Labelling.u_id == u_id)

    artifact = db.session.scalar(
        select(Artifact)
        .where(
            Artifact.p_id == p_id,
            Artifact.id.not_in(completed),
            Artifact.id.not_in(labelled)
        ).order_by(func.rand())
        .limit(1)
    )

    return artifact

# Function that gets the artifact with ID a_id
def __get_artifact(a_id):
    return db.session.get(Artifact, a_id)


"""
Generates a unique (in a project) artifact identifier
Author: Ana-Maria Olteniceanu
@params p_id: int, the project id for which you want to generate an identifier
@pre p_id > 0
@throws exception if p_id <= 0
@returns a string which is a unique (within the project) artifact identifier
"""
def generate_artifact_identifier(p_id):
    # Check that p_id > 0
    if p_id <= 0:
        raise Exception("Invalid p_id")
    # Length of the identifier
    length = 5

    # Position from generated identifier from which we start extracting the
    # artifact identifier
    start = 0

    # Position from generated identifier at which we stop extracting
    # the artifact identifier
    stop = start + length

    # Create hash object
    h = blake2b()

    # Seed of the hash
    identifiers = db.session.scalars(
        select(distinct(Artifact.identifier)).where(Artifact.p_id == p_id)).all()
    # If no identifiers were found, then
    # make identifiers an empty list
    if identifiers is None:
        identifiers = []

    # Generate the artifact identifier
    h.update(bytes([len(identifiers)]))

    # Get the string source of the identifier
    identifier_upper = h.hexdigest().upper()
    # Get a unique identifier
    while identifier_upper[start:stop] in identifiers:
        start += 1
        stop += 1

    # Return the identifier
    return identifier_upper[start:stop]


"""
Records the creation of a list of artifacts in the artifact changelog

@param artifact_ids: a list of ids of artifacts that were created
@param u_id: id of the user that created the artifact
@param p_id: id of the project the artifacts were created in
"""
def __record_creations(artifact_ids, u_id, p_id):
    # PascalCase because it is a class
    ArtifactChange = Artifact.__change__

    # Record each creation as a separate change
    creations = [ArtifactChange(
        u_id=u_id,
        p_id=p_id,
        i_id=a_id,
        change_type=ChangeType.create,
        name=a_id
    ) for a_id in artifact_ids]

    db.session.add_all(creations)


"""
Records an artifact split in the artifact changelog
@param u_id: the id of the user that made the split
@param p_id: the id of the project the artifacts are in
@param a_id: the id of the created artifact
@param parent_id: the id of the artifact that the created artifact was split from
"""
def __record_split(u_id, p_id, a_id, parent_id):
    # PascalCase because it is a class
    ArtifactChange = Artifact.__change__

    change = ArtifactChange(
        u_id=u_id,
        p_id=p_id,
        i_id=a_id,
        change_type=ChangeType.split,
        name=a_id,
        # The encoding for a split is just the parent id
        description=parent_id
    )

    db.session.add(change)


"""
@param artifact : an artifact object
@returns a dictionary of the form 
{
    'artifact' : the serialized artifact object
    'artifact_labellings' : the serialized labellings of that artifact
}
"""
def __get_artifact_info(artifact):
    # Schema to serialize the artifact
    artifact_schema = Artifact.__marshmallow__()
    labelling_schema = Labelling.__marshmallow__()

    # Convert artifact to JSON
    artifact_json = artifact_schema.dump(artifact)
    # Get the serialized labellings
    labellings = labelling_schema.dump(artifact.labellings, many=True)

    # Put all values into a dictionary
    info = {
        "artifact": artifact_json,
        "artifact_labellings": labellings
    }

    return info


"""
Function that checks if a user has access to view a specific artifact
@param admin: true if the current user is project admin, false otherwise
@param u_id: the id of the current user
@param a_id: the id of the current artifact
@returns true if user has access to the artifact, false otherwise
"""
def __check_artifact_access(admin, u_id, a_id):
    # Check if the current user has access to this artifact
    if not admin:
        return db.session.scalar(select(Labelling).where(
            Labelling.u_id == u_id,
            Labelling.a_id == a_id
        )) != None
    return True
