# Veerle Furst
# Eduardo Costa Martins
# Ana-Maria Olteniceanu

from src.models.project_models import Membership
from flask import current_app as app
from src.models import db
from src.models.auth_models import User, UserSchema, UserStatus, SuperAdmin
from src.models.item_models import Artifact, LabelType
from src.models.project_models import Membership, ProjectSchema
from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select, func
from src.app_util import check_args, login_required
from sqlalchemy.exc import OperationalError

project_routes = Blueprint("project", __name__, url_prefix="/project")

"""
For getting the project information 
@returns a list of dictionaries of the form:
{
    project : the serialized project
    projectAdmin : if the user is an admin
    projectNrArtifacts : number of artifacts in the project
    projectNrCLArtifacts : number of completed artifacts in the project
    projectUsers : number of users in the project
}
"""
@project_routes.route("/home", methods=["GET"])
@login_required
def home_page(*, user):

    # Get membership of the user
    projects_of_user = db.session.scalars(
        select(Membership).where(Membership.u_id==user.id)
    ).all()

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
        project_artifacts_stmt = select(func.count(Artifact.id)).where(Artifact.p_id==project_id)
        project_artifacts = db.session.scalar(project_artifacts_stmt)
        # Get the number of total artifacts
        project_nr_artifacts = project_artifacts
        # Get the number of completely labelled artifacts for each project
        project_nr_cl_artifacts = db.session.scalar(
            project_artifacts_stmt.where(Artifact.completed==True)
        )

        # Get the serialized users in the project
        users = get_serialized_users(project.users)
        
        # Put all values into a dictonary
        info = {
            "project" : project_json,
            "projectAdmin": projects_admin,
            "projectNrArtifacts": project_nr_artifacts,
            "projectNrCLArtifacts": project_nr_cl_artifacts,
            "projectUsers": users
        }
        # Append the dictionary to the list
        projects_info.append(info)

    # Convert the list of dictionaries to json
    dict_json = jsonify(projects_info)

    # Return the list of dictionaries
    return make_response(dict_json)

"""
For getting all users that can be added to a project
@returns a list of users that are not super admins, and not the authenticated user
"""
@project_routes.route("/users", methods=["GET"])
@login_required
def get_users(*, user):

    # Make a list of all approved users
    all_users = db.session.scalars(select(User).where(User.status==UserStatus.approved,
            User.type != 'super_admin',
            User.id != user.id)).all()

    # Convert the list of users to json
    response_users = jsonify(get_serialized_users(all_users))

    # Return the list of users
    return make_response(response_users)

"""
For creating a new project
"""
@project_routes.route("/creation", methods=["POST"])
@login_required
def create_project(*, user):
    # TODO: Update how to get project_info once requestHandler is used
    # Get the information given by the frontend
    project_info = request.json

    # Load the project data into a project object
    project_schema = ProjectSchema()
    project = project_schema.load(project_info["project"])

    # Add the project to the database
    db.session.add(project)
    
    # Get the ids of all users 
    users = project_info["users"]
    # Append the user to the project users attribute
    project.users.extend(users)
    # Also append the user that created the project as an admin
    project.users.append({
        'u_id' : user.id,
        'admin' : True
    })
    # Get the ids of all super_admins
    # For some reason returns a tuple with one element, so we need to get the first element
    super_admin_ids = db.session.execute(select(SuperAdmin.id))
    # Each element in the collection is a tuple (one tuple in this case)
    # Add all super admins as admins
    for super_admin_id in super_admin_ids:
        project.users.append({
            'u_id' : super_admin_id[0],
            'admin' : True
        })

    # Get the label types from frontend
    type_names = project_info["labelTypes"]
    # Add each label type to the database
    for type_name in type_names:
        # Create a label type object
        label_type = LabelType(p_id=project.id, name=type_name)
        
        # Add the label type to the database
        db.session.add(label_type)

    # Try committing all changes to the database   
    try:
        db.session.commit()
    except OperationalError:
        return make_response('Internal Server Error', 503)
    
    return make_response('OK', 200)

"""
Function to get a serialized list of users
@param users a list of type User, the list of users to be serialized
@returns a list of serialized users
"""
def get_serialized_users(users):
    # Schema to serialize the Users
    user_schema = UserSchema()

     # Serialize all users
    users_list = []  
    for user in users:
        # Serialize the user
        user_dumped = user_schema.dump(user)
        # Pop the password of the user
        user_dumped.pop("password")
        # Add the serialized user to the list of serialized users
        users_list.append(user_dumped)
    
    return users_list