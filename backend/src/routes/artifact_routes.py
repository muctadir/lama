# Victoria Bogachenkova
# Ana-Maria Olteniceanu

from src.models.project_models import Membership
from flask import current_app as app
from src.models import db
# from src.models.auth_models import User, UserSchema, UserStatus, SuperAdmin
# from src.models.item_models import Artifact, LabelType
from src.models.project_models import Membership, ProjectSchema
from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select
from src.app_util import login_required

project_routes = Blueprint("project", __name__, url_prefix="/project")