# Veerle Furst
# Jarl Jansen

from src import db # need this in every route
from src.app_util import AppUtil
from src.models.auth_models import User, UserSchema
from flask import current_app as app
from flask import make_response, request, Blueprint
from sqlalchemy import select
from sqlalchemy.exc import OperationalError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user
from flask_cors import cross_origin

auth_routes = Blueprint("auth", __name__, url_prefix="/auth")

# Function to register a user
@auth_routes.route("/register", methods=["POST"])
@cross_origin()
def register():
    """
    Registers a user when supplied username, email, password, and description
    See create_user() for default arguments
    """
    args = request.json
    
    required = ["username", "email", "password", "passwordR", "description"] # Required arguments

    # Checks if required fields are given
    if AppUtil.check_args(required, args):

        # Check if passwords are equal
        if args["password"] == args["passwordR"]:

            # calls the check format function, to see whether user request has valid info
            check = check_format(**args)

            # checks whether user input is correct
            if check[0]:
                # Checking if username and email are taken
                if not taken(args["username"], args["email"]):
                    # Go to the function to create the user
                    return create_user(args)
                return make_response(("Username or email taken", 400))

            # response if user input is invalid
            return make_response((check[1], 400))
        # Response if passwords are not equal
        return make_response(("Passwords are not equal", 400))
    # Bad request
    return make_response(("Bad Request", 400))

# Function to get all users who are pending
@auth_routes.route("/pending", methods=["GET"])
@cross_origin()
def pending():
    """
    Returns list of all users that are pending approval from the super-admin
    """
    if not request.json: # only if there are no arguments
        try:
            pending = db.session.query(User).filter(User.status == 'pending')
        except OperationalError:
            return make_response(("Service Unavailable", 503))
        user_schema = UserSchema(many=True) # many is for serializing lists
        pending = user_schema.dumps(pending) # dumps automatically converts to json, as opposed to dump
        return make_response(pending) # default code is 200

# Function to make a user login
@auth_routes.route("/login", methods=["POST"])
@cross_origin()
def login():
    """
    Logs in the user
    """
    args = request.json

    # Checks if correct arguments supplied
    if AppUtil.check_args(["username", "password"], args): 
        # Get user with username 
        user = db.session.execute(select(User).where(User.username == args["username"])).scalars().all()
        # Check if user exists and password matches
        if user and check_password_hash(user[0].password, args["password"]): 
            # Log in user (Flask)
            login_user(user[0])
            # Respond that the user is now logged in
            return make_response(("Logged in", 200))
        # Respond invalid username or password
        return make_response(("Invalid username or password", 400))
    # Respond bad request
    return make_response(("Bad Request", 400))

# Function to create the user that was register
def create_user(args):
    """
    Adds a user to the database assuming correct (and unmodified) arguments are supplied
    Hashes password
    Converts email to lowercase
    """
    # Hash password
    args["password"] = generate_password_hash(args["password"])
    # Make email lowercase
    args["email"] = args["email"].lower()
    # Remove the second password that was send
    args.pop("passwordR")
    new_user = User(**args)
    try:
        db.session.add(new_user)
        db.session.commit()
        return make_response(("Created", 201))
    except OperationalError: # Something out of our control, like connection lost or such
        return make_response(("Service Unavailable", 503))

# If there already exists a User with given username or email
def taken(username, email):
    violation = db.session.query(User).filter(User.username == username or User.email == email).first()
    return bool(violation)

# Checks validity of all required fields for User creation
def check_format(username, email, password, passwordR, description):
    if (not AppUtil.check_username(username)):
        return [False, "Invalid username"]
    elif (not AppUtil.check_email(email)):
        return [False, "Invalid email"]
    elif (not AppUtil.check_password(password)):
        return [False, "Invalid password"]
    else:
        return [True, "Success"]