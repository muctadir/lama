# Veerle Furst
# Eduardo Costa Martins
# Ana-Maria Olteniceanu
# Linh Nguyen

from src.models.project_models import Membership
from flask import current_app as app
from src.models import db
from src.models.auth_models import User, UserSchema, UserStatus, SuperAdmin
from src.models.item_models import Artifact, LabelType, LabelTypeSchema
from src.models.project_models import Project, Membership, ProjectSchema
from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select, update
from src.app_util import login_required, check_args

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
    projects_of_user = db.session.execute(
        select(Membership).where(Membership.u_id==user.id)
    ).scalars().all()

    # List for project information
    projects_info = []

    # Schema to serialize the Project
    project_schema = ProjectSchema()
    # Schema to serialize the User
    user_schema = UserSchema()

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
            project_artifacts_stmt.where(Artifact.completed==True)
        ).scalars().all())

        # Get the users in the project
        project_users = project.users
        # Serialize all users
        users = []  
        for user in project_users:
            user_dumped = user_schema.dump(user)
            user_dumped.pop("password")
            users.append(user_dumped)
        
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
    all_users = db.session.execute(select(User).where(User.status==UserStatus.approved,
            User.type != 'super_admin',
            User.id != user.id)).scalars().all()

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
@login_required
def create_project(*, user):

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
    # Commit the users
    db.session.commit()

    # Get the label types from frontend
    type_names = project_info["labelTypes"]
    # Add each label type to the database
    for type_name in type_names:
        # Create a label type object
        label_type = LabelType(p_id=project.id, name=type_name)
        
        # Add the label type to the database
        db.session.add(label_type)
        db.session.commit()
    return make_response('OK', 200)

"""
For getting current project information
"""
@project_routes.route("/settings", methods=["GET"])
@login_required
#@in_project
def get_project(*, user):
    # Get args 
    args = request.args
    # Required args
    required = ('p_id')
    
    # if not check_args(required, args):
    #     print('bad args')
    #     return make_response('Bad Request', 400)

    project = db.session.get(Project, args['p_id'])
    if not project:
        print('No project')
        return make_response('Project does not exist', 400)

    # Get membership of the user
    users_of_project = db.session.execute(
        select(Membership).where(Membership.p_id==args['p_id'])
    ).scalars().all()
    
    # Serialize all users
    user_schema = UserSchema()

    # Send the label type object
    users_data = [{
        'id': member.user.id,
        'username': member.user.username,
        'admin': member.admin
    } for member in users_of_project]    

    #Get all label types from the project
    labelTypes = db.session.scalars(
            select(LabelType).where(LabelType.p_id==args['p_id'])
        ).all()

    labeltype_schema = LabelTypeSchema()

    # Send the label type object
    label_type_data = [{
        'label_type_id': labelType.id,
        'label_type_name': labelType.name
    } for labelType in labelTypes]

    project_data = jsonify({
        "name": project.name,
        "description": project.description,
        "criteria": project.criteria,
        "frozen": project.frozen,
        "users": users_data,
        "labelType": label_type_data
    })

    return make_response(project_data)



"""
For editing an existing project
"""
@project_routes.route("/edit", methods=["PATCH"])
@login_required
def edit_project(*, user):
    # Get args 
    args = request.json
    # Required args
    required = ('id', 'name', 'description', 'criteria', 'frozen')

    if not check_args(required, args):
        return make_response('Bad Request', 400)

    project = db.session.get(Project, args['id'])
    if not project:
        return make_response('Project does not exist', 400)

    db.session.execute(
        update(Project).where(Project.id == args['id']).values(name=args['name'], 
        description=args['description'], criteria=args["criteria"])
    )
    db.session.commit()

    return make_response('Ok')

"""
For freezing an existing project
"""
@project_routes.route("/freeze", methods=["PATCH"])
@login_required
def freeze_project(*, user):
    # Get args 
    args = request.json
    # Required args
    required = ('id', 'frozen')

    # if not check_args(required, args):
    #     return make_response('Bad Request', 400)

    project = db.session.get(Project, args['id'])
    if not project:
        return make_response('Project does not exist', 400)

    # TODO Make them check if user a part of the project
    # if label.p_id != args["p_id"]:
    #     return make_response('Label not part of project', 400)

    db.session.execute(
        update(Project).where(Project.id == args['id']).values(frozen=args['frozen'])
    )
    db.session.commit()

    return make_response('Ok')