# Victoria Bogachenkova
# Ana-Maria Olteniceanu

from importlib.metadata import requires
from src.app_util import in_project
from src.app_util import check_args
from flask import current_app as app
from src.models import db
from src.models.item_models import Artifact, ArtifactSchema, Labelling, LabellingSchema
from src.models.project_models import Membership
from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select, func
from src.app_util import login_required
from sqlalchemy.exc import  OperationalError
from src.models.auth_models import User, UserSchema

artifact_routes = Blueprint("artifact", __name__, url_prefix="/artifact")

@artifact_routes.route("/artifactmanagement", methods=["GET"])
@login_required
def get_artifacts(*, user):
    # Get args from request 
    args = request.args
    # What args are required
    required = ['p_id']

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    p_id = args['p_id']

    # Get membership of the user
    membership = db.session.get(Membership, {'u_id': user.id, 'p_id': p_id})

    # Check that the membership exists
    if (not membership):
        return make_response('Unauthorized', 401)
    
    # Check if user is admin for the project and get artifacts
    if membership.admin:
        # If the user is admin, then get all artifacts in the project
        artifacts = db.session.execute(
            select(Artifact).where(Artifact.p_id==p_id)
        ).scalars().all()
    else:
        # If user isn't admin, then get all artifacts the user has labelled
        artifacts = set()

        # Get all the labellings the user has done in the current project
        labellings = db.session.execute(
            select(Labelling).where(Labelling.u_id==user.id, Labelling.p_id==p_id)
        ).scalars().all()

        # Take the artifacts labelled by the user
        for labelling in labellings:
            artifacts.add(labelling.artifact)

    # List of artifacts to be passed to frontend
    artifact_info = []

    # Schema to serialize the artifact
    artifact_schema = ArtifactSchema()

    # For each displayed artifact
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
def add_new_artifacts(*, user):
    # Get args from request 
    args = request.args
    # What args are required
    required = ['p_id']

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    # Get the information given by the frontend
    artifact_info = request.json

    # Schema to serialize the Artifact
    artifact_schema = ArtifactSchema()
    for artifact in artifact_info:

        artifact_object = artifact_schema.load(artifact)

        # Add the artifact to the database
        db.session.add(artifact_object)
    
    # Try commiting the artifacts
    try:
        db.session.commit()
    except OperationalError:
        return make_response('Internal Server Error', 503)

    return make_response("Route accessed")

@artifact_routes.route("/singleArtifact", methods=["GET"])
@login_required
def single_artifact(*, user):
    # Get args from request 
    args = request.args
    # What args are required
    required = ['a_id', 'extended']

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
        "username": user.username
    }

    # If the extended data was requested, append the requested data
    if args['extended'] == 'true':
        info.update(__get_extended(artifact))

    # Jsonify the dictionary with information
    dict_json = jsonify(info)

    # Return the dictionary
    return make_response(dict_json)

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

def __get_artifact(a_id):
    return db.session.get(Artifact, a_id)


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


@artifact_routes.route("/getLabelers", methods=["GET"])
@login_required
@in_project
def get_labelers():
    # Get args from request 
    args = request.args
    # What args are required
    required = ['p_id','a_id']
    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)
    labelers = db.session.scalars(
        select(User)
        .where(
            User.id == Labelling.u_id,
            Labelling.a_id == args['a_id']
        )
    ).all()
    user_schema = UserSchema()
    json_labellers = jsonify(user_schema.dump(labelers, many=True))


    return make_response(json_labellers)


@artifact_routes.route("/getLabelers", methods=["GET"])
@login_required
@in_project
def get_labells_by_label_type():
    # Get args from request 
    args = request.args
    # What args are required
    required = ['p_id','lt_id']
    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    labels = db.session.scalars(
        select(User)
        .where(
            User.id == Labelling.u_id,
            Labelling.a_id == args['a_id']
        )
    ).all()
    user_schema = UserSchema()
    json_labellers = jsonify(user_schema.dump(labelers, many=True))


    return make_response(json_labellers)