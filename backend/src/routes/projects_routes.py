# Veerle Furst
# Eduardo Costa Martins
# Ana-Maria Olteniceanu

from src.models.project_models import Membership
from flask import current_app as app
from src.models import db
from src.models.auth_models import User, UserSchema
from src.models.item_models import Artifact
from src.models.project_models import Membership, MembershipSchema, ProjectSchema, Project
from flask import jsonify, Blueprint, make_response, request
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

"""
For getting all users within the tool
@returns a list of users
"""
@project_routes.route("/users", methods=["GET"])
def get_users():
    # # Check if the user is logged in
    # if(not current_user.is_authenticated):
    #     # Otherwise send error
    #     return make_response("Unauthorized", 401)

    # # Get the ID of the user currently logged in
    # user_id = current_user.get_id()
    
    # # Get the user
    # user = User.get(user_id)
    # if not user:
    #     # Otherwise send error
    #     return make_response("Not Found", 404)


    # Make a list for all users
    all_users = db.session.execute(select(User)).scalars().all()

    # Schema to serialize the User
    user_schema = UserSchema()

    # Convert the list of users to json
    response_users = jsonify(user_schema.dump(all_users, many=True))

    # Return the list of users
    return make_response(response_users)

"""
For creating a new project
"""
@project_routes.route("/creation", methods=["POST"])
def create_project():
    # TODO check if user is legal

    # Get the information given by the frontend
    project_info = request.json

    # Load the project data into a project object
    project_schema = ProjectSchema()
    project = project_schema.load(project_info["project"])

    # Add the project to the database
    db.session.add(project)
    db.session.commit()
    
    # Get the ids of all users 
    users = project_info["users"]
    # Append the user to the project users attribute
    for user in users:
        project.users.append(user)#["u_id"], user["admin"])

    # Commit the users
    db.session.commit()

    # TODO put the label types somewhere
    # label_type=LabelType(name=name)
    # db.session.add(label_type)
    # project.label_types.append(label_type=label_type)
    # db.session.commit()
        
    return "Project created"