from sqlite3 import OperationalError
from xmlrpc.client import Boolean, boolean
from src.models.project_models import Membership
from flask import current_app as app
from src.models import db
from src.models.auth_models import User, UserSchema
from src.models.item_models import ProjectItem, ChangingItem, Artifact
from src.models.project_models import Project, Membership
from flask import request, jsonify, Blueprint
from json import dumps


demos = Blueprint("demos", __name__)

@demos.route("/health", methods=["GET"])
def health():
    if request.method == "GET":
        return "200 OK"


# DEPRECATED
@demos.route("/user", methods=["POST", "GET"])
def user():
    return "501 Not Implemented"
    if request.method == "POST":
        username = request.args.get("username")
        password = request.args.get("password") # should be encrypted before sending it to the backend anyway
        if username and password:
            new_user = User(username=username, password=password)
            try:
                db.session.add(new_user)
                db.session.commit()
                return "201 Created"
            except OperationalError: # Something out of our control, like connection lost or such
                return "503 Service Unavailable"
        else:
            return "400 Bad Request"
    else:
        id = request.args.get("index")
        if id:
            try:
                user = User.query.get(id)
            except OperationalError:
                return "503 Service Unavailable"
            if user:
                user_schema = UserSchema()
                user_json = user_schema.dump(user)
                user_json.pop("password")
                response = jsonify(user_json)
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response
            else:
                return "404 Not Found"
        return "400 Bad Request"

@demos.route("/users", methods=["GET"])
def users():
    user_schema = UserSchema()
    try:
        response = jsonify([user_schema.dump(user) for user in User.query.all()]) # cannot return lists -> convert to json
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except OperationalError:
        return "503 Service Unavailable"