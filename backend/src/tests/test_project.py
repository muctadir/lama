# Author: Linh Nguyen

from sqlalchemy import select
from src.conftest import RequestHandler
from src.models.project_models import Project, Membership, User
from src import db
from src.routes.project_routes import update_project, update_members_in_project, add_members, get_serialized_users, get_users_in_project

#Testing the "Home" route
def test_home(app, client):
    #Request handler to simulate a request to the route, user3 here
    request_handler = RequestHandler(app, client, 4)

    # Using db requires app context
    with app.app_context():
        # Simulate the route "Home"
        response = request_handler.get('/project/home', {}, True)
        # There are not enough arguments, thus evoking error code 200
        assert response.status_code == 200

        # List of dictionaries of projects
        list_of_projects = response.json

        # There are 2 projects for this user
        assert len(list_of_projects) == 2
        # Info to check for project 1 and project 2
        project_1_info = {'id': 1, 'name': 'Project 1', 'description': 'There are 11 conflicts and 11 users. There are 2 label types and 18 labels.  The settings are set to have a labeller count of 2. There are 6 project admins: user1, user2, user3, user4, user10 and admin. There are 7 themes, with one subtheme \\"Database technology\\" from \\"Backend technology\\"', 'criteria': 2, 'frozen': False}
        project_2_info = {'id': 2, 'name': 'Project 2', 'description': 'This project has 1 label type, 7 labels, and 7 users.  There are 4 conflicts. The labeller count 3. The project admins are user1, user5, user10 and admin.', 'criteria': 3, 'frozen': False}
        # Checking if project from the route and project data from the database matches
        # Which means this route functions correctly
        # First project 1
        assert list_of_projects[0]['project'] == project_1_info
        assert list_of_projects[0]['projectAdmin'] == True
        assert list_of_projects[0]['projectNrArtifacts'] == 11
        assert list_of_projects[0]['projectNrCLArtifacts'] == 3
        assert list_of_projects[0]['projectUsers'] == members([1,2,3,4,5,6,7,8,9,10,11])
        # Second project 2
        assert list_of_projects[1]['project'] == project_2_info
        assert list_of_projects[1]['projectAdmin'] == False
        assert list_of_projects[1]['projectNrArtifacts'] == 50
        assert list_of_projects[1]['projectNrCLArtifacts'] == 1
        assert list_of_projects[1]['projectUsers'] == members([1,2,3,4,5,6,11])

# Test the "Users" route that gets all users
def test_get_users(app, client):
    #Request handler to simulate a request to the route
    request_handler = RequestHandler(app, client, 1)

    # Using db requires app context
    with app.app_context():
        # Simulate the route "Users"
        response = request_handler.get('/project/users', {}, True)
        # There are not enough arguments, thus evoking error code 200
        assert response.status_code == 200

        # List of users (with the info in dictionary form)
        list_of_users = response.json

        # Making sure that (retrieved with the route) list_of_users have the same members 
        # as the users from the database
        assert list_of_users == members([2,3,4,5,6,7,8,9,10,11,12])

# Test the "Create" route for project creation
def test_create(app, client):
    #Request handler to simulate a request to the route
    request_handler = RequestHandler(app, client, 1)

    # Using db requires app context
    with app.app_context():
        # Users to be added to the new project
        project_users = [{"u_id": 2, "admin": True}, {"u_id": 3, "admin": False}]
        # Label types to be added to the new project
        project_label_types = ['TestType1', 'TestType2']
        # Info of the new project 
        project_info = {'name': 'test_create', 'description': 'test_create desc', 'criteria': 3}

        # Create a project with the route, but supplying not enough arguments
        # An error 400 with then be evoked
        insufficient_args_response = request_handler.post('/project/creation', {
            'project': project_info,
            'p_id': 1
        }, True)
        assert insufficient_args_response.status_code == 400

        # Create a project with the route, but supplying not enough arguments for project information
        # (i.e. missing description and criteria)
        # An error 400 will then be evoked
        insufficient_project_args_response = request_handler.post('/project/creation', {
            'project': {'p_id': 1, 'name': 'testing'},
            'users': project_users,
            'labelTypes': project_label_types
        }, True)
        assert insufficient_project_args_response.status_code == 400

        # Create a project with the route, but supplying not enough arguments
        # (i.e. nothing from the project information argument)
        # An error 400 will then be evoked
        insufficient_project_args_response = request_handler.post('/project/creation', {
            'project': {},
            'users': project_users,
            'labelTypes': project_label_types
        }, True)
        assert insufficient_project_args_response.status_code == 400

        # There is a leading/trailing whitespace in project name and/or project description
        # An error 400 will then be evoked
        whitespace_project_response = request_handler.post('/project/creation', {
            'project': {'name': ' test_create', 'description': 'test_create desc ', 'criteria': 3},
            'users': project_users,
            'labelTypes': project_label_types
        }, True)
        assert whitespace_project_response.status_code == 400

        # There is an invalid character in project name (#)
        # An error 511 will then be evoked
        invalid_name_response = request_handler.post('/project/creation', {
            'project': {'name': '#test', 'description': 'test_create desc', 'criteria': 3},
            'users': project_users,
            'labelTypes': project_label_types
        }, True)
        assert invalid_name_response.status_code == 511
        
        # Send a request to creat a project
        response = request_handler.post('/project/creation', {
            'project': project_info,
            'users': project_users,
            'labelTypes': project_label_types
        }, True)

        # Status code should be Created
        assert response.status_code == 201

        # Get the project we created
        entry = db.session.scalar(select(Project).where(Project.id == 6))

        # Check that the project was created correctly
        assert entry.id == 6
        assert entry.name == "test_create"
        assert entry.description == "test_create desc"
        assert entry.criteria == 3
        assert entry.frozen == False

# Test the "Settings" route to get info about one project
def test_get_settings(app, client):
    #Request handler to simulate a request to the route
    request_handler = RequestHandler(app, client, 2)

    # Using db requires app context
    with app.app_context():
        # Simulating a request to get a project's settings, but without any arguments
        response = request_handler.get('/project/settings', {}, True)
        # Evoking error 400
        assert response.status_code == 400

        # Simulating a request to get project with ID 10 - non-existent
        response = request_handler.get('/project/settings', {'p_id': 10}, True)
        # Evoking code 400
        assert response.status_code == 401

        # Simulating a request to get project with ID 3
        response = request_handler.get('/project/settings', {'p_id': 3}, True)
        # Successful retrieval thus code 200
        assert response.status_code == 200
        # Transform project into a dictionary
        project_3 = response.json

        # Dictionary of correct info about project 3
        project_3_info = {'id': 3, 'name': 'Project 3', 'description': 'There are 2 label types and 3 users. Project admins are user10 and admin. There is 1 artifact.', 'criteria': 2, 'frozen': False}
        admin = {'id': 1, 'username': 'admin', 'removed': False, 'admin': True, 'super_admin': True}
        user1 = {'id': 2, 'username': 'user1', 'removed': False, 'admin': False, 'super_admin': False}
        user10 = {'id': 11, 'username': 'user10', 'removed': False, 'admin': True, 'super_admin': False}
        # Checking that the retrieved project has these info
        assert project_3['u_id'] == 2
        assert project_3['name'] == project_3_info['name']
        assert project_3['description'] == project_3_info['description']
        assert project_3['criteria'] == project_3_info['criteria']
        assert project_3['frozen'] == project_3_info['frozen']
        assert project_3['users'] == [admin, user1, user10]
        assert project_3['labelType'] == [{'label_type_id': 4, 'label_type_name': 'Code'}, {'label_type_id': 5, 'label_type_name': 'Language'}]

# Test the "Edit" route for project editing
def test_edit(app, client):
    #Request handler to simulate a request to the route, but for a non-admin project member
    request_handler = RequestHandler(app, client, 1)

    # Using db requires app context
    with app.app_context():
        # New info for project to be edited with
        project_info = {'id': 1, 'name': 'test_edit', 'description': 'test_edit desc', 'criteria': 2, 'frozen': False}
        # Members to update the project with
        project_members = {1: {"id": 1, "name": "admin", "removed": False, "admin": True}, 2: {"id": 2, "name": "user1", "removed": False, "admin": True}, 3: {"id": 3, "name": "user2", "removed": False, "admin": False}}

        # Edit a project with the route, but supplying not enough arguments
        # An error 400 will then be evoked
        insufficient_args_response = request_handler.patch('/project/edit', {
            'p_id': 1,
            'project': project_info
        }, True)
        assert insufficient_args_response.status_code == 400

        # Edit a project with the route, but supplying not enough arguments for project information
        # (i.e. missing description and criteria)
        # An error 400 will then be evoked
        insufficient_project_args_response = request_handler.patch('/project/edit', {
            'p_id': 1,
            'project': {'p_id': 1, 'name': 'testing'},
            'add': {},
            'update': project_members
        }, True)
        assert insufficient_project_args_response.status_code == 400

        # Create a project with the route, but supplying not enough arguments for project information
        # (i.e. empty argument)
        # An error 400 will then be evoked
        insufficient_project_args_response = request_handler.patch('/project/edit', {
            'p_id': 1,
            'project': {},
            'add': {},
            'update': project_members
        }, True)
        assert insufficient_project_args_response.status_code == 400

        # Edit a project with the route, but there is trailing/leading whitespace(s) in name and/or description
        # An error 400 will then be evoked
        whitespace_project_response = request_handler.patch('/project/edit', {
            'p_id': 1,
            'project': {'id': 1, 'name': ' test_edit', 'description': 'test_edit desc ', 'criteria': 2, 'frozen': False},
            'add': {},
            'update': project_members
        }, True)
        assert whitespace_project_response.status_code == 400

        # Edit a project with the route, but has invalid character in the name
        # An error 511 will then be evoked
        invalid_name_response = request_handler.patch('/project/edit', {
            'p_id': 1,
            'project': {'id': 1, 'name': '#test_edit', 'description': 'test_edit desc', 'criteria': 2, 'frozen': False},
            'add': {},
            'update': project_members
        }, True)
        assert invalid_name_response.status_code == 511

        # Edit a project by simulating a request
        response = request_handler.patch('/project/edit', {
            'p_id': "1",
            'project': project_info,
            'add': {},
            'update': project_members
        }, True)

        # Status code should be Created
        assert response.status_code == 201

        # Get the project we created
        entry = db.session.scalar(select(Project).where(Project.id == 1))

        # Check that the project was edited correctly
        assert entry.id == 1
        assert entry.name == "test_edit"
        assert entry.description == "test_edit desc"
        assert entry.criteria == 2
        assert entry.frozen == False
        # Check that the members in the project got updated correctly
        check_membership(1, 1, True, False)
        check_membership(1, 2, True, False)
        check_membership(1, 3, False, False)

# Test the auxiliary function that updates the information of a project
def test_update_project(app, client):

    # Using db requires app context
    with app.app_context():
        # New info for project to be edited with
        project_info = {'id': 1, 'name': 'test_edit', 'description': 'test_edit desc', 'criteria': 2, 'frozen': False}
        # Invalid project info (empty arguments) to edit the project with
        invalid_project_info = {}

        # Updating the project with invalid arguments and evoking an error of 400
        response = update_project(invalid_project_info)
        assert response.status_code == 400

        # Edit a project's information fields
        response = update_project(project_info)

        # Status code should be Created with 200
        assert response.status_code == 200

        # Get the project we edited
        entry = db.session.scalar(select(Project).where(Project.id == 1))

        # Check that the project was edited correctly
        assert entry.id == 1
        assert entry.name == "test_edit"
        assert entry.description == "test_edit desc"
        assert entry.criteria == 2
        assert entry.frozen == False

# Test the auxiliary function that updates the members 
# (and/or their admin statuses and membership to the project)
def test_update_members_in_project(app, client):

    # Using db requires app context
    with app.app_context():
        # Members whose info is to be updated
        update_members = {2: {'id': 2, 'removed': False, 'admin': True}, 3: {'id': 3, 'removed': False, 'admin': False}}
        # Removed members who will be added back to the project
        add_old_members = {2: {'id': 2, 'removed': True, 'admin': False}}

        # Updating existing members with function successfully, evoking code 200
        response = update_members_in_project(1, update_members, 1)
        assert response.status_code == 200

        # Get the membership we just updated
        # Check that the user was updated correctly
        check_membership(1, 2, True, False)
        check_membership(1, 3, False, False)

        # Removed user1 from project with function and make sure that it is correctly removed
        update_members[2]['removed'] = True
        response = update_members_in_project(1, update_members, 1)
        assert response.status_code == 200
        check_membership(1,2, True, True)
        # Add user1 back to the project and check that they got added back correctly
        response = update_members_in_project(1, add_old_members, 0)
        assert response.status_code == 200
        check_membership(1, 2, False, False)


# Test the auxiliary function that adds members to the project
def test_add_members(app, client):

    # Using db requires app context
    with app.app_context():
        # Members to be added
        added_members = {7: {'id': 7, 'removed': False, 'admin': True}, 8: {'id': 8, 'removed': False, 'admin': False}}

        # Adding members to the project and making sure that code 200 is evoked
        response = add_members(2, added_members)
        assert response.status_code == 200

        # Get the membership we just updated
        # Check that the user was added correctly
        check_membership(2, 7, True, False)
        check_membership(2, 8, False, False)

# Test the auxiliary function that serliazies a list of User objects
def test_get_serialized_users(app, client):
    # Using db requires app context
    with app.app_context():
        # Getting a list of Users from project 3
        list_user_1_2 = db.session.scalars(select(User).where(User.id==Membership.u_id, Membership.p_id == 3)).all()
        # Asserting that the result of serialization with the function
        # is the same as the expected list of dictionaries of these members
        assert get_serialized_users(list_user_1_2) == members([1,2,11])

# Test the "Freeze" route that changes a project frozen status
def test_freeze(app, client):
    #Request handler to simulate a request to the route from an unauthorized member
    request_handler = RequestHandler(app, client, 1)

    # Using db requires app context
    with app.app_context():
        # Simulating a request to change a project status to frozen
        response = request_handler.patch('/project/freeze', {
            'p_id': "1",
            'frozen': True
        }, True)
        assert response.status_code == 200

        # Get the project we created
        entry = db.session.scalar(select(Project).where(Project.id == 1))

        # Check that the project was frozen correctly
        assert entry.id == 1
        assert entry.frozen == True

# Test the "Single Project" route to get info about one project
def test_get_singleProject(app, client):
    #Request handler to simulate a request to the route
    request_handler = RequestHandler(app, client, 1)

    # Using db requires app context
    with app.app_context():
        # Simulating a request to get a single project, but without any arguments
        response = request_handler.get('/project/singleProject', {}, True)
        # Evoking error 400
        assert response.status_code == 400

        # Simulating a request to get project with ID 3
        response = request_handler.get('/project/singleProject', {'p_id': 3}, True)
        # Successful retrieval thus code 200
        assert response.status_code == 200
        # Transform project into a dictionary
        project_3 = response.json

        # Dictionary of correct info about project 3
        project_3_info = {'id': 3, 'name': 'Project 3', 'description': 'There are 2 label types and 3 users. Project admins are user10 and admin. There is 1 artifact.', 'criteria': 2, 'frozen': False}
        # Checking that the retrieved project has these info
        assert project_3['project'] == project_3_info
        assert project_3['projectNrArtifacts'] == 1
        assert project_3['projectNrCLArtifacts'] == 0
        assert project_3['projectUsers'] == members([1,2,11])
        assert project_3['conflicts'] == 0
        assert project_3['labels'] == 0

# Test the "Project Stats" route that gets statistics about the project
def test_get_projectStats(app, client):
    #Request handler to simulate a request to the route
    request_handler = RequestHandler(app, client, 1)

    # Using db requires app context
    with app.app_context():
        # Simulating a request to get statistics about the project with empty arguments
        response = request_handler.get('/project/projectStats', {}, True)
        # Thus error 400
        assert response.status_code == 400

        # Simulating a request to get statistics about project 2
        response = request_handler.get('/project/projectStats', {'p_id': 2}, True)
        # Thus evoking code 200
        assert response.status_code == 200

        # Transform stats into a dictionary form
        project_2_stats = response.json

        # Dictionaries with correct statistics about each user in project 2
        project_2_admin_stats = {'username': 'admin', 'nr_labelled': 3, 'time': '00:00:07', 'nr_conflicts': 2, 'superadmin': True}
        project_2_user1_stats = {'username': 'user1', 'nr_labelled': 0, 'time': '00:00:00', 'nr_conflicts': 0, 'superadmin': False}
        project_2_user2_stats = {'username': 'user2', 'nr_labelled': 0, 'time': '00:00:00', 'nr_conflicts': 0, 'superadmin': False}
        project_2_user3_stats = {'username': 'user3', 'nr_labelled': 11, 'time': '00:00:06', 'nr_conflicts': 4, 'superadmin': False}
        project_2_user4_stats = {'username': 'user4', 'nr_labelled': 9, 'time': '00:00:03', 'nr_conflicts': 2, 'superadmin': False}
        project_2_user5_stats = {'username': 'user5', 'nr_labelled': 0, 'time': '00:00:00', 'nr_conflicts': 0, 'superadmin': False}
        project_2_user10_stats = {'username': 'user10', 'nr_labelled': 0, 'time': '00:00:00', 'nr_conflicts': 0, 'superadmin': False}
        
        # Checks that retrieved stats from each user in the project has the correct (expected) information
        assert project_2_stats[0] == project_2_admin_stats
        assert project_2_stats[1] == project_2_user1_stats
        assert project_2_stats[2] == project_2_user2_stats
        assert project_2_stats[3] == project_2_user3_stats
        assert project_2_stats[4] == project_2_user4_stats
        assert project_2_stats[5] == project_2_user5_stats
        assert project_2_stats[6] == project_2_user10_stats

# Testing auxiliary function that gets all users (addable to project) from project
def test_get_users_in_project(app, client):
    # Using db requires app context
    with app.app_context():
        # Retrieve users for project 2 with the function
        users_project_2 = get_users_in_project(2)
        # Expected eligible-for-addition members of project 2 (from database)
        members_project_2 = members([1,2,3,4,5,6,11])

        # Checks that these two have the same number of members
        assert len(users_project_2) == len(members_project_2)

        # Checks that each user in the retrieved list and the expected list is the same
        for i in range(0, len(users_project_2)):
            compare_user_object_dict(users_project_2[i], members_project_2[i])
        
# Auxiliary function to check membership of a user in a project        
def check_membership(p_id, u_id, admin, removed):
    # Finds a membership where it has the same project and user id as the supplied ones
    entry = db.session.scalar(select(Membership).where(Membership.p_id == p_id, Membership.u_id == u_id))
    # Checks that therre is indeed such a membership
    assert entry is not None
    # Checks that the admin status is the same as the supplied one
    assert entry.admin == admin
    # Checks that the member is removed or not, based on the supplied value
    assert entry.deleted == removed

# Auxiliary function to create a list of user info dictionaries from a supplied list of IDs
def members(ids_to_add):
    admin = {'id': 1, 'username': 'admin', 'email': '', 'status': 'approved', 'description': 'Auto-generated super admin', 'super_admin': True}
    user1 = {'id': 2, 'username': 'user1', 'email': 'user1@test.com', 'status': 'approved', 'description':  'test', 'super_admin': False}
    user2 = {'id': 3, 'username': 'user2', 'email': 'user2@test.com', 'status': 'approved', 'description':  'test', 'super_admin': False}
    user3 = {'id': 4, 'username': 'user3', 'email': 'user3@test.com', 'status': 'approved', 'description':  'test', 'super_admin': False}
    user4 = {'id': 5, 'username': 'user4', 'email': 'user4@test.com', 'status': 'approved', 'description':  'test', 'super_admin': False}
    user5 = {'id': 6, 'username': 'user5', 'email': 'user5@test.com', 'status': 'approved', 'description':  'test', 'super_admin': False}
    user6 = {'id': 7, 'username': 'user6', 'email': 'user6@test.com', 'status': 'approved', 'description':  'test', 'super_admin': False}
    user7 = {'id': 8, 'username': 'user7', 'email': 'user7@test.com', 'status': 'approved', 'description':  'test', 'super_admin': False}
    user8 = {'id': 9, 'username': 'user8', 'email': 'user8@test.com', 'status': 'approved', 'description':  'test', 'super_admin': False}
    user9 = {'id': 10, 'username': 'user9', 'email': 'user9@test.com', 'status': 'approved', 'description':  'test\\n', 'super_admin': False}
    user10 = {'id': 11, 'username': 'user10','email': 'user10@test.com', 'status': 'approved', 'description':  'test', 'super_admin': False}
    user11 = {'id': 12, 'username': 'vicbog11', 'email': 'test@test.com', 'status': 'approved', 'description':  'test', 'super_admin': False}
    # List of all members
    allmembers = [admin, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, user11]
    # Return a list of only users with the ids in the given list
    returned_list = [user for user in allmembers if user['id'] in ids_to_add]

    return returned_list

# Checks if a user object and a dictionary of user info refer to the same user
def compare_user_object_dict(user_object, user_dict):
    # Checks their id, username, email, status, description and super admin status
    assert user_object.id == user_dict['id']
    assert user_object.username == user_dict['username']
    assert user_object.email == user_dict['email']
    assert user_object.status.name == user_dict['status']
    assert user_object.description == user_dict['description']
    assert user_object.super_admin == user_dict['super_admin']