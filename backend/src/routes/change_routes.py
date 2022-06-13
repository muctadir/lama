# Author: Eduardo Costa Martins
from pydoc import describe
from backend.src.models.change_models import Change
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
"'added'|'removed' ; <comma separated label/theme ids>"
"""
def __parse_label_theme(change, username):
    item_type = change.item_class_name
    description = change.description.split(' ; ')
    if len(description) != 2:
        raise ChangeSyntaxError
    ids = description[1].split(', ')
    if ids[0].strip() == "":
        raise ChangeSyntaxError
    match description[0]:
        case 'added':
            if item_type == 'Label':
                return f"{username} added Label {change.i_id} to theme{'s' if len(ids[1]) > 1 else ''} {description[1]}"
            else:
                return f"{username} added Label{'s' if len(ids[1]) > 1 else ''} {description[1]} to theme {change.i_id}"
        case 'removed':
            if item_type == 'Label':
                return f"{username} removed Label {change.i_id} from theme{'s' if len(ids[1]) > 1 else ''} {description[1]}"
            else:
                return f"{username} removed Label{'s' if len(ids[1]) > 1 else ''} {description[1]} from theme {change.i_id}"
        case _:
            raise ChangeSyntaxError

"""
A theme_theme string should be of the format:
'sub'|'super' ; <comma separated theme ids>
"""
def __parse_theme_theme(change, username):
    description = change.description.split(' ; ')
    if len(description) != 2:
        raise ChangeSyntaxError
    ids = description[1].split(', ')
    if ids[0].strip() == "":
        raise ChangeSyntaxError
    return f"{username} made Theme {change.i_id} a {description[0]}theme of theme{'s' if len(ids[1]) > 1 else ''} {description[1]}"

"""
A labelled string should be of the format:
'label' ; label_type_name ; label_id
'edit'|'merge' ; label_type_name ; old_label_id ; new_label_id
"""
def __parse_labelled(change, username):
    description = change.description.split(' ; ')
    match description[0]:
        case 'label':
            if len(description) != 3:
                raise ChangeSyntaxError
            return f"{username} labelled Artifact {change.i_id} with Label {description[2]} of type {description[1]}"
        case 'edit':            
            if len(description) != 4:
                raise ChangeSyntaxError
            return f"{username} changed Artifact {change.i_id}'s Label of type {description[1]} from {description[2]} to {description[3]}"
        case 'merge':
            if len(description) != 4:
                raise ChangeSyntaxError
            return f"Artifact {change.i_id}'s Label of type {description[1]} changed from {description[2]} to {description[3]} as a result of a merge {username} made"
        case _:
            raise ChangeSyntaxError