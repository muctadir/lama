from src import app, db # need this in every route
from src.app_util import AppUtil
from src.models.auth_models import User, UserSchema
from flask import make_response, request
from sqlite3 import OperationalError
from werkzeug.security import generate_password_hash

# TODO: Use make_response

@app.route("/auth/register", methods=["POST"])
def register():
    """
    Registers a user when supplied username, email, password, and description
    Default attributes are as follows:
        approved : 0
    """
    # request.args is immutable, so convert to dict (also for unpacking later)
    args = request.args.to_dict() 
    required = ["username", "email", "password", "description"] # Required arguments
    if AppUtil.check_args(required, args):
        return create_user(args)
    else:
        return "400 Bad Request"

@app.route("/auth/pending", methods=["GET"]) # TODO: CORS
def pending():
    if not request.args.to_dict(): # only if there are no arguments
        user_schema = UserSchema(many=True) # many is for serializing lists
        pending = db.session.query(User).filter(User.approved == 0)
        pending = user_schema.dumps(pending) # dumps automatically converts to json, as opposed to dump
        return pending


def create_user(args):
    args["approved"] = 0 # By default, a newly created user needs to be improved
    args["password"] = generate_password_hash(args["password"])
    new_user = User(**args)
    try:
        db.session.add(new_user)
        db.session.commit()
        return "201 Created"
    except OperationalError: # Something out of our control, like connection lost or such
        return "503 Service Unavailable"
