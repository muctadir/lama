# Veerle Furst

from flask import current_app as app
from src.models import db
from src.models.auth_models import User
from src.models.item_models import Artifact, LabelType, Theme, ThemeSchema, Label, LabelSchema
from src.models.project_models import Membership, ProjectSchema
from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select
from src.app_util import login_required

theme_routes = Blueprint("theme", __name__, url_prefix="/theme")

"""
For getting the theme information 
@returns a list of dictionaries of the form:
{
    theme : the serialized them
    labels : the labels within the theme
}
"""
@theme_routes.route("/get-themes", methods=["POST"])
@login_required
def get_all_themes(*, user):

    # Get args
    args = request.json

    # Get all themes
    all_themes = db.session.execute(
        select(Theme).where(Theme.p_id == args["p_id"])
    ).scalars().all()

    # List for project information
    theme_info = []

    # Schema to serialize the Project
    theme_schema = ThemeSchema()

    label_schema = LabelSchema()

    # For loop for admin, users, #artifacts
    for theme in all_themes:

        # Convert project to JSON
        theme_json = theme_schema.dump(theme)
        # List of labels in the theme
        list_of_labels = [label for label in theme.labels]

        # Make a list ogflabels
        label_list_json = []

        # For each label make get all the data
        for label in list_of_labels:
            label_json = label_schema.dump(label)
            label_list_json.append(label_json)

        # Put all values into a dictonary
        info = {
            "theme" : theme_json,
            "labels": label_list_json
        }

        # Append the dictionary to the list
        theme_info.append(info)

    # Convert the list of dictionaries to json
    dict_json = jsonify(theme_info)

    # Return the list of dictionaries
    return make_response(dict_json)

"""
For getting the theme information 
@returns a list of dictionaries of the form:
{
    theme : the serialized them
    childerIds: the ids of the childern
    parentIds: the ids of the parents
    labelIds : the labels within the theme
}
"""
@theme_routes.route("/get-single-theme", methods=["POST"])
@login_required
def get_info_single_theme(*, user):

    # Get the arguments given
    args = request.json

    # Get the corresponding themes
    theme = db.session.execute(
        select(Theme).
        where(Theme.id==args["id"])
    ).scalars().one()

    print(theme)

    # List for theme information
    theme_info = []

    # Schema to serialize the theme
    theme_schema = ThemeSchema()

    # Convert theme to JSON
    theme_json = theme_schema.dump(theme)
    
    # Put all values into a dictonary
    info = {
        "theme" : theme_json,

    }

    print(info)

    # Append the dictionary to the list
    theme_info.append(info)

    print(theme_info)

    # Convert the list of dictionaries to json
    dict_json = jsonify(theme_info)

    # Return the list of dictionaries
    return make_response(dict_json)
