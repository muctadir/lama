# Author: Eduardo Costa Martins
from src import db
from src.exc import ChangeSyntaxError
from src.models.item_models import Artifact, Theme, Label
from src.models.change_models import ChangeType
from flask import current_app as app
from flask import make_response, request, Blueprint
from sqlalchemy import select
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import OperationalError
from src.app_util import login_required, in_project

change_routes = Blueprint('change', __name__, url_prefix='/change')

@change_routes.route('/artifactChanges', methods=['GET'])
@login_required
@in_project
def get_artifact_changes(membership):
    
    if not membership.admin:
        make_response('Forbidden', 403)
    
    pass

def parse_change(change, username):
    match change.change_type:
        case ChangeType.create:
            return __parse_creation(change, username)
        case ChangeType.split:
            return __parse_split(change, username)
        case ChangeType.merge:
            return __parse_merge(change, username)
        case ChangeType.name:
            return __parse_name_edit(change, username)
        case ChangeType.description:
            return __parse_desc_edit(change, username)
        
"""
A creation string should be blank
"""
def __parse_creation(change, username):
    item_type = change.item_class_name
    description = change.description.split(' ; ')
    if len(description):
        raise ChangeSyntaxError
    return f"{username} created {item_type} {change.i_id}"

"""
A name edit string should be of the format:
"old_name ; new_name"
"""
def __parse_name_edit(change, username):
    item_type = change.item_class_name
    description = change.description.split(' ; ')
    if len(description) != 2:
        raise ChangeSyntaxError
    return f"{username} renamed {item_type} {change.i_id} from {description[0]} to {description[1]}"

"""
A description edit string should be blank
"""
def __parse_desc_edit(change, username):
    item_type = change.item_class_name
    description = change.description.split(' ; ')
    if len(description):
        raise ChangeSyntaxError
    return f"{username} changed the description of {item_type} {change.i_id}"

"""
A split string should be of the format:
"'into'|'from' ; parent_id|child_id"
"""
def __parse_split(change, username):
    description = change.description.split(' ; ')
    if len(description) != 2:
        raise ChangeSyntaxError
    return f"{username} split Artifact {change.i_id} {description[0]} Artifact {description[1]}"

"""
A merge string should be of the format:
"child_id"
"""
def __parse_merge(change, username):
    description = change.description.split(' ; ')
    if len(description) != 1:
        raise ChangeSyntaxError
    return f"{username} merged Label {change.i_id} into Label {change.description}"

"""
A label_theme string should be of the format:
"'added'|'removed' ; "
"""
def __parse_label_theme(change, username):
    pass

def __parse_theme_theme(change, username):
    pass

def __parse_labelled(change, username):
    pass