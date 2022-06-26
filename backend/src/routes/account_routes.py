# Veerle Furst

from src import db # need this in every route
from src.models.auth_models import User, UserSchema, UserStatus
from src.app_util import check_args, check_email, check_password, check_username, check_string, check_whitespaces
from flask import current_app as app
from flask import make_response, request, Blueprint
from sqlalchemy import select, update, or_, and_
from src.app_util import login_required, super_admin_required
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import  OperationalError

account_routes = Blueprint("account", __name__, url_prefix="/account")

# Function to register a user
@account_routes.route("/information", methods=["GET"])
@login_required
def get_user_information(*, user):
    """
    Get the user object of the logged in user
    """
    # Get the logged in user
    user = db.session.execute(select(User).where(User.id == user.id)).scalars().all()

    # Get the information
    user_schema = UserSchema()
    response = user_schema.dump(user[0])

    # Respond the information
    return make_response(response)


# Function to edit the information of a user a user
@account_routes.route("/edit", methods=["POST"])
@login_required
def edit_user_information(*, user):
    """
        Edit the user information
    """

    # Get the information needed
    args = request.json
    args = args['params']

    # Take the username, email and description
    edit_id = args["id"]
    new_username = args["username"]
    new_email = args["email"]
    new_description = args["description"]

    # Required arguments
    required = ["username", "email", "description", "id"] 

    # Check required arguments are supplied
    if not check_args(required, args):
        return make_response(("Bad Request", 400))

    # Check for whitespaces 
    if check_whitespaces([args['username'], args['email'], args['description']]):
        return make_response("Input contains leading or trailing whitespaces", 400)
    
    # Check for invalid characters
    if check_string([args['username'], args['email']]):
        return make_response("Input contains a forbidden character", 511)
    
    # Check that username/email are unique
    if taken(args["username"], args["email"], args['id']):
        return make_response(("Username or email taken", 400))

    # Check required arguments are valid
    if not check_format(new_username, new_email, new_description)[0]:
        return make_response(("Bad Request", 400))
    
    # Checks whether the request is made by a super-admin
    # if so use user_ID from the request, if not a superadmin use id derived from token
    if user.super_admin:
        id_used = edit_id
    else:
        id_used = user.id
    
    # Changes the account details
    db.session.execute(
        update(User)
        .where(User.id == id_used).
        values(
            username=new_username,
            email=new_email,
            description=new_description
        )
    )

    # Commits to the database
    try:
        db.session.commit()
    except OperationalError:
        return make_response('Internal Server Error', 503)
    
    # Return a success message
    return make_response("Updated succesfully")


# Function to edit the information of a user a user
@account_routes.route("/editPassword", methods=["POST"])
@login_required
def edit_user_password(*, user):
    """
        Edit the user password
    """

    # Get the information needed
    args = request.json['params']

    # Required arguments
    required = ["password", "newPassword", "id"] 

    # Check required arguments are supplied
    if not check_args(required, args):
        return make_response(("Incorrect arguments supplied in request", 400))

    # Check for invalid characters
    if check_string([args['password'], args['newPassword']]):
        return make_response("Input contains a forbidden character", 511)
    
    # checks whether the superadmin is making the request, based on that sets used user.id
    if user.super_admin:
        id_used = args["id"]
    else:
        id_used = user.id

    # checks whether the superadmin made the call
    if not user.super_admin or id_used == user.id:
        # Get id and password by user id
        password = db.session.scalar(select(User.password).where(User.id == user.id))

        # Check correct password
        if not check_password_hash(password, args["password"]):
            return make_response(("Incorrect password entered", 400))

    # Check if new password is valid
    if not check_format_password(args["newPassword"])[0]:
        return make_response(("Please enter a more secure password", 400))
    
    # Hash new password
    hashed_password = generate_password_hash(args["newPassword"])

    # Change the users information
    db.session.execute(
        update(User).
        where(User.id == id_used).
        values(
            password = hashed_password
        )
    )
    # Commit the new information
    db.session.commit()
    
    # Return a success message
    return make_response("Updated succesfully")

# Soft deletes a user from the database
@account_routes.route("/soft_del", methods=["POST"])
@super_admin_required
def soft_delete(*, super_admin):
    # gets the arguments from the request
    args = request.json
    args = args['params']

    # checks whether the ID param is given
    required = ["id"] 

    # Check required arguments are supplied
    if not check_args(required, args):
        return make_response(("Bad Request", 400))

    # Changes the account details to deleted
    db.session.execute(
        update(User).
        where(User.id == args["id"]).
        values(
            status=UserStatus.deleted
        )
    )

    # Commits the changes to the database
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

# If there already exists a User with given username or email
def taken(username, email, user_id):
    violation = db.session.scalars(select(User)
        .where(and_(or_(User.username == username, User.email == email)), User.id != user_id)).first()
    return bool(violation)