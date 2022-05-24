from sqlite3 import OperationalError
from xmlrpc.client import Boolean, boolean
from src.models.project_models import Membership
from flask import current_app as app
from src.models import db
from src.models.auth_models import User, UserSchema
from src.models.item_models import ProjectItem, ChangingItem, Artifact
from src.models.project_models import Project, Membership
from flask import request, jsonify, Blueprint, make_response
from flask_login import current_user
from json import dumps

auth_routes = Blueprint("auth", __name__)

"""
For getting the project information 
@returns a list of dictionaries
"""
@app.route("/home", methods=["GET"])
def homePage():
    # Check if the user is logged in
    if(not current_user.is_authenticated() ):
        # Otherwise send error
        return make_response("Unauthorized", 401)

    # Get the ID of the user currently logged in
    user_id = current_user.get_id()
    
    # Get the project data (id, name, description, constraints, frozen)
    current_user = User.get(user_id)
    if not current_user:
        # Otherwise send error
        return make_response("No user", 0) # TODO change

    # Get membership of the user
    projects_of_user = Membership.query.filter(Membership.uId==user_id)

    # List for project information
    listOfDict = list()

    # For loop for admin, users, #artifacts
    for membership_project in projects_of_user:

        # Make project variable 
        project = membership_project.project
        
        # Get the project id
        project_id = membership_project.pId
        # Get project name
        project_name = project.name
        # Get project description
        project_desc = project.description
        # Get whether project is frozen
        project_frozen = project.frozen

        # Get admin status 
        projects_admin = membership_project.admin

        # Get the artifacts for each project 
        project_artifacts = Artifact.query.filter(Artifact.p_id==project_id)
        # Get the number of total artifacts
        project_nr_artifacts = project_artifacts.count()
        # Get the number of completely labelled artifacts for each project 
        project_nr_cl_artifacts = project_artifacts.filter(Artifact.completed=="true").count()

        # Get the number users from the project
        project_users = len(project.users)
        
        # Put all values into a dictonary
        info ={
            "projectId": project_id, 
            "projectName": project_name,
            "projectDesc": project_desc,
            "projectFrozen": project_frozen,
            "projectAdmin": projects_admin,
            "projectNrArtifacts": project_nr_artifacts,
            "projectNrCLArtifacts": project_nr_cl_artifacts,
            "projectUsers": project_users
        }
        # Append the dictionary to the list
        listOfDict.append(info)

        # Convert the list of dictionaries to json
        dict_json = dumps(listOfDict)

    # Return the list of dictionaries
    return dict_json