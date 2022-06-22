# Victoria Bogachenkova
# Ana-Maria Olteniceanu
# Eduardo Costa Martis
# Thea Bradley

from importlib.metadata import requires
from src.models.project_models import Project
from src.app_util import in_project
from src.app_util import check_args
from src.models import db
from src.models.item_models import Artifact, ArtifactSchema, Labelling, LabellingSchema, LabelType
from src.models.change_models import ChangeType
from src.models.auth_models import UserSchema
from src.models.project_models import Project, Membership
from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select, func
from src.app_util import login_required
from sqlalchemy.exc import OperationalError
from src.models.auth_models import User, UserSchema
from sqlalchemy import select, func, distinct
from src.app_util import login_required, in_project
from sqlalchemy.exc import  OperationalError
from src.searching.search import search_func_all_res, best_search_results
from hashlib import blake2b

artifact_routes = Blueprint("artifact", __name__, url_prefix="/artifact")


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
        .where(LabelType.p_id==p_id)
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
        
    # List of artifacts to be passed to frontend
    artifact_info = []

    # Schema to serialize the artifact
    artifact_schema = ArtifactSchema()
    labelling_schema = LabellingSchema()

    # For each displayed artifact
    for artifact in artifacts:
        # Convert artifact to JSON
        artifact_json = artifact_schema.dump(artifact)
        # Get the serialized labellings
        labellings = labelling_schema.dump(artifact.labellings, many=True)

        # Put all values into a dictionary
        info = {
            "artifact": artifact_json,
            "artifact_labellings": labellings
        }

        # Append dictionary to list
        artifact_info.append(info)

    response = {
        'info': artifact_info,
        'nArtifacts': n_artifacts,
        'nLabelTypes': n_label_types
    }

    # Return the list of dictionaries
    return make_response(jsonify(response))


@artifact_routes.route("/creation", methods=["POST"])
@login_required
@in_project
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
    artifact_schema = ArtifactSchema()

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
        print(e)
        return make_response('Internal Server Error', 503)

    return make_response({
        'identifier': identifier,
        'admin': membership.admin})


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

    # Get the current artifact
    artifact = __get_artifact(a_id)

    # Schema to serialize the artifact
    artifact_schema = ArtifactSchema()

    # Schema to serialize users
    user_schema = UserSchema()

    # Convert artifact to JSON
    artifact_json = artifact_schema.dump(artifact)

    # Get users who labelled this artifact
    users = db.session.scalars(select(User)
        .where(Labelling.p_id==args['p_id'], Labelling.u_id==User.id, Labelling.a_id==a_id)
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

    # Artifact schema for serializing
    artifact_schema = ArtifactSchema()
    
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

    # Getting result of search
    results = search_func_all_res(args['search_words'], artifacts, 'id', 'data')
    # Take the best results
    clean_results = best_search_results(results, len(args['search_words'].split()))
    # Gets the actual artifact from the search
    artifacts_results = [result['item'] for result in clean_results]

    # Return the list of artifacts from the search
    return make_response(jsonify(artifact_schema.dump(artifacts_results, many=True)))

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


def __get_labellings(artifact):
    # Schema to serialize the labellings
    labelling_schema = LabellingSchema()

    # Get the labellings of this artifact
    artifact_labellings = artifact.labellings

    # Serialize all labellings
    labellings = []
    for labelling in artifact_labellings:
        labelling_json = labelling_schema.dump(labelling)
        labellings.append(labelling_json)

    # Return labellings
    return labellings


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
    artifact_schema = ArtifactSchema()

    dict_json = jsonify({
        'artifact': artifact_schema.dump(artifact),
        'parentId': artifact.parent_id,
        'childIds': childIds
    })

    return make_response(dict_json)


@artifact_routes.route("/getLabellers", methods=["GET"])
@login_required
@in_project
def get_labellers():
    # Get args from request
    args = request.args
    # What args are required
    required = ['p_id', 'a_id']
    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)
    labellers = db.session.scalars(
        select(User)
        .where(
            User.id == Labelling.u_id,
            Labelling.a_id == args['a_id']
        )
        .distinct()
    ).all()
    user_schema = UserSchema()
    json_labellers = jsonify(user_schema.dump(labellers, many=True))

    return make_response(json_labellers)

# Author: Eduardo Costa Martins
# Posts the split to the database
@artifact_routes.route("/split", methods=["POST"])
@login_required
@in_project
def post_split(*, user):
    
    args = request.json['params']
    # What args are required
    required = ('p_id', 'parent_id', 'identifier', 'start', 'end', 'data')
    # Check if required args are present
    if not check_args(required, args):
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
    criteria = db.session.scalar(select(Project.criteria).where(Project.id == p_id))

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
@returns a string which is a unique (within the project) artifact identifier f
"""
def generate_artifact_identifier(p_id):
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
    identifiers = db.session.scalar(select(distinct(Artifact.identifier)).where(Artifact.p_id==p_id))
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
    return identifier_upper[start:length]

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
