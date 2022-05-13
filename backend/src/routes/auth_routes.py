from src import app, db # need this in every route
from src.models.auth_models import User, UserSchema
from flask import make_response, request


@app.route("/register", methods=["POST"])
def register():
    # request.args is immutable, so convert to dict (also for unpacking later)
    args = request.args.to_dict() 
    required = ["username", "email", "password", "description"] # Required arguments
    if all(arg in args for arg in required): # All arguments supplied
        # Check no extra arguments supplied
        for key in args.keys():
            if key not in required:
                # TODO: generate exception or error code
                return "extra args :-("
        args["approved"] = 0
        return createUser(args)
        # TODO: ask super-admin for approval

def createUser(args):
    new_user = User(**args)
    try:
        db.session.add(new_user)
        db.session.commit()
        return "201 Created"
    except OperationalError: # Something out of our control, like connection lost or such
        return "503 Service Unavailable"

def askApproval(user):
    return
