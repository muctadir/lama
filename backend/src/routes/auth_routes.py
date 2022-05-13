from src import app, db # need this in every route
from src.app_util import AppUtil
from src.models.auth_models import User, UserSchema
from flask import make_response, request, Blueprint
from sqlite3 import OperationalError
from werkzeug.security import generate_password_hash
from flask_login import login_user

auth_routes = Blueprint("auth", __name__)

@auth_routes.route("/register", methods=["POST"])
def register():
    """
    Registers a user when supplied username, email, password, and description
    See create_user() for default arguments
    """
    # request.args is immutable, so convert to dict (also for unpacking later)
    args = request.args.to_dict() 
    required = ["username", "email", "password", "description"] # Required arguments
    if AppUtil.check_args(required, args):
        if AppUtil.check_email(args["email"]):
            return create_user(args)
        return make_response(("Invalid email", 400))
    return make_response(("Bad Request", 400))

@auth_routes.route("/pending", methods=["GET"])
def pending():
    """
    Returns list of all users that are pending approval from the super-admin
    """
    if not request.args.to_dict(): # only if there are no arguments
        try:
            pending = db.session.query(User).filter(User.approved == 0)
        except:
            return make_response(("Service Unavailable", 503))
        user_schema = UserSchema(many=True) # many is for serializing lists
        pending = user_schema.dumps(pending) # dumps automatically converts to json, as opposed to dump
        return make_response(pending) # default code is 200

@auth_routes.route("/login")
def login():
    # TODO: Check username/password
    user = db.session.query(User).first() # TODO: Get correct user
    login_user(user)
    return make_response()

def create_user(args):
    """
    Adds a user to the database assuming correct (and unmodified) arguments are supplied
    Assigns default attributes to the user:
        approved : 0
    Hashes password
    Converts email to lowercase
    """
    # TODO: Check if user exists
    # TODO: Check argument formats
    # Move all these checks to the register function? Have checks as a precondition for this function
    args["approved"] = 0 # By default, a newly created user needs to be improved
    args["password"] = generate_password_hash(args["password"])
    args["email"] = args["email"].lower()
    new_user = User(**args)
    try:
        db.session.add(new_user)
        db.session.commit()
        return make_response(("Created", 201))
    except OperationalError: # Something out of our control, like connection lost or such
        return make_response(("Service Unavailable", 503))