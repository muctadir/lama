# Veerle Furst
# Eduardo Costa Martins

from flask import current_app as app
from src.models import db
from src.models.auth_models import User
from src.models.item_models import Theme, ThemeSchema, Label, label_to_theme
from src.models.project_models import Membership, ProjectSchema
from src.models.change_models import ChangeType
from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select, func, update
from src.app_util import login_required, check_args, in_project
from src.routes.label_routes import get_label_info
from sqlalchemy.exc import OperationalError

theme_routes = Blueprint("theme", __name__, url_prefix="/theme")

"""
For getting the theme information 
@returns a list of dictionaries of the form:
{
    theme : the serialized theme
    number_of_labels : the number of labels within the theme
}
"""
@theme_routes.route("/theme-management-info", methods=["GET"])
@login_required
def theme_management_info(*, user):

    # The required arguments
    required = ["p_id"]

    # Get args
    args = request.args
    
    # Check if all required arguments are there
    if not check_args(required, args):
        return make_response("Not all required arguments supplied", 400)

    # Get all themes
    all_themes = db.session.execute(
        select(Theme)
        .where(Theme.p_id == args["p_id"])
    ).scalars().all()

    # Schemas to serialize
    theme_schema = ThemeSchema()

    # List for project information
    theme_info = [{
        'theme' : theme_schema.dump(theme),
        'number_of_labels' : get_theme_label_count(theme.id)
    } for theme in all_themes]

    # Convert the list of dictionaries to json
    dict_json = jsonify(theme_info)

    # Return the list of dictionaries
    return make_response(dict_json)

"""
For getting the theme information 
@returns a list of dictionaries of the form:
{
    theme : the serialized theme
    super_theme: the super theme of the theme
    sub_theme: the sub themes of the theme
    labels: the labels within the theme
}
"""
@theme_routes.route("/single-theme-info", methods=["GET"])
@login_required
@in_project
def single_theme_info(*, user, membership):

    # The required arguments
    required = ["p_id", "t_id"]

    # Get args
    args = request.args

    # Check if all required arguments are there
    if not check_args(required, args):
        return make_response("Not all required arguments supplied", 400)

    # Schemas to serialize
    theme_schema = ThemeSchema()

    # Get the theme id
    t_id = int(args["t_id"])
    # Get the project id
    p_id = int(args["p_id"])

    # Get the corresponding theme
    theme = db.session.get(Theme, t_id)

    # Check if the theme exists
    if not theme:
        return make_response("Bad request", 400)

    # Check if theme is in given project
    if theme.p_id != p_id:
        return make_response("Bad request", 400)

    # Convert theme to JSON
    theme_json = theme_schema.dump(theme)

    # SUPER THEME
    # Get the super theme
    super_theme = theme.super_theme
    # Make a json of the super-theme info
    super_theme_json = theme_schema.dump(super_theme)

    # SUB THEMES
    # Make list of all sub-themes
    sub_themes = theme.sub_themes
    # Make a json list of sub-themes
    sub_themes_list_json = theme_schema.dump(sub_themes, many=True)

    # LABELS
    # Make list of all labels
    labels = theme.labels

    # Then throw this loop in a list comprehension
    labels_list_json = [get_label_info(label, user.id, membership.admin) for label in labels]

    # INFO
    # Put all values into a dictonary
    info = {
        "theme" : theme_json,
        "super_theme" : super_theme_json,
        "sub_themes" : sub_themes_list_json,
        "labels" : labels_list_json
    }

    # Convert the list of dictionaries to json
    dict_json = jsonify(info)

    # Return the list of dictionaries
    return make_response(dict_json)

"""
For getting the all themes without parents 
@returns a list of themes:
{
    themes : the serialized themes without parents
}
"""
@theme_routes.route("/possible-sub-themes", methods=["GET"])
@login_required
def all_themes_no_parents(*, user):

    # The required arguments
    required = ["p_id"]

    # Get args
    args = request.args

    # Check if all required arguments are there
    if not check_args(required, args):
        return make_response("Not all required arguments supplied", 400)

    # Schema to serialize
    theme_schema = ThemeSchema()

    # Get the project id
    p_id = int(args["p_id"])

    # Get the themes without parents
    themes = db.session.execute(
        select(Theme)
        .where(
            Theme.p_id == p_id,
            Theme.super_theme == None
        )
    ).scalars().all()

    # Dump the themes to get the info
    themes_info = theme_schema.dump(themes, many=True)
    
    # Convert the list of dictionaries to json
    list_json = jsonify(themes_info)

    # Return the list of dictionaries
    return make_response(list_json)

# Function for getting the number of labels in the theme
def get_theme_label_count(t_id):
    return db.session.scalar(
            select(func.count(label_to_theme.c.l_id))
            .where(label_to_theme.c.t_id==t_id)
        )


"""
For creating a new theme 
@params a list of theme information:
{
    name: name of new theme
    description: description of new theme
    labels: list of labels inside the theme
    sub_themes: list of sub_themes
    p_id: project id
}
"""
@theme_routes.route("/create_theme", methods=["POST"])
@login_required
@in_project
def create_theme(*, user):

    # The required arguments
    required = ["name", "description", "labels", "sub_themes", "p_id"]

    # Get args
    args = request.json['params']

    # Check if all required arguments are there
    if not check_args(required, args):
        return make_response("Not all required arguments supplied", 400)

    # Theme creation info
    theme_creation_info = {
        "name": args["name"],
        "description": args["description"],
        "p_id": args["p_id"]
    }

    # Load the project data into a project object
    thema_schema = ThemeSchema()
    theme = thema_schema.load(theme_creation_info)

    # Add the project to the database
    db.session.add(theme)
    db.session.flush()
    __record_creation(theme.id, theme.name, args['p_id'], user.id)

    # Make the sub_themes the sub_themes of the created theme
    theme.sub_themes = make_sub_themes(args["sub_themes"])

    # Make the labels the labels of the created theme
    theme.labels = make_labels(args["labels"])

    # Create the project
    try:
        db.session.commit()   
    except OperationalError:
        return make_response("internal Server Error", 503) 

    # Return the conformation
    return make_response("Project created", 200)

"""
For editing a theme 
@params a list of theme information:
{
    id: id of the theme
    name: name of new theme
    description: description of new theme
    labels: list of labels inside the theme
    sub_themes: list of sub_themes
    p_id: project id
}
"""
@theme_routes.route("/edit_theme", methods=["POST"])
@login_required
@in_project
def edit_theme(*, user):

    # The required arguments
    required = ["id", "name", "description", "labels", "sub_themes", "p_id"]

    # Get args
    args = request.json['params']

    # Check if all required arguments are there
    if not check_args(required, args):
        print("ello")
        return make_response("Not all required arguments supplied", 400)
    
    # Get theme id
    t_id = args["id"]
    # Project id
    p_id = args["p_id"]

    # Get the corresponding theme
    theme = db.session.get(Theme, t_id)

    # Check if the theme exists
    if not theme:
        return make_response("Bad request", 400)

    # Check if theme is in given project
    if theme.p_id != p_id:
        return make_response("Bad request", 400)
    
    if theme.name != args['name']:
        __record_name_edit(theme.id, theme.name, p_id, user.id, args['name'])
    
    if theme.description != args['description']:
        __record_description_edit(theme.id, args['name'], p_id, user.id)

    # Change the theme information
    db.session.execute(
        update(Theme).
        where(Theme.id == t_id).
        values(
            name = args["name"],
            description = args["description"]
        )
    )

    # Set the sub_themes of the theme
    theme.sub_themes = make_sub_themes(args["sub_themes"])
    # Set the labels of the theme
    theme.labels = make_labels(args["labels"])

    # Edit the project
    try:
        db.session.commit()   
    except OperationalError:
        return make_response("internal Server Error", 503)       

    # Return the confirmation
    return make_response("Project edited", 200)

def make_labels(labels_info):
    # Add the labels to the theme
    labels_list = []
    # Make sub_themes themes
    for label in labels_info:
        # Get the theme
        new_label = db.session.scalar(
            select(Label)
            .where(Label.id == label["id"])
        )
        # Append the theme to the list
        labels_list.append(new_label)
    return labels_list

def make_sub_themes(sub_themes_info):
    # Add the sub_themes to the theme
    sub_themes_list = []
    # Make sub_themes themes
    for sub_theme in sub_themes_info:
        # Get the theme
        new_theme = db.session.scalar(
            select(Theme)
            .where(Theme.id == sub_theme["id"])
        )
        # Append the theme to the list
        sub_themes_list.append(new_theme)
    return sub_themes_list

def __record_creation(t_id, name, p_id, u_id):
    # PascalCase because it is a class
    ThemeChange = Theme.__change__

    change = ThemeChange(
        i_id=t_id,
        p_id=p_id,
        u_id=u_id,
        name=name,
        change_type=ChangeType.create
    )

    db.session.add(change)

def __record_name_edit(t_id, old_name, p_id, u_id, new_name):
    # PascalCase because it is a class
    ThemeChange = Theme.__change__

    change = ThemeChange(
        i_id=t_id,
        p_id=p_id,
        u_id=u_id,
        name=old_name,
        description=new_name,
        change_type=ChangeType.name
    )

    db.session.add(change)

def __record_description_edit(t_id, old_name, p_id, u_id):
    # PascalCase because it is a class
    ThemeChange = Theme.__change__

    change = ThemeChange(
        i_id=t_id,
        p_id=p_id,
        u_id=u_id,
        name=old_name,
        change_type=ChangeType.description
    )

    db.session.add(change)