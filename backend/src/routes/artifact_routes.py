# Victoria Bogachenkova
# Ana-Maria Olteniceanu

from src.models.project_models import Membership
from flask import current_app as app
from src.models import db
# from src.models.auth_models import User, UserSchema, UserStatus, SuperAdmin
from src.models.item_models import Artifact
# from src.models.project_models import Membership, ProjectSchema
from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select
from src.app_util import login_required

artifact_routes = Blueprint("artifact", __name__, url_prefix="/artifact")

@artifact_routes.route("/artifactManagement", methods=["GET"])
@login_required
def artifact_management(*, user):

    # Get the information given by the frontend
    info = request.json
    # Get project ID
    p_id = info["p_id"]

    # Get membership of the user
    membership = db.session.execute(
        select(Membership).where(Membership.u_id==user.id, Membership.p_id==p_id)
    ).scalars().all()[0]

    # Check if user is admin for the and get artifacts
    if membership.admin == "true":
        # If the user is admin, then get all artifacts in the project
        artifacts = db.session.execute(
            select(Artifact).where(Artifact.p_id==p_id)
        ).scalars().all()
    else:
        # If user isn't admin, then get all artifacts the user has labelled
        artifacts = db.sesssion.execute(
            select(Artifact).where(user in Artifact.users)
        ).scalars().all()

    # List of artifacts to be passed to frontend
    artifact_info = []

    # For each displayed artifact
    for artifact in artifacts:

        # Name of the artifact
        artifact_name = artifact.name

        # Text of the artifact
        artifact_text = artifact.data

        # Number of users who labelled this artifact
        artifact_users = len(artifact.users)

        # Put all values in a dictionary
        info = {
            "artifact_name": artifact_name,
            "artifact_text": artifact_text,
            "artifact_users": artifact_users
        }

    # Append dictionary to list
    artifact_info.append(info)

    # Convert the list of dictionaries to json
    dict_json = jsonify(artifact_info)

    # Return the list of dictionaries
    return make_response(dict_json)