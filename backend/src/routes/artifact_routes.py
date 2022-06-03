# Victoria Bogachenkova
# Ana-Maria Olteniceanu

from flask import current_app as app
from src.models import db
from src.models.item_models import Artifact, ArtifactSchema
from src.models.project_models import Membership, Labelling
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
            # select(Artifact).where(Artifact.p_id==p_id, user in Artifact.users)
            select(Labelling).where(Labelling.u_id==user.id, Labelling.p_id==p_id)
        ).scalars().all()

        # Take the artifacts labelled by the user
        for labelling in labellings:
            artifacts.append(labelling.artifact)

    # List of artifacts to be passed to frontend
    artifact_info = []

    # Schema to serialize the Project
    artifact_schema = ArtifactSchema()

    # For each displayed artifact
    for artifact in artifacts:

        # Convert artifact to JSON
        artifact_json = artifact_schema.dump(artifact)

        # Name of the artifact
        artifact_id = artifact.id

        # Text of the artifact
        artifact_text = artifact.data

        # Number of users who labelled this artifact
        artifact_users = len(artifact.users)

        # Put all values into a dictionary
        info = {
            "artifact": artifact_json,
            "artifact_id": artifact_id,
            "artifact_text": artifact_text,
            "artifact_users": artifact_users
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
    i = 0
    for artifact in artifact_info:
        artifact_object = artifact_schema.load(artifact)
        i += 1

        # Add the artifact to the database
        db.session.add(artifact_object)
        db.session.commit()

    return make_response("Route accessed")