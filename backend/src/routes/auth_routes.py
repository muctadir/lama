# Veerle Furst
# Jarl Jansen
# Eduardo Costa Martins

from operator import or_
from src import db # need this in every route
from src.app_util import check_args, check_email, check_password, check_username, super_admin_required, login_required, check_string, check_whitespaces
from src.models.auth_models import User, UserSchema, UserStatus
from flask import current_app as app
from flask import make_response, request, Blueprint, jsonify
from sqlalchemy import select, or_
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import OperationalError
from werkzeug.security import generate_password_hash, check_password_hash
from jwt import encode

auth_routes = Blueprint("auth", __name__, url_prefix="/auth")

# Function to register a user
@auth_routes.route("/register", methods=["POST"])
def register():
    """
    Registers a user when supplied username, email, password, and description
    See create_user() for default arguments
    """
    args = request.json['params']
    # Required arguments
    required = ["username", "email", "password", "passwordR", "description"] 

    # Check required arguments are supplied
    if not check_args(required, args):
        return make_response(("Bad Request", 400))

    # Check that username/email are unique
    if taken(args["username"], args["email"]):
        return make_response(("Username or email taken", 400))
    
    # Check for invalid characters
    if check_whitespaces(args):
        return make_response("Input contains leading or trailing whitespaces", 400)
     
    # Check for invalid characters
    if check_string([args['username'], args['email'], args['password']]):
        return make_response("Input contains a forbidden character", 511)
        
    # Check that arguments were formatted correctly
    check, reason = check_format(**args)
    if not check:
        return make_response((reason, 400))
    
    return create_user(args)

# Function to get all users who are pending
@auth_routes.route("/pending", methods=["GET"])
@super_admin_required
def pending():
    """
    Returns list of all users that are pending approval from the super-admin
    """
    args = request.args
    required = ()
    # Check that all (no) arguments are provided
    if not check_args(required, args):
        return make_response("Bad Request", 400)
    
    user_schema = UserSchema()
    # Get all users with pending status
    users = db.session.scalars(select(User).where(User.status == UserStatus.pending)).all()
    # Convert to json format
    json_users = jsonify(user_schema.dump(users, many=True))
    
    return make_response(json_users)

# Function to make a user login
@auth_routes.route("/login", methods=["POST"])
def login():
    """
    Logs in the user
    """
    args = request.json
    # Check required arguments are supplied
    if not check_args(["username", "password"], args):
        return make_response(("Bad Request", 400))

    # Try getting user
    try:
        # Get id and password by username
        u_id, password = db.session.execute(select(User.id, User.password).where(User.username == args["username"])).one()

        # Check correct password
        if not check_password_hash(password, args["password"]):
            return make_response(("Invalid username or password", 400))

        # Login user
        return login_user(u_id)

    except NoResultFound:
        # User not found
        return make_response(("Invalid username or password", 400))

# Function for checking whether user has logged in before correctly
@auth_routes.route("/check_login", methods=["GET"])
@login_required
def check_login():
    """
    Checks whether the user has already logged in
    """
    return make_response(("Success", 200))

# Function for checking whether user has logged in and a superadmin
@auth_routes.route("/check_super_admin", methods=["GET"])
@super_admin_required
def check_super_admin():
    """
    Checks whether the user has already logged in and is a super-admin
    """
    return make_response(("Success", 200))

def login_user(u_id):
    # Encode user id
    token = encode({'u_id_token': u_id}, app.secret_key, algorithm='HS256')
    # Return id in headers
    resp = make_response("Success")
    resp.headers['u_id_token'] = token
    resp.headers['Access-Control-Expose-Headers'] =  'Content-Encoding, u_id_token'
    return resp

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
    except OperationalError:
        return make_response(("Service Unavailable", 503))

# If there already exists a User with given username or email
def taken(username, email):
    violation = db.session.scalars(select(User).where(or_(User.username == username, User.email == email))).first()
    print(violation)
    return bool(violation)

# Checks validity of all required fields for User creation
def check_format(username, email, password, passwordR, description):
    if not check_username(username):
        return (False, "Invalid username")
    elif not check_email(email):
        return (False, "Invalid email")
    elif not check_password(password):
        return (False, "Invalid password")
    elif passwordR != password:
        return (False, "Passwords must match")
    elif not len(description):
        return (False, "No description provided")
    else:
        return (True, "Success")