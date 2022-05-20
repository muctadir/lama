from src import app, db # need this in every route
from src.app_util import AppUtil
from src.models.auth_models import User, UserSchema
from flask import make_response, request, Blueprint
from sqlalchemy.exc import OperationalError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user
from flask_cors import cross_origin

auth_routes = Blueprint("auth", __name__)

@auth_routes.route("/register", methods=["POST"])
@cross_origin()
def register():
    """
    Registers a user when supplied username, email, password, and description
    See create_user() for default arguments
    """
    args = request.json
    required = ["username", "email", "password", "description"] # Required arguments
    if AppUtil.check_args(required, args):
        if check_format(**args):
            if not taken(args["username"], args["email"]):
                return create_user(args)
            return make_response(("Username or email taken", 400))
        return make_response(("Invalid format", 400))
    return make_response(("Bad Request", 400))

@auth_routes.route("/pending", methods=["GET"])
@cross_origin()
def pending():
    """
    Returns list of all users that are pending approval from the super-admin
    """
    if not request.json: # only if there are no arguments
        try:
            pending = db.session.query(User).filter(User.approved == 0)
        except OperationalError:
            return make_response(("Service Unavailable", 503))
        user_schema = UserSchema(many=True) # many is for serializing lists
        pending = user_schema.dumps(pending) # dumps automatically converts to json, as opposed to dump
        return make_response(pending) # default code is 200

@auth_routes.route("/login")
@cross_origin()
def login():
    args = request.json
    if AppUtil.check_args(["username", "password"], args): # Correct arguments supplied
        user = db.session.query(User).filter(User.username == args["username"]) # Get user with username
        if user and check_password_hash(user.password, args["password"]): # user exists and password matches
            login_user(user)
            return make_response() # Should default to 200 if nothing provided
        return make_response(("Invalid Username/Password", 400))
    return make_response(("Bad Request", 400))

def create_user(args):
    """
    Adds a user to the database assuming correct (and unmodified) arguments are supplied
    Hashes password
    Converts email to lowercase
    """
    args["password"] = generate_password_hash(args["password"])
    args["email"] = args["email"].lower()
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
def check_format(username, email, password, description):
    return AppUtil.check_username(username) and \
            AppUtil.check_email(email) and \
            AppUtil.check_password(password) and \
            len(description) > 0