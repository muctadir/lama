# Victoria Bogachenkova
# Ana-Maria Olteniceanu

from flask import current_app as app
from src.models import db
from src.models.item_models import Artifact, ArtifactSchema, Labelling, LabellingSchema
from src.models.project_models import Membership
from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select
from src.app_util import login_required

artifact_routes = Blueprint("artifact", __name__, url_prefix="/artifact")

@artifact_routes.route("/artifactmanagement", methods=["GET"])
@login_required
def get_artifacts(*, user):

    # Get the information given by the frontend
    # artifacts_info = request.json
    # Get project ID
    # Hardcoded for now
    p_id = request.args.get('p_id', '')

    # Get membership of the user
    membership = db.session.execute(
        select(Membership).where(Membership.u_id==user.id, Membership.p_id==p_id)
    ).scalars().all()[0]

    # Check if user is admin for the project and get artifacts
    if membership.admin == True:
        # If the user is admin, then get all artifacts in the project
        artifacts = db.session.execute(
            select(Artifact).where(Artifact.p_id==p_id)
        ).scalars().all()
    else:
        # If user isn't admin, then get all artifacts the user has labelled
        artifacts = []

        # Get all the labellings the user has done in the current project
        labellings = db.session.execute(
            select(Labelling).where(Labelling.u_id==user.id, Labelling.p_id==p_id)
        ).scalars().all()

        # Take the artifacts labelled by the user
        for labelling in labellings:
            if labelling.artifact not in artifacts:
                artifacts.append(labelling.artifact)

    # List of artifacts to be passed to frontend
    artifact_info = []

    # Schema to serialize the Project
    artifact_schema = ArtifactSchema()
    labelling_schema = LabellingSchema()

    # For each displayed artifact
    for artifact in artifacts:

        # Convert artifact to JSON
        artifact_json = artifact_schema.dump(artifact)

        # Id of the artifact
        artifact_id = artifact.id

        # Artifact identifier
        artifact_identifier = artifact.identifier

        # Text of the artifact
        artifact_text = artifact.data

        # Get the labellings of this artifact
        artifact_labellings = artifact.labellings
        # Serialize all labellings
        labellings = []
        for labelling in artifact_labellings:
            labelling_json = labelling_schema.dump(labelling)
            labellings.append(labelling_json)

        # Put all values into a dictionary
        info = {
            "artifact": artifact_json,
            "artifact_id": artifact_id,
            "artifact_identifier": artifact_identifier,
            "artifact_text": artifact_text,
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

    # Get the information given by the frontend
    artifact_info = request.json

    # Schema to serialize the Artifact
    artifact_schema = ArtifactSchema()
    for artifact in artifact_info:
        artifact_object = artifact_schema.load(artifact)

        # Add the artifact to the database
        db.session.add(artifact_object)
        db.session.commit()

    return make_response("Route accessed")

@artifact_routes.route("/singleArtifact", methods=["GET"])
@login_required
def single_artifact(*, user):
    # Get artifact id
    a_id = request.args.get('a_id', '')

    # Get the current artifact
    artifact = db.session.execute(
        select(Artifact).where(Artifact.id == a_id)
    ).scalars().all()[0]

     # Schema to serialize the artifact
    artifact_schema = ArtifactSchema()

    # Convert artifact to JSON
    artifact_json = artifact_schema.dump(artifact)

    # Id of the artifact
    artifact_id = artifact.id

    # Artifact identifier
    artifact_identifier = artifact.identifier

    # Text of the artifact
    artifact_text = artifact.data

        # Put all values into a dictionary
    info = {
        "artifact": artifact_json,
        "artifact_id": artifact_id,
        "artifact_identifier": artifact_identifier,
        "artifact_text": artifact_text
    }

    # Jsonify the dictionary with information
    dict_json = jsonify(info)

    # Return the dictionary
    return make_response(dict_json)

@artifact_routes.route("/artifactLabellings", methods=["GET"])
@login_required
def artifact_labellings(*, user):
    # Get artifact id
    a_id = request.args.get('a_id', '')

    # Get all the labellings of this artifact
    labellings = db.session.execute(
        select(Labelling).where(Labelling.a_id==a_id)
    ).scalars().all()

    # List for labelling information
    labelling_info = []

    # For each labelling
    for labelling in labellings:
        # Get the username of the labeller
        labeller_name = labelling.user.username

        # Get the remark of this label
        label_remark = labelling.remark

        # Get the label type of this label
        label_type_name = labelling.label.label_type.name

        # Get the given label
        label_given = labelling.label.name

        # Put all values into a dictionary
        info = {
            "labellerName": labeller_name,
            "labelRemark": label_remark,
            "labelTypeName": label_type_name,
            "labelGiven": label_given
        }

        # Append the dictionary to the list
        labelling_info.append(info)

    # Convert the list of dictionaries to json
    dict_json = jsonify(labelling_info)

    # Return the list of dictionaries
    return make_response(dict_json)