from sqlite3 import OperationalError
from src.models.auth_models import User, UserSchema
from flask import request, jsonify, Blueprint

util_routes = Blueprint("util_routes", __name__)

# Route for getting health
@util_routes.route("/health", methods=["GET"])
def health():
    if request.method == "GET":
        return "200 OK"

# Route for getting users
@util_routes.route("/users", methods=["GET"])
def users():
    user_schema = UserSchema()
    try:
        response = jsonify([user_schema.dump(user) for user in User.query.all()]) # cannot return lists -> convert to json
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except OperationalError:
        return "503 Service Unavailable"