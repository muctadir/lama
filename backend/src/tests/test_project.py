# Author: Linh Nguyen

from sqlalchemy import select
from src.conftest import RequestHandler
from src.models.project_models import Project, Membership, User
from src import db
from src.routes.project_routes import update_project, update_members_in_project, add_members, get_serialized_users

def test_home(app, client):
    request_handler = RequestHandler(app, client, 4)

    # Using db requires app context
    with app.app_context():
        response = request_handler.get('/project/home', {}, True)

        assert response.status_code == 200

        list_of_projects = response.json

        assert len(list_of_projects) == 2
        project_1_info = {'id': 1, 'name': 'Project 1', 'description': 'There are 11 conflicts and 11 users. There are 2 label types and 18 labels.  The settings are set to have a labeller count of 2. There are 6 project admins: user1, user2, user3, user4, user10 and admin. There are 7 themes, with one subtheme \\"Database technology\\" from \\"Backend technology\\"', 'criteria': 2, 'frozen': False}
        project_2_info = {'id': 2, 'name': 'Project 2', 'description': 'This project has 1 label type, 7 labels, and 7 users.  There are 4 conflicts. The labeller count 3. The project admins are user1, user5, user10 and admin.', 'criteria': 3, 'frozen': False}
        assert list_of_projects[0]['project'] == project_1_info
        assert list_of_projects[1]['project'] == project_2_info
        assert list_of_projects[0]['projectAdmin'] == True
        assert list_of_projects[1]['projectAdmin'] == False
        assert list_of_projects[0]['projectNrArtifacts'] == 11
        assert list_of_projects[1]['projectNrArtifacts'] == 50
        assert list_of_projects[0]['projectNrCLArtifacts'] == 3
        assert list_of_projects[1]['projectNrCLArtifacts'] == 1
        assert list_of_projects[0]['projectUsers'] == members([1,2,3,4,5,6,7,8,9,10,11])
        assert list_of_projects[1]['projectUsers'] == members([1,2,3,4,5,6,11])

def test_get_users(app, client):
    request_handler = RequestHandler(app, client, 1)

    # Using db requires app context
    with app.app_context():
        response = request_handler.get('/project/users', {}, True)

        assert response.status_code == 200

        list_of_users = response.json

        assert list_of_users == members([2,3,4,5,6,7,8,9,10,11,12])

def test_create(app, client):
    request_handler = RequestHandler(app, client, 1)

    # Using db requires app context
    with app.app_context():
        project_users = [{"u_id": 2, "admin": True}, {"u_id": 3, "admin": False}]
        project_label_types = ['TestType1', 'TestType2']
        project_info = {'name': 'test_create', 'description': 'test_create desc', 'criteria': 3}

        insufficient_args_response = request_handler.post('/project/creation', {
            'project': project_info,
            'p_id': 1
        }, True)

        assert insufficient_args_response.status_code == 400

        insufficient_project_args_response = request_handler.post('/project/creation', {
            'project': {'p_id': 1, 'name': 'testing'},
            'users': project_users,
            'labelTypes' : project_label_types
        }, True)

        assert insufficient_project_args_response.status_code == 400

        insufficient_project_args_response = request_handler.post('/project/creation', {
            'project': {},
            'users': project_users,
            'labelTypes' : project_label_types
        }, True)

        assert insufficient_project_args_response.status_code == 400

        whitespace_project_response = request_handler.post('/project/creation', {
            'project': {'name': ' test_create', 'description': 'test_create desc ', 'criteria': 3},
            'users': project_users,
            'labelTypes' : project_label_types
        }, True)

        assert whitespace_project_response.status_code == 400

        invalid_name_response = request_handler.post('/project/creation', {
            'project': {'name': '#test', 'description': 'test_create desc', 'criteria': 3},
            'users': project_users,
            'labelTypes' : project_label_types
        }, True)

        assert invalid_name_response.status_code == 511
        
        response = request_handler.post('/project/creation', {
            'project': project_info,
            'users': project_users,
            'labelTypes' : project_label_types
        }, True)

        # Status code should be Created
        assert response.status_code == 201

        # Get the user we created
        entry = db.session.scalar(select(Project).where(Project.id == 6))

        # Check that the user was created correctly
        assert entry.id == 6
        assert entry.name == "test_create"
        assert entry.description == "test_create desc"
        assert entry.criteria == 3
        assert entry.frozen == False

def test_edit(app, client):
    request_handler = RequestHandler(app, client, 1)

    # Using db requires app context
    with app.app_context():
        project_info = {'id': 1, 'name': 'test_edit', 'description': 'test_edit desc', 'criteria': 2, 'frozen': False}
        project_members = {1: {"id": 1, "name": "admin", "removed": False, "admin": True}, 2: {"id": 2, "name": "user1", "removed": False, "admin": True}, 3: {"id": 3, "name": "user2", "removed": False, "admin": False}}

        insufficient_args_response = request_handler.patch('/project/edit', {
            'p_id': 1,
            'project': project_info
        }, True)

        assert insufficient_args_response.status_code == 400

        insufficient_project_args_response = request_handler.patch('/project/edit', {
            'p_id': 1,
            'project': {'p_id': 1, 'name': 'testing'},
            'add': {},
            'update' : project_members
        }, True)

        assert insufficient_project_args_response.status_code == 400

        insufficient_project_args_response = request_handler.patch('/project/edit', {
            'p_id': 1,
            'project': {},
            'add': {},
            'update' : project_members
        }, True)

        assert insufficient_project_args_response.status_code == 400

        whitespace_project_response = request_handler.patch('/project/edit', {
            'p_id': 1,
            'project': {'id': 1, 'name': ' test_edit', 'description': 'test_edit desc ', 'criteria': 2, 'frozen': False},
            'add': {},
            'update' : project_members
        }, True)

        assert whitespace_project_response.status_code == 400

        invalid_name_response = request_handler.patch('/project/edit', {
            'p_id': 1,
            'project': {'id': 1, 'name': '#test_edit', 'description': 'test_edit desc', 'criteria': 2, 'frozen': False},
            'add': {},
            'update' : project_members
        }, True)

        assert invalid_name_response.status_code == 511

        # Edit a project
        response = request_handler.patch('/project/edit', {
            'p_id': "1",
            'project': project_info,
            'add' : {},
            'update': project_members
        }, True)

        # Status code should be Created
        assert response.status_code == 201

        # Get the user we created
        entry = db.session.scalar(select(Project).where(Project.id == 1))

        # Check that the user was created correctly
        assert entry.id == 1
        assert entry.name == "test_edit"
        assert entry.description == "test_edit desc"
        assert entry.criteria == 2
        assert entry.frozen == False
        check_membership(1, 1, True, False)
        check_membership(1, 2, True, False)
        check_membership(1, 3, False, False)

def test_update_project(app, client):

    # Using db requires app context
    with app.app_context():
        project_info = {'id': 1, 'name': 'test_edit', 'description': 'test_edit desc', 'criteria': 2, 'frozen': False}
        invalid_project_info = projectInfo = {}

        response = update_project(invalid_project_info)
        assert response.status_code == 400

        # Edit a project's information fields
        response = update_project(project_info)

        # Status code should be Created
        assert response.status_code == 200

        # Get the user we created
        entry = db.session.scalar(select(Project).where(Project.id == 1))

        # Check that the user was created correctly
        assert entry.id == 1
        assert entry.name == "test_edit"
        assert entry.description == "test_edit desc"
        assert entry.criteria == 2
        assert entry.frozen == False

def test_update_members_in_project(app, client):

    # Using db requires app context
    with app.app_context():
        update_members = {2: {'id': 2, 'removed': False, 'admin': True}, 3: {'id': 3, 'removed': False, 'admin': False}}
        add_old_members = {2: {'id': 2, 'removed': True, 'admin': False}}

        response = update_members_in_project(1, update_members, 1)
        assert response.status_code == 200

        # Get the membership we just updated
        # Check that the user was updated correctly
        check_membership(1, 2, True, False)
        check_membership(1, 3, False, False)

        update_members[2]['removed'] = True
        response = update_members_in_project(1, update_members, 1)
        assert response.status_code == 200
        check_membership(1,2, True, True)
        response = update_members_in_project(1, add_old_members, 0)
        assert response.status_code == 200
        check_membership(1,2, False, False)

def test_add_members(app, client):

    # Using db requires app context
    with app.app_context():
        added_members = {7: {'id': 7, 'removed': False, 'admin': True}, 8: {'id': 8, 'removed': False, 'admin': False}}

        response = add_members(2, added_members)
        assert response.status_code == 200

        # Get the membership we just updated
        # Check that the user was updated correctly
        check_membership(2, 7, True, False)
        check_membership(2, 8, False, False)

def test_get_serialized_users():
    newUser1 = User(1,'test1', 'testpassword','test@email.com','approved','desc1',False)
    newUser2 = User(2,'test2', 'testpassword2','test2@email.com','approved','desc2',False)
    serialized = [{'id': 1,'username': 'test1', 'email': 'test@email.com','status': 'approved','description': 'desc1', 'super_admin': False},
     {'id': 2,'username': 'test2', 'email': 'test2@email.com','status': 'approved','description': 'desc2', 'super_admin': False}]
    assert get_serialized_users([newUser1, newUser2]) == serialized

def test_freeze(app, client):
    request_handler = RequestHandler(app, client, 1)

    # Using db requires app context
    with app.app_context():

        response = request_handler.patch('/project/freeze', {
             'p_id': "1",
             'frozen': True
         }, True)
        assert response.status_code == 200

        # Get the user we created
        entry = db.session.scalar(select(Project).where(Project.id == 1))

        # Check that the user was created correctly
        assert entry.id == 1
        assert entry.frozen == True

def check_membership(p_id, u_id, admin, removed):
    entry = db.session.scalar(select(Membership).where(Membership.p_id == p_id, Membership.u_id == u_id))
    assert entry.admin == admin
    assert entry.deleted == removed

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
    
    allmembers = [admin, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, user11]
    
    returned_list = [user for user in allmembers if user['id'] in ids_to_add]

    return returned_list