# Author: Eduardo Costa Martins

from sqlalchemy import select
from src import db
from src.models.auth_models import User, UserStatus
from src.routes.auth_routes import check_format, taken
from werkzeug.security import check_password_hash
from jwt import decode
from src.conftest import RequestHandler

# TODO: Test check_format() seperately

def test_register(app, client):

    request_handler = RequestHandler(app, client)

    # Using db requires app context
    with app.app_context():
        # Assert that the user we are trying to create does not exist
        assert not taken('Eduardo', 'god_level@programmer.com')

        # Register a new user
        response = request_handler.post('/auth/register', {
            'username': "Eduardo",
            'email': "god_level@programmer.com",
            'password' : "secure-password",
            'passwordR' : "secure-password",
            'description' : "Help, how do I get out of here?"
        }, False)

        # Status code should be Created
        assert response.status_code == 201

        # Get the user we created
        entry = db.session.scalar(select(User).where(User.username == "Eduardo"))

        # Check that the user was created correctly
        assert entry.username == "Eduardo"
        assert check_password_hash(entry.password, "secure-password")
        assert entry.email == "god_level@programmer.com"
        assert entry.description == "Help, how do I get out of here?"
        # assert entry.status == UserStatus.pending
        # Note: since we did not implement super admin approval of users, the status defaults to approved
        assert entry.status == UserStatus.approved

def test_login(app, client):

    # Login details for user1
    login_details = {
        'username': "user1",
        'password': "TESTUSER123"
    }
    login_helper(app, client, login_details, "Success", 2)

    # Wrong password
    login_details = {
        'username': "admin",
        'password': "Password"
    }
    login_helper(app, client, login_details, "Invalid username or password")

    # Non-existent user
    login_details = {
        'username': "this_user_does_not_exist",
        'password': "password"
    }
    login_helper(app, client, login_details, "Invalid username or password")

def test_taken(app):

    with app.app_context():
        assert taken('user1', 'email@not.taken')
        assert taken('name_not_taken', 'user1@test.com')
        assert taken('ùser1', 'user1@test.com')
        assert not taken('name_not_taken', 'email@not.taken')

"""
Author: Eduardo Costa Martins
A helper for executing login tests
@param app: app for the test
@param client: client for the test
@param login_details: dictionary with username and password
@param expected_text: the message we expect from the response
@param u_id: if provided, we expect to become authenticated with this user id. If not provided, we assume a failure
"""
def login_helper(app, client, login_details, expected_text, u_id=None):

    # Logging in does not use the request handler since we need to read the headers
    response = client.post('/auth/login', json=login_details)
    # Assert that the codes and messages are as expected
    assert response.status_code == (200 if u_id is not None else 400)
    assert response.text == expected_text
    # If it is a success code, we expect the token header to be provided
    if u_id is not None:
        # Assert that the headers we need exist
        assert response.headers.get('Access-Control-Expose-Headers') == 'Content-Encoding, u_id_token'
        u_id_token = response.headers.get('u_id_token')
        # Assert that the token represents the correct user id
        assert u_id_token
        assert decode(u_id_token, app.secret_key, algorithms=['HS256'])['u_id_token'] == u_id
    else:
        # FOr a failure we expect there not be a token
        assert not response.headers.get('u_id_token')
        assert not response.headers.get('Access-Control-Expose-Headers')