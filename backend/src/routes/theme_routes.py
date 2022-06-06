# Veerle Furst

from flask import current_app as app
from src.models import db
from src.models.auth_models import User
from src.models.item_models import Theme, ThemeSchema, LabelSchema, ArtifactSchema
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

    # Schemas to serialize
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
    theme : the serialized theme
    sub_theme: the sub themes of the them
    labels: the labels within the theme
}
"""
@theme_routes.route("/get-single-theme", methods=["POST"])
@login_required
def get_info_single_theme(*, user):

    # Get the arguments given
    args = request.json

    # Schemas to serialize
    theme_schema = ThemeSchema()
    label_schema = LabelSchema()
    artifact_schema = ArtifactSchema()

    # Get the theme id
    t_id = args["t_id"]

    # Get the corresponding themes
    theme = db.session.execute(
        select(Theme).
        where(Theme.id == t_id)
    ).scalars().one()

    # Convert theme to JSON
    theme_json = theme_schema.dump(theme)

    # SUPER THEME
    # Get the super theme
    super_theme = db.session.execute(
        select(Theme).
        where(Theme.id == theme.super_theme_id)
    ).scalars().first()
    # Get info
    super_theme_json = theme_schema.dump(super_theme)

    # SUB THEMES
    # Make list of all sub-themes
    sub_themes = [sub_theme for sub_theme in theme.sub_themes]

    # Make a list ogflabels
    sub_themes_list_json = []

    # For each sub-theme make get all the data
    for sub_theme in sub_themes:
        sub_theme_json = theme_schema.dump(sub_theme)
        sub_themes_list_json.append(sub_theme_json)

    # LABELS
    # Make list of all labels
    labels = [label for label in theme.labels]

    # Make a list of labels
    labels_list_json = []

    # For each label get all the data
    for label in labels:
        label_json = label_schema.dump(label)

        # ARTIFACTS
        # Make list of all artifacts
        artifacts = [artifact for artifact in label.artifacts]
        # Make a list to append the artifacts
        artifacts_list_json = []

        # For each artifact get all the data
        for artifact in artifacts:
            artifact_json = artifact_schema.dump(artifact)
            artifacts_list_json.append(artifact_json)

        # Info of the labels
        info = {
            "label" : label_json,
            "label_type": label.label_type.name,
            "artifacts" : artifacts_list_json
        }
        
        labels_list_json.append(info)

    # INFO
    # Put all values into a dictonary
    info = {
        "theme" : theme_json,
        "super_theme" : super_theme_json,
        "sub_themes" : sub_themes_list_json,
        "labels" : labels_list_json
    }

    print(info)

    # Convert the list of dictionaries to json
    dict_json = jsonify(info)

    # Return the list of dictionaries
    return make_response(dict_json)

