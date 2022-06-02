# Veerle Furst

from src import db # need this in every route
from src.models.auth_models import User, UserSchema
from flask import current_app as app
from flask import make_response, request, Blueprint
from sqlalchemy import select
from sqlalchemy.exc import OperationalError
from flask_cors import cross_origin

account_routes = Blueprint("account", __name__, url_prefix="/account")

# Function to register a user
@account_routes.route("/information", methods=["GET"])
def getUserInformation():
    """
    Get the user object of the logged in user
    """
    # user = db.session.execute(select(User).where(User.id == logged_in_user.get_id())).scalars().all()

    # Respond bad request
    return make_response("hello")