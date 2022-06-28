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

        tet = response.json

        assert len(tet) == 2
        assert tet[0]['project']['id'] == 1
        assert tet[0]['project']['name'] == "Project 1"
        assert tet[1]['project']['id'] == 2
        assert tet[1]['project']['name'] == "Project 2"

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
