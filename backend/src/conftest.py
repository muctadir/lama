from pytest import fixture
from src import create_app
from src import db
from src.models.auth_models import User, UserStatus
from src.models.item_models import Artifact
from src.models.project_models import Project, Membership
from werkzeug.security import generate_password_hash
from sqlalchemy import text

@fixture
def app():
    app = create_app({'TESTING': True})

    with app.app_context():
        
        with open("src/tests/lama_test.sql") as file:
        
            for line in file.readlines():

                db.session.execute(line)
        
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