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

        users = [User(
            username=f"Test{i}",
            password=generate_password_hash("1234"),
            email=f"test{i}@test.com",
            description=f"Description for test user {i}",
            status=UserStatus((i - 1) % 4 - 2)
        ) for i in range(1, 11)]

        db.session.add_all(users)
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