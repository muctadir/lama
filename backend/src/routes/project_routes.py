# Veerle Furst
# Eduardo Costa Martins
# Ana-Maria Olteniceanu
# Linh Nguyen

from src.models.project_models import Membership
from flask import current_app as app
from src.models import db
from src.models.auth_models import User, UserSchema, UserStatus, SuperAdmin
from src.models.item_models import Artifact, LabelType, LabelTypeSchema
from src.models.project_models import Project, Membership, ProjectSchema, MembershipSchema
from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select, func, update
from src.app_util import login_required, check_args
from sqlalchemy.exc import OperationalError, IntegrityError

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
        select(
            Membership
        ).where(
            Membership.u_id==user.id,
            Membership.deleted==0
        )
    ).all()

    # List for project information
    projects_info = []

    # Schema to serialize the Project
    project_schema = ProjectSchema()
    # Schema to serialize the User
    user_schema = UserSchema()
    #Schema to serialize the Membership
    membership_schema = MembershipSchema()

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

        # Get the number of artifacts for each project 
        project_artifacts_stmt = select(func.count(Artifact.id)).where(Artifact.p_id==project_id)
        project_nr_artifacts = db.session.scalar(project_artifacts_stmt)
        # Get the number of completely labelled artifacts for each project
        project_nr_cl_artifacts_stmt = select(func.count(Artifact.id)).where(Artifact.completed==True, Artifact.p_id==project_id)
        project_nr_cl_artifacts = db.session.scalar(project_nr_cl_artifacts_stmt)
        # Get the users still in each project
        project_users_stmt = select(Membership).where(Membership.deleted==False, Membership.p_id==project_id)
        project_users = membership_schema.dump(db.session.scalars(project_users_stmt).all(), many=True)
        #Getting ids of member still in project
        project_members_id = []
        for pUser in project_users:
            project_members_id.append(pUser['u_id'])

        # Get the users in the project
        project_users = project.users
        # Serialize all users
        users = []  
        for user in project_users:
            if(user.id in project_members_id):
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
@params a dictionary of the form: {
    project: dictionary with project information:{
        name: name of project
        description: description of project
        criteria: number of people that have to label an artifact
    }
    labelTypes: list of labeltypes in the project
    users: list of users in the project
}
"""
@project_routes.route("/creation", methods=["POST"])
@login_required
def create_project(*, user):

    # Get the information given by the frontend
    project_info = request.json

    # Get the actual information
    project_info = project_info["params"]

    # Required fields
    required = ["project", "labelTypes", "users"]
    # Check if all required arguments are there
    if not check_args(required, project_info):
        return make_response("Not all required arguments supplied", 400)

    # Required fields inside the project dictionary
    required = ["name", "description", "criteria"]
    # Check if all required arguments are there
    if not check_args(required, project_info["project"]):
        return make_response("Not all required arguments supplied", 400)

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
For getting the information in a project's settings page
@returns a list of dictionaries of the form:
{
    name: name of the project,
    description: description of the project,
    criteria: number of users that need to label an artifact for it to be considered completely labelled,
    frozen: the frozen-status of the project,
    users: users in the project (both removed and remaining),
    labelType: label types in a project
}
"""
@project_routes.route("/settings", methods=["GET"])
@login_required
# @in_project
def get_project(*, user):
    # Get args 
    args = request.args

    #Get project with supplied project ID
    project = db.session.get(Project, args['p_id'])
    #If no such project exists
    if not project:
        return make_response('Project does not exist', 400)

    # Get all users from the project
    users_of_project = db.session.execute(
        select(Membership).where(Membership.p_id==args['p_id'])
    ).scalars().all()
    
    # Serialize all users
    user_schema = UserSchema()

    # Send the user object
    users_data = [{
        'id': member.user.id,
        'username': member.user.username,
        'admin': member.admin,
        'removed': member.deleted
    } for member in users_of_project]    

    #Get all label types from the project
    labelTypes = db.session.scalars(
            select(LabelType).where(LabelType.p_id==args['p_id'])
        ).all()

    #Serialize all label types
    labeltype_schema = LabelTypeSchema()

    # Send the label type object
    label_type_data = [{
        'label_type_id': labelType.id,
        'label_type_name': labelType.name
    } for labelType in labelTypes]

    # Convert the list of dictionaries containing project information to json
    project_data = jsonify({
        "name": project.name,
        "description": project.description,
        "criteria": project.criteria,
        "frozen": project.frozen,
        "users": users_data,
        "labelType": label_type_data
    })

    #Send response to frontend
    return make_response(project_data)

"""
For editing an existing project
@params a dictionary of the form: {
    project: dictionary with project information: {
        id: ID of project
        name: new name of project
        description: new description of project
        criteria: new number of people that have to label an artifact
        frozen: whether the project is frozen
    }
    add: dictionary with added members to the project: {
        id: ID of added user,
        name: name of added user,
        removed: whether this user has previously been deleted (i.e. past member),
        admin: admin status of this user
    }
    update: dictionary with removed members/members with updated information in the project: {
        id: ID of updated user,
        name: name of updated user,
        removed: whether this user is removed from the project,
        admin: admin status of this user
    }
}
"""
@project_routes.route("/edit", methods=["PATCH"])
@login_required
def edit_project(*, user):
    # Get args 
    args = request.json
    # Required args
    required = ('id', 'name', 'description', 'criteria', 'frozen')

    #Checking if the information supplied from front end meets all the required fields
    if not check_args(required, args['params']['project']):
        return make_response('Bad Request', 400)

    #Get project with supplied project ID from args
    project = db.session.get(Project, args['params']['project']['id'])
    if not project:
        return 400

    #Updating project information
    projectUpdated = updateProject(args['params']['project'])
    #Updating members admin status or removing members
    projectMembersUpdated = updateMembersInProject(project.id, args['params']['update'], 1)
    #Adding old members back to the project
    projectOldMembersAdded = updateMembersInProject(project.id, args['params']['add'], 0)
    #Adding new members to the project
    projectNewMembersAdded = addMembers(project.id, args['params']['add'])
    #Checks if everything went well
    if projectUpdated == 200 & projectMembersUpdated == 200 & projectNewMembersAdded == 200 & projectOldMembersAdded == 200:
        #Committing the updates/additions to the databse
        try:
            db.session.commit()
        except OperationalError:
            return make_response('Internal Server Error', 503)
        except IntegrityError:
            return make_response('Integrity Error')
        #Returning a response
        return make_response('Ok')
    else:
        return make_response('Error with saving')

"""
For updating project info
@params a dictionary of the form: {
        id: ID of project
        name: new name of project
        description: new description of project
        criteria: new number of people that have to label an artifact
}
"""
def updateProject(args):
    try:
        #Updating information from the project with info from args
        db.session.execute(
            update(Project).where(Project.id == args['id']).values(name=args['name'], 
            description=args['description'], criteria=args["criteria"])
        )
        #Returning response saying that things went well
        return 200
    except:
        #Returning an error response
        return 400

"""
For updating members information
@params {
    p_id: project ID
    args: a dictionary of the form: {
            id: ID of updated users,
            name: name of updated users,
            removed: whether these users are removed from the project,
            admin: admin statuses of these users
            }
    updateOrAdd: whether the caller is updating members info or adding old members, 1 for "update" and 0 for "add"
}
"""
def updateMembersInProject(p_id, args, updateOrAdd):
    try:
        #List containing members whose information is to be updated/who will be removed
        updatedMembersList = []
        #Appending updated information about each member to the list above
        for mem in args:
            match updateOrAdd:
                case 1:
                    updatedMembersList.append({'p_id': p_id,'u_id': args[mem]['id'],
                    'admin': args[mem]['admin'], 'deleted': args[mem]['removed']})
                case 0:
                    if (args[mem]['removed'] == 1):
                        updatedMembersList.append({'p_id': p_id,'u_id': args[mem]['id'],
                        'admin': args[mem]['admin'], 'deleted': 0})
        #Updating the information in the database
        db.session.bulk_update_mappings(Membership,updatedMembersList)
        #Returning response saying that things went well
        return 200
    except:
        #Returning an error response
        return 400

"""
For adding new members to the project
@params {
    p_id: project ID
    args: a dictionary of the form: {
            id: ID of updated users,
            name: name of updated users,
            removed: whether these users are removed from the project,
            admin: admin statuses of these users
            }
}
"""
def addMembers(p_id, args):
    try:
        #List containing members who will be added to the project (brand new members)
        addedMembersList = []

        #Appending new members' information to the lists above
        for mem in args:
            if (args[mem]['removed'] == 0):
                addedMembersList.append({'p_id': p_id,'u_id': args[mem]['id'],
                'admin': args[mem]['admin'], 'deleted': 0})
        #Adding members to the database
        db.session.bulk_insert_mappings(Membership, addedMembersList)
        #Returning response saying that things went well
        return 200
    except:
        #Returning an error response
        return 400


"""
For freezing a project
@params a dictionary of the form: {
    id: ID of project
    frozen: whether the project is frozen
}
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

    #Get project with supplied ID
    project = db.session.get(Project, args['params']['id'])
    if not project:
        return make_response('Project does not exist', 400)

    #Updating the frozen status of the project
    db.session.execute(
        update(Project).where(Project.id == args['params']['id']).values(frozen=args['params']['frozen'])
    )

    #Committing the information to the backend
    try: 
        db.session.commit()
    except OperationalError:
        return make_response('Internal Server Error', 503)

    #Returning a response
    return make_response('Ok')