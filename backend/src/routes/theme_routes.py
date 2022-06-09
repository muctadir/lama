# Veerle Furst
# Eduardo Costa Martins

from flask import current_app as app
from src.models import db
from src.models.auth_models import User
from src.models.item_models import Theme, ThemeSchema, Label, label_to_theme
from src.models.project_models import Membership, ProjectSchema
from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select, func
from src.app_util import login_required, check_args, in_project
from src.routes.label_routes import get_label_info

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
        select(Theme).where(Theme.p_id == args["p_id"])
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

    # Schemas to serialize
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
}
"""
@theme_routes.route("/create_theme", methods=["POST"])
@login_required
def create_theme(*, user):

    # The required arguments
    required = ["name", "description", "labels", "sub_themes", "p_id"]

    # Get args
    args = request.json
    # Get the actual info
    theme_info = args['params']

    # Check if all required arguments are there
    if not check_args(required, theme_info):
        return make_response("Not all required arguments supplied", 400)

    # Theme creation info
    theme_creation_info = {
        "name": theme_info["name"],
        "description": theme_info["description"],
        "p_id": theme_info["p_id"]
    }

    # Load the project data into a project object
    thema_schema = ThemeSchema()
    theme = thema_schema.load(theme_creation_info)

    # Add the project to the database
    db.session.add(theme)

    # Add the sub_themes to the theme
    sub_themes_list = []
    # Make sub_themes themes
    for sub_theme in theme_info["sub_themes"]:
        # Get the theme
        new_theme = db.session.scalar(
            select(Theme)
            .where(Theme.id == sub_theme["id"])
        )
        # Append the theme to the list
        sub_themes_list.append(new_theme)
    # Make the sub_themes sub_themes of the created theme
    theme.sub_themes = sub_themes_list

    # Add the labels to the theme
    labels_list = []
    # Make sub_themes themes
    for label in theme_info["labels"]:
        # Get the theme
        new_label = db.session.scalar(
            select(Label)
            .where(Label.id == label["id"])
        )
        # Append the theme to the list
        labels_list.append(new_label)
    # Make the sub_themes sub_themes of the created theme
    theme.labels = labels_list

    # Create the project
    db.session.commit()        

    # Return the conformation
    return make_response("Project created", 200)