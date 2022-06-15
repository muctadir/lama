# Victoria Bogachenkova
# Ana-Maria Olteniceanu
# Eduardo Costa Martis
# Thea Bradley

from importlib.metadata import requires
from types import NoneType
from src.app_util import in_project
from src.app_util import check_args
from flask import current_app as app
from src.models import db
from src.models.item_models import Artifact, ArtifactSchema, Labelling, LabellingSchema, Highlight, HighlightSchema
from src.models.project_models import Membership, Project
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
    required = ['p_id']

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    p_id = args['p_id']
    
    # Check if user is admin for the project and get artifacts
    if membership.admin:
        # If the user is admin, then get all artifacts in the project
        artifacts = db.session.execute(
            select(Artifact).where(Artifact.p_id == p_id)
        ).scalars().all()
    else:
        # If user isn't admin, then get all artifacts the user has labelled
        artifacts = set()

        # Get all the labellings the user has done in the current project
        labellings = db.session.execute(
            select(Labelling).where(Labelling.u_id ==
                                    user.id, Labelling.p_id == p_id)
        ).scalars().all()

        # Take the artifacts labelled by the user
        # TODO: Remove for loop
        for labelling in labellings:
            artifacts.add(labelling.artifact)

    # List of artifacts to be passed to frontend
    artifact_info = []

    # Schema to serialize the artifact
    artifact_schema = ArtifactSchema()

    # For each displayed artifact
    # TODO: Remove for loop
    for artifact in artifacts:

        # Convert artifact to JSON
        artifact_json = artifact_schema.dump(artifact)

        # Get the serialized labellings
        labellings = __get_labellings(artifact)

        # Put all values into a dictionary
        info = {
            "artifact": artifact_json,
            "artifact_labellings": labellings
        }

        # Append dictionary to list
        artifact_info.append(info)

    # Convert the list of dictionaries to json
    dict_json = jsonify(artifact_info)

    # Return the list of dictionaries
    return make_response(dict_json)


@artifact_routes.route("/creation", methods=["POST"])
@login_required
@in_project
def add_new_artifacts():
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
    
    # Try commiting the artifacts
    try:
        db.session.commit()
    except OperationalError:
        return make_response('Internal Server Error', 503)

    return make_response("Route accessed")


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

    # Convert artifact to JSON
    artifact_json = artifact_schema.dump(artifact)

    # Put all values into a dictionary
    info = {
        "artifact": artifact_json,
        "username": user.username,
        "admin": membership.admin
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
                Labelling.u_id == user.id)
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
    artifact_children = []\

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
            # Get the username of the user who made it
            user = labelling.user.username

            # What to add to result
            addition = {
                'labellerName': user,
                'labelTypeName': labelling.label_type.name,
                'labelGiven': labelling.label.name,
                'labelRemark': labelling.remark
            }

            # Add the labelling to the result
            if user not in result:
                result[user] = [addition]
            else:
                result[user].append(addition)

        # Format result to be compatible with the frontend
        formatted_result = []
        for labeller in result:
            formatted_result.append({
                'labellerName': labeller,
                'labelsGiven': result[labeller]
            })

        return formatted_result


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

    p_id = int(args['p_id'])

    # TODO: Change to be an artifact that has not been labelled
    artifact = db.session.scalar(
        select(Artifact)
        .where(Artifact.p_id == p_id)
        .order_by(func.rand())
        .limit(1)
    )

    if not artifact:
        return make_response('No artifact')
    # artifact = get_random_artifact(user.id, p_id)

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


@artifact_routes.route("/getLabelers", methods=["GET"])
@login_required
@in_project
def get_labells_by_label_type():
    # Get args from request
    args = request.args
    # What args are required
    required = ['p_id', 'a_id']
    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    # Get all the labels of a specifc label type
    labels = db.session.scalars(
        select(User)
        .where(
            User.id == Labelling.u_id,
            Labelling.a_id == args['a_id']
        )
    ).all()
    # Schema to serialize the User
    user_schema = UserSchema()
    # Jsonify the result
    json_labellers = jsonify(user_schema.dump(labels, many=True))

    return make_response(json_labellers)


artifact_routes.route("/newHighlights", methods=["POST"])


@login_required
@in_project
def add_new_highlights(*, user):
    # Get args from request
    args = request.args
    # What args are required
    required = ['p_id', 'a_id', 'u_id']

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    # Get the information given by the frontend
    highlight_info = request.json

    # Schema to serialize the Highlight
    artifact_schema = HighlightSchema()

    highlight_object = artifact_schema.load(highlight_info["highlight"])

    # Add the highligh to the database
    db.session.add(highlight_object)

    # Try commiting the artifacts
    try:
        db.session.commit()
    except OperationalError:
        return make_response('Internal Server Error', 503)

    return make_response("Route accessed")


def get_random_artifact(u_id, p_id):
    # Criteria for artifact completion
    criteria = db.session.get(Project.criteria, p_id)
    # Artifact ids that have been labelled by enough people
    # NB: Even with conflicts, it still should not be seen by more people
    completed = select(
        Labelling.a_id
    ).where(
        func.count(Labelling.l_id) >= criteria
    ).subquery()
    # Artifact ids that the user has already labelled
    labelled = select(Labelling.a_id).where(Labelling.u_id == u_id).subquery()
    artifact = db.session.scalar(
        select(Artifact)
        .where(Artifact.p_id == p_id)
        .except_(completed, labelled)
        .order_by(func.rand())
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
