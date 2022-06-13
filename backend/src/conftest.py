from pytest import fixture
from src import create_app
from src import db
from src.models.auth_models import User, UserStatus
from src.models.item_models import Artifact
from src.models.project_models import Project, Membership
from werkzeug.security import generate_password_hash

@fixture
def app():
    app = create_app({'TESTING': True})

    with app.app_context():

        # Creates 10 users which alternate between deleted, denied, pending, approved
        users = [User(
            username=f"Test{i}",
            password=generate_password_hash("1234"),
            email=f"test{i}@test.com",
            description=f"Description for test user {i}",
            status=UserStatus((i - 1) % 4 - 2)
        ) for i in range(1, 11)]
        db.session.add_all(users)
        db.session.commit()

        # Creates 3 projects, the second of which is frozen
        projects = [Project(
            name=f"Project{i}",
            description=f"Description for test project {i}",
            frozen = i % 2
        ) for i in range(1, 4)]
        db.session.add_all(projects)
        db.session.commit()

        # Assigns the first 6/10 users to the first project
        # The last 6/10 users to the second project (two user overlap in projects)
        # No users to the third project
        # For each project, the first user is an admin, and the second user is soft-deleted
        memberships = [Membership(
            p_id = 1,
            u_id = i,
            admin = i == 1,
            deleted = i == 2
        ) for i in range(1, 7)]
        memberships.extend([Membership(
            p_id = 2,
            u_id = i,
            admin = i == 5,
            deleted = i == 6
        ) for i in range(5, 11)])
        db.session.add_all(memberships)
        db.session.commit()

    yield app
    # Tear-down goes here.
    # TODO: Delete migrations folder

@fixture
def client(app):
    return app.test_client()

@fixture
def runner(app):
    return app.test_cli_runner()