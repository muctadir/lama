from sqlite3 import OperationalError
from src import app, db
from src.models.auth_models import User, UserSchema
from flask import request, jsonify

@app.route("/user", methods=["POST", "GET"])
def user():
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

@app.route("/users", methods=["GET"])
def users():
    user_schema = UserSchema()
    try:
        response = jsonify([user_schema.dump(user) for user in User.query.all()]) # cannot return lists -> convert to json
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except OperationalError:
        return "503 Service Unavailable"