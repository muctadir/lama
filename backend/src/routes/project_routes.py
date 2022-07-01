# Veerle Furst
# Eduardo Costa Martins
# Ana-Maria Olteniceanu
# Linh Nguyen

from src.models.project_models import Membership
from src.models import db
from src.models.auth_models import User, UserStatus
from src.models.item_models import Artifact, LabelType, Labelling, Label
from src.models.project_models import Project, Membership
from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select, func, update, distinct
from src.app_util import login_required, check_args, in_project, check_string, check_whitespaces, in_project, not_frozen
from sqlalchemy.exc import OperationalError, IntegrityError
from src.routes.conflict_routes import nr_project_conflicts, nr_user_conflicts

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
            Membership.u_id == user.id,
            Membership.deleted == 0
        )
    ).all()

    # List for project information
    projects_info = []

    # Schema to serialize the Project
    project_schema = Project.__marshmallow__()

    # For loop for admin, users, #artifacts
    for membership_project in projects_of_user:

        # Make project variable
        project = membership_project.project

        # Convert project to JSON
        project_json = project_schema.dump(project)

        # Get admin status
        projects_admin = membership_project.admin

        # Get number of artifacts, and number of completed artifacts
        project_nr_artifacts, project_nr_cl_artifacts = __get_artifact_counts(
            project.id, project.criteria)

        # Get the serialized users in the project
        users = get_serialized_users(get_users_in_project(project.id)
                                     )

        # Put all values into a dictonary
        info = {
            "project": project_json,
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
    all_users = db.session.scalars(select(User).where(User.status == UserStatus.approved,
                                                      User.super_admin == False,
                                                      User.id != user.id)).all()

    # Convert the list of users to json
    response_users = jsonify(get_serialized_users(all_users))

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

    # Check for invalid characters
    if check_whitespaces([project_info['project']['name'], project_info['project']['description']]):
        return make_response("Input contains leading or trailing whitespaces", 400)

    # Check for invalid characters
    if check_string([project_info['project']['name']]):
        return make_response("Input contains a forbidden character", 511)

    # Load the project data into a project object
    project_schema = Project.__marshmallow__()
    project = project_schema.load(project_info["project"])

    # Add the project to the database
    db.session.add(project)

    # Get the ids of all users
    users = {user['u_id']: user['admin'] for user in project_info['users']}

    # Also append the user that created the project as an admin
    users[user.id] = True

    # Get the ids of all super_admins
    super_admin_ids = db.session.scalars(
        select(User.id).where(User.super_admin == True)).all()
    # Add all super admins as admins
    for super_admin_id in super_admin_ids:
        users[super_admin_id] = True

    memberships = [Membership(p_id=project.id, u_id=k, admin=v)
                   for k, v in users.items()]

    db.session.add_all(memberships)

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

    return make_response('Projetc created', 201)


"""
Function to get a serialized list of users
@param users a list of type User, the list of users to be serialized
@returns a list of serialized users
"""
def get_serialized_users(users):
    # Schema to serialize the Users
    user_schema = User.__marshmallow__()

    return user_schema.dump(users, many=True)


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
@in_project
def get_project(*, user):
    # Get args
    args = request.args

    # Required args
    required = ['p_id']

    if not check_args(required, args):
        return make_response('Bad Request', 400)

    # Get project with supplied project ID
    project = db.session.get(Project, args['p_id'])
    # If no such project exists
    if not project:
        return make_response('Project does not exist', 400)

    # Get all users from the project
    users_of_project = db.session.scalars(
        select(Membership).where(Membership.p_id == args['p_id'])
    ).all()

    # Send the user object
    users_data = [{
        'id': member.user.id,
        'username': member.user.username,
        'admin': member.admin,
        'removed': member.deleted,
        'super_admin': member.user.super_admin
    } for member in users_of_project]

    # Get all label types from the project
    label_types = db.session.scalars(
        select(LabelType).where(LabelType.p_id == args['p_id'])
    ).all()

    # Send the label type object
    label_type_data = [{
        'label_type_id': labelType.id,
        'label_type_name': labelType.name
    } for labelType in label_types]

    # Convert the list of dictionaries containing project information to json
    project_data = jsonify({
        "u_id": user.id,
        "name": project.name,
        "description": project.description,
        "criteria": project.criteria,
        "frozen": project.frozen,
        "users": users_data,
        "labelType": label_type_data
    })

    # Send response to frontend
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
@in_project
@not_frozen
def edit_project(*, membership):
    # Check if the current user is project admin
    if (not membership.admin):
        return make_response('This member is not admin', 401)

    # Get args
    args = request.json['params']
    # Required args
    required = ["p_id", "project", "add", "update"]
    required_project = ['id', 'name', 'description', 'criteria', 'frozen']

    # Checking if the information supplied from front end meets all the required fields
    if not check_args(required_project, args['project']) or not check_args(required, args):
        return make_response('Bad Request', 400)

    # Get project with supplied project ID from args
    project = db.session.get(Project, args['project']['id'])
    if not project:
        return make_response('Bad Request', 400)

    # Check for invalid characters
    if check_whitespaces([args['project']['name'], args['project']['description']]):
        return make_response("Input contains leading or trailing whitespaces", 400)

    # Check for invalid characters
    if check_string([args['project']['name']]):
        return make_response("Input contains a forbidden character", 511)

    # Updating project information
    project_updated = update_project(args['project'])
    # Updating members admin status or removing members
    project_members_updated = update_members_in_project(
        project.id, args['update'], 1)
    # Adding old members back to the project
    project_old_members_added = update_members_in_project(
        project.id, args['add'], 0)
    # Adding new members to the project
    project_new_members_added = add_members(project.id, args['add'])
    # Checks if everything went well
    if project_updated.status_code == 200 and project_members_updated.status_code == 200 and project_new_members_added.status_code == 200 and project_old_members_added.status_code == 200:
        # Committing the updates/additions to the databse
        try:
            db.session.commit()
        except OperationalError:
            return make_response('Internal Server Error', 503)
        except IntegrityError:
            return make_response('Integrity Error')
        # Returning a response
        return make_response('Ok', 201)
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
def update_project(args):
    try:
        # Updating information from the project with info from args
        db.session.execute(
            update(Project).where(Project.id == args['id']).values(name=args['name'],
                                                                   description=args['description'], criteria=args["criteria"])
        )
        # Returning response saying that things went well
        return make_response("Updated", 200)
    except OperationalError:
        # Returning an error response
        return make_response("Internal Server Error", 503)
    except:
        return make_response("An error has occurred", 400)


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
def update_members_in_project(p_id, args, update_or_add):
    try:
        # List containing members whose information is to be updated/who will be removed
        updated_members_list = []
        # Appending updated information about each member to the list above
        for mem in args:
            match update_or_add:
                case 1:
                    updated_members_list.append({'p_id': p_id, 'u_id': args[mem]['id'],
                                                 'admin': args[mem]['admin'], 'deleted': args[mem]['removed']})
                case 0:
                    if (args[mem]['removed'] == 1):
                        updated_members_list.append({'p_id': p_id, 'u_id': args[mem]['id'],
                                                     'admin': args[mem]['admin'], 'deleted': 0})
        # Updating the information in the database
        db.session.bulk_update_mappings(Membership, updated_members_list)
        # Returning response saying that things went well
        return make_response("Success", 200)
    except OperationalError:
        # Returning an error response
        return make_response("Internal Service Error", 503)


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
def add_members(p_id, args):
    # List containing members who will be added to the project (brand new members)
    added_members_list = []

    # Appending new members' information to the lists above
    for mem in args:
        if (args[mem]['removed'] == 0):
            added_members_list.append({'p_id': p_id, 'u_id': args[mem]['id'],
                                       'admin': args[mem]['admin'], 'deleted': 0})
    try:
        # Adding members to the database
        db.session.bulk_insert_mappings(Membership, added_members_list)
        # Returning response saying that things went well
        return make_response("Success", 200)
    except OperationalError:
        # Returning an error response
        return make_response("Internal Service Error", 503)


"""
For freezing a project
@params a dictionary of the form: {
    id: ID of project
    frozen: whether the project is frozen
}
"""
@project_routes.route("/freeze", methods=["PATCH"])
@login_required
@in_project
def freeze_project(*, membership):
    # Check if user is admin
    if not membership.admin:
        return make_response('This member is not admin', 401)

    # Get args
    args = request.json['params']
    # Required args
    required = ['p_id', 'frozen']

    # Check if the required arguments are required
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    # Get project with supplied ID
    project = db.session.get(Project, args['p_id'])
    # Check if the project exists
    if not project:
        return make_response('Project does not exist', 400)

    # Updating the frozen status of the project
    db.session.execute(
        update(Project).where(Project.id == args['p_id']).values(
            frozen=args['frozen'])
    )

    # Committing the information to the backend
    try:
        db.session.commit()
    except OperationalError:
        return make_response('Internal Server Error', 503)

    # Returning a response
    return make_response('Ok', 200)


"""
Author: Ana-Maria Olteniceanu
Gets data from a single project
@returns a dictionary of the form 
{
    "project" : the serialized project
    "projectNrArtifacts": the number of artifacts in the project
    "projectNrCLArtifacts": the number of completed artifacts in the project
    "projectUsers": a serialized list of the users in the project
    "conflicts": the number of conflicts in the project
}
"""
@project_routes.route("/singleProject", methods=["GET"])
@login_required
@in_project
def single_project():
    # Get args from request
    args = request.args
    # What args are required
    required = ['p_id']

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    p_id = args['p_id']

    # Get the project
    project = __get_project(p_id)

    # Schema to serialize the Project
    project_schema = Project.__marshmallow__()
    # Schema to serialize the User
    user_schema = User.__marshmallow__()

    # Convert project to JSON
    project_json = project_schema.dump(project)

    project_nr_artifacts, project_nr_cl_artifacts = __get_artifact_counts(
        p_id, project.criteria)

    # Serialize all users
    users = get_serialized_users(get_users_in_project(project.id))

    # Get the number of conflicts in the conflict
    conflicts = nr_project_conflicts(p_id)

    # Get the number of labels in the conflict
    labels = db.session.scalar(
        select(func.count(distinct(Label.id))).where(Label.p_id == p_id))

    # Put all values into a dictonary
    info = {
        "project": project_json,
        "projectNrArtifacts": project_nr_artifacts,
        "projectNrCLArtifacts": project_nr_cl_artifacts,
        "projectUsers": users,
        "conflicts": conflicts,
        "labels": labels
    }

    # Convert dictionary to json
    dict_json = jsonify(info)

    # Return the dictionary
    return make_response(dict_json)


"""
Author: Ana-Maria Olteniceanu
Gets user statistics for a single project
@returns a list of dictionaries of the form 
{
    "username": the username of the user
    "nr_labelled": the number of artifacts the user has labelled
    "time": the average time the user takes to label an artifact
    "nr_conflicts": the number of conflicts the user is involved in
}
"""
@project_routes.route("/projectStats", methods=["GET"])
@login_required
@in_project
def project_stats():
    # Get args from request
    args = request.args
    # What args are required
    required = ['p_id']

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    p_id = int(args['p_id'])

    # Get all the users in the project
    users = get_users_in_project(p_id)

    # Get all users with conflicts and the number of conflicts they have
    user_conflicts = nr_user_conflicts(p_id)

    # List of all stats per user
    stats = []
    for user in users:
        # Get username
        username = user.username

        # Set of artifacts user has labelled
        artifacts = set()

        # Total time in seconds spent labelling
        total_time = 0

        # Loop through each labelling to get the necessary data
        for labelling in user.labellings:
            if labelling.p_id == p_id:
                # Add the artifact associated with this labelling to the set of artifacts
                artifacts.add(labelling.artifact)
                # Add the time spent labelling to the total time
                total_time += __time_in_seconds(labelling.time)

        # Get number of artifacts
        artifacts_num = len(artifacts)

        # Get average time of labelling in seconds
        if len(user.labellings) > 0:
            avg_time = __time_to_string(total_time / len(user.labellings))
        else:
            # If there are no labellings set average time to 0
            avg_time = "00:00:00"

        # Get the number of conflicts in the project
        if user.id in user_conflicts:
            conflicts = user_conflicts[user.id]
        else:
            conflicts = 0

        # Add all data to a dictionary
        info = {
            "username": username,
            "nr_labelled": artifacts_num,
            "time": avg_time,
            "nr_conflicts": conflicts,
            "superadmin": user.super_admin
        }

        # Add dictionary to list of dictionaries
        stats.append(info)

    # Convert the list of dictionaries to json
    dict_json = jsonify(stats)

    # Return the list of dictionaries
    return make_response(dict_json)

# Function that gets the project with ID p_id
def __get_project(p_id):
    return db.session.get(Project, p_id)

# Function that converts a datetime.time variable into
# the number of seconds it's equivalent with
def __time_in_seconds(time):
    return (time.hour * 60 + time.minute) * 60 + time.second

# Function that converts a number of seconds into
# a string showing the time in hh:mm:ss format
def __time_to_string(time):
    # List of time values
    time_list = [0, 0, 0]
    # If the time has a null value, return 0
    if time == None:
        return "00:00:00"
    # Number of minutes
    minutes = int(time / 60)
    # Number of seconds
    time_list[2] = int(time % 60)
    # Number of hours
    time_list[0] = int(minutes / 60)
    # Updated number of minutes
    time_list[1] = int(minutes % 60)
    # String that shows the time
    time_string = ''
    for number in time_list:
        if number == 0:
            time_string += '00:'
        else:
            if number < 10:
                time_string += '0'
            time_string += str(number) + ':'

    # Return the string with the time
    return time_string[:-1]


def __get_artifact_counts(p_id, criteria):

    # Get the number of total artifacts
    project_nr_artifacts = db.session.scalar(select(
        func.count(Artifact.id)
    ).where(
        Artifact.p_id == p_id
    ))

    per_label_type = select(
        # Artifact id
        Labelling.a_id,
        # Label type id (can get rid of this maybe?)
        Labelling.lt_id,
        # Distinct labels for a label type (renamed to 'label_count')
        func.count(distinct(Labelling.l_id)).label('label_count'),
        # Number of times that label type has been labelled
        func.count(Labelling.l_id).label('labelling_count')
    ).where(
        # In the given project
        Labelling.p_id == p_id
    ).group_by(
        # Grouped by artifacts and by label type
        Labelling.a_id,
        Labelling.lt_id
    ).subquery()

    per_artifact = select(
        # Artifact ids
        per_label_type.c.a_id,
        # Max number of distinct labels for the label types of the artifact
        func.max(per_label_type.c.label_count).label('max_distinct'),
        # Minimum number of labellings for the label types of the artifact
        # NB: technically this number should be the same across all label types, since label types can't be left blank
        func.min(per_label_type.c.labelling_count).label('min_labellings')
    ).group_by(
        per_label_type.c.a_id
    ).subquery()

    project_nr_cl_artifacts = db.session.scalar(select(
        # Count number of artifacts
        func.count(per_artifact.c.a_id)
    ).where(
        # Each label type was labelled with at most one type of label
        # (NB: At least one type of label is handled by the next condition)
        per_artifact.c.max_distinct == 1,
        # The label types have each been labelled the required amount of times
        per_artifact.c.min_labellings >= criteria
    ))

    return project_nr_artifacts, project_nr_cl_artifacts


"""
Function to query for the users in a project
@param p_id: the project id
@returns a list of (non-deleted) users in the project p_id 
"""
def get_users_in_project(p_id):
    return db.session.scalars(select(User)
                              .where(
        Membership.u_id == User.id,
        Membership.p_id == p_id,
        Membership.deleted == False,
        User.status == UserStatus.approved
    )).all()
