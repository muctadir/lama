# Veerle Furst

from src import db # need this in every route
from src.models.auth_models import User, UserSchema
from src.app_util import check_args, check_email, check_password, check_username
from flask import current_app as app
from flask import make_response, request, Blueprint
from sqlalchemy import select, update
from src.app_util import login_required
from werkzeug.security import generate_password_hash, check_password_hash

account_routes = Blueprint("account", __name__, url_prefix="/account")

# Function to register a user
@account_routes.route("/information", methods=["GET"])
@login_required
def getUserInformation(*, user):
    """
    Get the user object of the logged in user
    """
    # Get the logged in user
    user = db.session.execute(select(User).where(User.id == user.id)).scalars().all()

    # Get the information
    user_schema = UserSchema()
    response = user_schema.dump(user[0])
    # Remove the password
    response.pop("password")

    # Respond the information
    return make_response(response)


# Function to edit the information of a user a user
@account_routes.route("/edit", methods=["POST"])
@login_required
def editUserInformation(*, user):
    """
        Edit the user information
    """

    # Get the information needed
    args = request.json

    # Take the username, email and description
    newUsername = args["username"]
    newEmail = args["email"]
    newDescription = args["description"]

    # Required arguments
    required = ["username", "email", "description"] 

    # Check required arguments are supplied
    if not check_args(required, args):
        return make_response(("Bad Request", 400))

    # Check required arguments are valid
    if not check_format(newUsername, newEmail, newDescription):
        return make_response(("Bad Request", 400))
    
    # Change the users information
    db.session.execute(
        update(User).
        where(User.id == user.id).
        values(
            username=newUsername,
            email=newEmail,
            description=newDescription
        )
    )
    # Commit the new information
    db.session.commit()
    
    # Return a success message
    return make_response("Updated succesfully")


# Function to edit the information of a user a user
@account_routes.route("/editPassword", methods=["POST"])
@login_required
def editUserPassword(*, user):
    """
        Edit the user information
    """

    # Get the information needed
    args = request.json
    print(args)

    # Required arguments
    required = ["password", "newPassword"] 

    # Get id and password by username
    password = db.session.execute(select(User.password).where(User.id == user.id)).one()

    # Hash new password
    hashedPassword = generate_password_hash(args["password"])

    # Check correct password
    if not check_password_hash(password[0], args["password"]):
        return make_response(("Invalid password", 400))

    # Check required arguments are supplied
    if not check_args(required, args):
        return make_response(("Bad Request", 400))

    # Check if new password is valid
    if not check_format_password(args["newPassword"])[0]:
        return make_response(("Invalid password", 400))
    
    # Hash new password
    hashedPassword = generate_password_hash(args["newPassword"])
    
    # Change the users information
    db.session.execute(
        update(User).
        where(User.id == user.id).
        values(
            password = hashedPassword
        )
    )
    # Commit the new information
    db.session.commit()
    
    # Return a success message
    return make_response("Updated succesfully")

# Checks validity of all required fields for User creation
def check_format(username, email, description):
    if not check_username(username):
        return (False, "Invalid username")
    elif not check_email(email):
        return (False, "Invalid email")
    elif not len(description):
        return (False, "No description provided")
    else:
        return (True, "Success")

# Checks validity of the password
def check_format_password(password):
    if not check_password(password):
        return (False, "Invalid password")
    else:
        return (True, "Success")