from src import db
from src.conftest import RequestHandler
from src.models.auth_models import User, UserStatus
from src.routes.account_routes import check_format, check_password_hash, check_format_password, taken


def test_get_user_information(app, client):
    """
    Function to check the getting of user information
    """
    # Tests are for user 2
    request_handler = RequestHandler(app, client, 2)

    # When p_id is not given
    response = request_handler.get("/account/information", {}, True)
    # Check if eror was thrown and which one
    assert response.status_code == 200
    # Expected user info
    assert response.json['id'] == 2
    assert response.json['username'] == "user1"
    assert response.json['email'] == "user1@test.com"
    assert response.json['description'] == "test"
    assert response.json['super_admin'] == False
    assert response.json['status'] == "approved"


def test_edit_user_information(app, client):
    """
    Function to check the editing of user information
    """
    # Tests are for user 2
    request_handler = RequestHandler(app, client, 2)

    # When not all arguments are given
    response = request_handler.post("/account/edit", {"id": 2}, True)
    # Check if eror was thrown and which one
    assert response.status_code == 400
    assert response.text == "Not all arguments supplied"

    # Edit information
    edit_info = {
        "id": 2,
        "username": "user1   ",
        "description": "test",
        "email": "user1@test.com"
    }
    # When not all arguments are given
    response = request_handler.post("/account/edit", edit_info, True)
    # Check if eror was thrown and which one
    assert response.status_code == 400
    assert response.text == "Input contains leading or trailing whitespaces"

    # Edit information
    edit_info = {
        "id": 2,
        "username": "user1;",
        "description": "test",
        "email": "user1@test.com"
    }
    # When not all arguments are given
    response = request_handler.post("/account/edit", edit_info, True)
    # Check if eror was thrown and which one
    assert response.status_code == 511
    assert response.text == "Input contains a forbidden character"

    # Edit information
    edit_info = {
        "id": 2,
        "username": "",
        "description": "",
        "email": "user1@test.com"
    }
    # When not all arguments are given
    response = request_handler.post("/account/edit", edit_info, True)
    # Check if eror was thrown and which one
    assert response.status_code == 400
    assert response.text == "Bad Request"

    # Edit information
    edit_info = {
        "id": 2,
        "username": "user100",
        "description": "test100",
        "email": "user100@test.com"
    }
    # When not all arguments are given
    response = request_handler.post("/account/edit", edit_info, True)
    # Check if eror was thrown and which one
    assert response.status_code == 200
    assert response.text == "Updated succesfully"

    # app contect for database use
    with app.app_context():
        # Check if the user was actually updated
        user = db.session.get(User, 2)
        assert user.id == 2
        assert user.username == "user100"
        assert user.email == "user100@test.com"
        assert user.description == "test100"


def test_edit_user_password_superadmin(app, client):
    """
    Function to check the editing of user password
    """
    # Tests are for user 2
    request_handler = RequestHandler(app, client, 1)

    # When not all arguments are given
    response = request_handler.post("/account/editPassword", {"id": 2}, True)
    # Check if eror was thrown and which one
    assert response.status_code == 400
    assert response.text == "Not all arguments supplied"

    # Edit information
    edit_info = {
        "id": 2,
        "password": "TESTUSER123",
        "newPassword": "newPassword;"
    }
    # When not all arguments are given
    response = request_handler.post("/account/editPassword", edit_info, True)
    # Check if eror was thrown and which one
    assert response.status_code == 511
    assert response.text == "Input contains a forbidden character"

    # Edit information
    edit_info = {
        "id": 2,
        "password": "TESTUSER123",
        "newPassword": "password"
    }
    # When not all arguments are given
    response = request_handler.post("/account/editPassword", edit_info, True)
    # Check if eror was thrown and which one
    assert response.status_code == 400
    assert response.text == "Please enter a more secure password"

    # Edit information
    edit_info = {
        "id": 2,
        "password": "TESTUSER123",
        "newPassword": "TESTUSER1234"
    }
    # When not all arguments are given
    response = request_handler.post("/account/editPassword", edit_info, True)
    # Check if eror was thrown and which one
    assert response.status_code == 200
    assert response.text == "Updated succesfully"

    # app contect for database use
    with app.app_context():
        # Check if the user was actually updated
        user = db.session.get(User, 2)
        assert check_password_hash(user.password, "TESTUSER1234")


def test_edit_user_password(app, client):
    """
    Function to check the editing of user password
    """
    # Tests are for user 2
    request_handler = RequestHandler(app, client, 2)

    # When not all arguments are given
    response = request_handler.post("/account/editPassword", {"id": 2}, True)
    # Check if eror was thrown and which one
    assert response.status_code == 400
    assert response.text == "Not all arguments supplied"

    # Edit information
    edit_info = {
        "id": 2,
        "password": "TESTUSER123",
        "newPassword": "newPassword;"
    }
    # When not all arguments are given
    response = request_handler.post("/account/editPassword", edit_info, True)
    # Check if eror was thrown and which one
    assert response.status_code == 511
    assert response.text == "Input contains a forbidden character"

    # Edit information
    edit_info = {
        "id": 2,
        "password": "TESTUSER1234",
        "newPassword": "newPassword"
    }
    # When not all arguments are given
    response = request_handler.post("/account/editPassword", edit_info, True)
    # Check if eror was thrown and which one
    assert response.status_code == 400
    assert response.text == "Incorrect password entered"

    # Edit information
    edit_info = {
        "id": 2,
        "password": "TESTUSER123",
        "newPassword": "password"
    }
    # When not all arguments are given
    response = request_handler.post("/account/editPassword", edit_info, True)
    # Check if eror was thrown and which one
    assert response.status_code == 400
    assert response.text == "Please enter a more secure password"

    # Edit information
    edit_info = {
        "id": 2,
        "password": "TESTUSER123",
        "newPassword": "TESTUSER1234"
    }
    # When not all arguments are given
    response = request_handler.post("/account/editPassword", edit_info, True)
    # Check if eror was thrown and which one
    assert response.status_code == 200
    assert response.text == "Updated succesfully"

    # app contect for database use
    with app.app_context():
        # Check if the user was actually updated
        user = db.session.get(User, 2)
        assert check_password_hash(user.password, "TESTUSER1234")


def test_soft_delete(app, client):
    """
    Function to check the soft deleting of users
    """
    # Tests are for user 1 -> superadmin
    request_handler = RequestHandler(app, client, 1)

    # When not all arguments are given
    response = request_handler.post("/account/status", {"id": 2, "status": "deleted"}, True)
    # Check if eror was thrown and which one
    assert response.status_code == 200
    assert response.text == "Updated succesfully"
    # app contect for database use
    with app.app_context():
        # Check if the user was actually updated
        user = db.session.get(User, 2)
        assert user.status == UserStatus.deleted


def test_check_format(app, client):
    """
    Function to check the checking of format
    """
    # Fake user info
    username = ""
    email = ""
    description = ""
    # Invalid username
    assert check_format(username, email, description) == (
        False, "Invalid username")
    username = "user1"
    # Invalid email
    assert check_format(username, email, description) == (
        False, "Invalid email")
    email = "test@test.com"
    # Invalid description
    assert check_format(username, email, description) == (
        False, "No description provided")
    description = "description"
    # Valid info
    assert check_format(username, email, description) == (True, "Success")


def test_check_format_password(app, client):
    """
    Function to check the checking of format
    """
    # Fake user info
    password = ""
    # Invalid password
    assert check_format_password(password) == (False, "Invalid password")
    password = "password"
    # Invalid password
    assert check_format_password(password) == (False, "Invalid password")
    password = "TESTUSER123"
    # Valid password
    assert check_format_password(password) == (True, "Success")


def test_taken(app, client):
    """
    Function to check the taken function
    """
    # Fake user info
    username = "user1"
    email = "user1@test.com"
    user_id = 2
    # Invalid password
    with app.app_context():
        assert taken(username, email, user_id) == False

    # Fake user info
    username = "user1"
    email = "user1@test.com"
    user_id = 3
    # Invalid password
    with app.app_context():
        assert taken(username, email, user_id) == True
