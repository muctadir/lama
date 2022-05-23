from pytest import fixture
from src import create_app

@fixture
def app():
    app = create_app({'TESTING': True})
    yield app
    # Tear-down goes here.
    # TODO: Delete migrations folder

@fixture
def client(app):
    return app.test_client()

@fixture
def runner(app):
    return app.test_cli_runner()