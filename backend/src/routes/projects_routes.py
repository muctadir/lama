# Veerle Furst
# Eduardo Costa Martins
# Ana-Maria Olteniceanu

from src.models.project_models import Membership
from flask import current_app as app
from src.models import db
from src.models.auth_models import User
from src.models.item_models import Artifact
from src.models.project_models import Membership, ProjectSchema
from flask import jsonify, Blueprint, make_response
from flask_login import current_user
from sqlalchemy import select

project_routes = Blueprint("project", __name__, url_prefix="/project")

"""
For getting the project information 
@returns a list of dictionaries
"""
@project_routes.route("/home", methods=["GET"])
def home_page():
    # Check if the user is logged in
    if(not current_user.is_authenticated):
        # Otherwise send error
        return make_response("Unauthorized", 401)

    # Get the ID of the user currently logged in
    user_id = current_user.get_id()
    
    # Get the user
    user = User.get(user_id)
    if not user:
        # Otherwise send error
        return make_response("Not Found", 404)

    # Get membership of the user
    projects_of_user = db.session.execute(
        select(Membership).where(Membership.uId==user_id)
    ).scalars().all()

    # List for project information
    projects_info = []

    # Schema to serialize the Project
    project_schema = ProjectSchema()

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
            project_artifacts_stmt.where(Artifact.completed=="true")
        ).scalars().all())

        # Get the number users from the project
        project_users = len(project.users)
        
        # Put all values into a dictonary
        info ={
            "project" : project_json,
            "projectAdmin": projects_admin,
            "projectNrArtifacts": project_nr_artifacts,
            "projectNrCLArtifacts": project_nr_cl_artifacts,
            "projectUsers": project_users
        }
        # Append the dictionary to the list
        projects_info.append(info)

    # Convert the list of dictionaries to json
    dict_json = jsonify(projects_info)

    # Return the list of dictionaries
    return make_response(dict_json)