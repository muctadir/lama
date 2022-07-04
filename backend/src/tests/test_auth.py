# Author: Eduardo Costa Martins

from sqlalchemy import select
from src import db
from src.models.auth_models import User, UserStatus
from src.routes.auth_routes import taken, check_format
from werkzeug.security import check_password_hash
from jwt import decode
from src.conftest import RequestHandler

def test_register(app, client):

    registration_data = {
        'username': "Eduardo",
        'email': "god_level@programmer.com",
        'password': "secure-password",
        'passwordR': "secure-password",
        'description': "Help, how do I get out of here?"
        }
    # Check that the registration works successfully with valid data
    register_helper(app, client, registration_data, "Created", 201)

    registration_data = {
        'email': "god_level@programmer.com",
        'password': "secure-password",
        'passwordR': "secure-password",
        'description': "Help, how do I get out of here?"
        }
    # Check that the registration returns the right error when there is no username
    register_helper(app, client, registration_data, "Bad Request", 400)

    registration_data = {
        'username': "Eduardo",
        'password': "secure-password",
        'passwordR': "secure-password",
        'description': "Help, how do I get out of here?"
        }
    # Check that the registration returns the right error when there is no email
    register_helper(app, client, registration_data, "Bad Request", 400)

    registration_data = {
        'username': "Eduardo",
        'email': "god_level@programmer.com",
        'passwordR': "secure-password",
        'description': "Help, how do I get out of here?"
        }
    # Check that the registration returns the right error when there is no password
    register_helper(app, client, registration_data, "Bad Request", 400)

    registration_data = {
        'username': "Eduardo",
        'email': "god_level@programmer.com",
        'password': "secure-password",
        'description': "Help, how do I get out of here?"
        }
    # Check that the registration returns the right error when there is no passwordR
    register_helper(app, client, registration_data, "Bad Request", 400)

    registration_data = {
        'username': "Eduardo",
        'email': "god_level@programmer.com",
        'password': "secure-password",
        'passwordR': "secure-password"
        }
    # Check that the registration returns the right error when there is no description
    register_helper(app, client, registration_data, "Bad Request", 400)

    registration_data = {
        'username': "user1",
        'email': "god_level@programmer.com",
        'password': "secure-password",
        'passwordR': "secure-password",
        'description': "Help, how do I get out of here?"
        }
    # Check that the registration returns the right error when the username is taken
    register_helper(app, client, registration_data, "Username or email taken", 400)

    registration_data = {
        'username': "Eduardo",
        'email': "user1@test.com",
        'password': "secure-password",
        'passwordR': "secure-password",
        'description': "Help, how do I get out of here?"
        }
    # Check that the registration returns the right error when the email is taken
    register_helper(app, client, registration_data, "Username or email taken", 400)

    registration_data = {
        'username': " Eduardo",
        'email': "god1_level@programmer.com",
        'password': "secure-password",
        'passwordR': "secure-password",
        'description': "Help, how do I get out of here?"
        }
    # Check that the registration returns the right error when there are trailing white spaces
    register_helper(app, client, registration_data, "Input contains leading or trailing whitespaces", 400)

    registration_data = {
        'username': "Eduardo ",
        'email': "god1_level@programmer.com",
        'password': "secure-password",
        'passwordR': "secure-password",
        'description': "Help, how do I get out of here?"
        }
    # Check that the registration returns the right error when there are trailing white spaces
    register_helper(app, client, registration_data, "Input contains leading or trailing whitespaces", 400)

    registration_data = {
        'username': "Eduardo1",
        'email': " god_1level@programmer.com",
        'password': "secure-password",
        'passwordR': "secure-password",
        'description': "Help, how do I get out of here?"
        }
    # Check that the registration returns the right error when there are trailing white spaces
    register_helper(app, client, registration_data, "Input contains leading or trailing whitespaces", 400)

    registration_data = {
        'username': "Eduardo1",
        'email': "god_1level@programmer.com ",
        'password': "secure-password",
        'passwordR': "secure-password",
        'description': "Help, how do I get out of here?"
        }
    # Check that the registration returns the right error when there are trailing white spaces
    register_helper(app, client, registration_data, "Input contains leading or trailing whitespaces", 400)

    registration_data = {
        'username': "Eduard1o",
        'email': "god_1level@programmer.com",
        'password': " secure-password",
        'passwordR': "secure-password",
        'description': "Help, how do I get out of here?"
        }
    # Check that the registration returns the right error when there are trailing white spaces
    register_helper(app, client, registration_data, "Input contains leading or trailing whitespaces", 400)

    registration_data = {
        'username': "Eduard1o",
        'email': "god_l1evel@programmer.com",
        'password': "secure-password ",
        'passwordR': "secure-password",
        'description': "Help, how do I get out of here?"
        }
    # Check that the registration returns the right error when there are trailing white spaces
    register_helper(app, client, registration_data, "Input contains leading or trailing whitespaces", 400)

    registration_data = {
        'username': "Eduar1do",
        'email': "god_l1evel@programmer.com",
        'password': "secure-password",
        'passwordR': "secure-password",
        'description': " Help, how do I get out of here?"
        }
    # Check that the registration returns the right error when there are trailing white spaces
    register_helper(app, client, registration_data, "Input contains leading or trailing whitespaces", 400)

    registration_data = {
        'username': "Ed1uardo",
        'email': "god_1level@programmer.com",
        'password': "secure-password",
        'passwordR': "secure-password",
        'description': "Help, how do I get out of here? "
        }
    # Check that the registration returns the right error when there are trailing white spaces
    register_helper(app, client, registration_data, "Input contains leading or trailing whitespaces", 400)

    registration_data = {
        'username': "Eduar#do",
        'email': "god1_level@programmer.com",
        'password': "secure-password",
        'passwordR': "secure-password",
        'description': "Help, how do I get out of here?"
        }
    # Check that the registration returns the right error when there are invalid characters
    register_helper(app, client, registration_data, "Input contains a forbidden character", 511)

    registration_data = {
        'username': "Eduardo1",
        'email': "god_level#@programmer.com",
        'password': "secure-password",
        'passwordR': "secure-password",
        'description': "Help, how do I get out of here?"
        }
    # Check that the registration returns the right error when there are invalid characters
    register_helper(app, client, registration_data, "Input contains a forbidden character", 511)

    registration_data = {
        'username': "Eduard1o",
        'email': "go1d_level@programmer.com",
        'password': "secure-passw#ord",
        'passwordR': "secure-password",
        'description': "Help, how do I get out of here?"
        }
    # Check that the registration returns the right error when there are invalid characters
    register_helper(app, client, registration_data, "Input contains a forbidden character", 511)

    # Check that the registration returns the right error when input isn't formatted correctly
    registration_data = {
        'username': "Eduard1o",
        'email': "a",
        'password': "secure-password",
        'passwordR': "secure-password",
        'description': "Help, how do I get out of here?"
        }
    register_helper(app, client, registration_data, "Invalid email", 400)

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

    # username is missing from args
    login_details = {
        'password': "password"
    }
    login_helper(app, client, login_details, "Bad Request")

    # password is missing form args
    login_details = {
        'username': "this_user_does_not_exist"
    }
    login_helper(app, client, login_details, "Bad Request")

def test_check_login(app, client):
    # Request handler
    request_handler = RequestHandler(app, client, 1)

    # Make call to database
    response = request_handler.get('/auth/check_login', {}, True)
    
    # Check that the response is correct
    response.status_code = 200

def test_check_super_admin(app, client):
    # Request handler
    request_handler = RequestHandler(app, client, 1)

    # Make call to database
    response = request_handler.get('/auth/check_super_admin', {}, True)
    
    # Check that the response is correct
    response.status_code = 200

def test_taken(app):

    with app.app_context():
        assert taken('user1', 'email@not.taken')
        assert taken('name_not_taken', 'user1@test.com')
        assert taken('ùser1', 'user1@test.com')
        assert not taken('name_not_taken', 'email@not.taken')

def test_check_format():
    # Test if it returns correctly for invalid username
    assert check_format("a", "", "", "", "") == (False, "Invalid username")

    # Test if it returns correctly for invalid email
    assert check_format("abcdef", "b", "", "", "") == (False, "Invalid email")

    # Test if it returns correctly for invalid password
    assert check_format("abcdef", "a@lama.com", "a", "", "") == (False, "Invalid password")

    # Test if it returns correctly for invalid repeated password
    assert check_format("abcdef", "a@lama.com", "secure-password", "b", "") == (False, "Passwords must match")

    # Test if it returns correctly for invalid repeated password
    assert check_format("abcdef", "a@lama.com", "secure-password", "secure-password", "") == (False, "No description provided")

    # Test if it returns correctly for invalid repeated password
    assert check_format("abcdef", "a@lama.com", "secure-password", "secure-password", "Something") == (True, "Success")

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
        assert response.headers.get(
            'Access-Control-Expose-Headers') == 'Content-Encoding, u_id_token'
        u_id_token = response.headers.get('u_id_token')
        # Assert that the token represents the correct user id
        assert u_id_token
        assert decode(u_id_token, app.secret_key, algorithms=[
                      'HS256'])['u_id_token'] == u_id
    else:
        # For a failure we expect there not be a token
        assert not response.headers.get('u_id_token')
        assert not response.headers.get('Access-Control-Expose-Headers')

"""
Author: Ana-Maria Olteniceanu
A helper for executing register tests
@param app: app for the test
@param client: client for the test
@param registration_details: dictionary with username and password
@param expected_text: the message we expect from the response
@param expected_code: the status code we expect from the response
"""
def register_helper(app, client, registration_details, expected_text, expected_code):
    # Make the registration call
    request_handler = RequestHandler(app, client)
    response = request_handler.post('/auth/register', registration_details, False)

    # Assert that the codes and messages are as expected
    assert response.status_code == expected_code
    assert response.text == expected_text

    # If the expected code is 201, then registration went through and check what was submitted to the database
    if expected_text == 201:
        # Using db requires app context
        with app.app_context():
            # Get the user we created
            entry = db.session.scalar(
                select(User).where(User.username == registration_details["username"]))

            # Check that the user was created correctly
            assert entry.username == registration_details["username"]
            assert check_password_hash(entry.password, registration_details["password"])
            assert entry.email == registration_details["email"]
            assert entry.description == registration_details["description"]

            # Note: since we did not implement super admin approval of users, the status defaults to approved
            assert entry.status == UserStatus.approved