# Veerle Furst
# Eduardo Costa Martins

from flask import current_app as app
from src.models import db
from src.models.auth_models import User
from src.models.item_models import Theme, ThemeSchema, LabelSchema, ArtifactSchema, label_to_theme, Artifact, Labelling
from src.models.project_models import Membership, ProjectSchema
from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select, func
from src.app_util import login_required, check_args
# TODO uncomment
# from src.routes.label_routes import get_label_info

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
#@in_project
def single_theme_info(*, user):#, membership): TODO uncomment

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

    # Make a list of labels
    labels_list_json = []

    # For each label get all the data
    for label in labels:

    # TODO uncomment
    # Then throw this loop in a list comprehension
    # labels_list_json = [get_label_info(label, user.id, membership.admin) for label in labels]

        # TODO remove
        admin = db.session.scalar(
            select(Membership.admin).where(Membership.u_id == user.id, Membership.p_id == p_id)
        )

        # Info of the labels
        label_info = get_label_info(label, user.id, admin)
        
        # Append the label to the list
        labels_list_json.append(label_info)

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
#@in_project
def all_themes_no_parents(*, user):#, membership): TODO uncomment

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


# TODO: Move to label_routes
# Only gets the artifacts that the user with a given id can see
def get_label_artifacts(label, u_id, admin):
    if admin:
        return label.artifacts
    # Else get the artifacts they may see
    return db.session.execute(
        select(Artifact).where(Artifact.id == Labelling.a_id, Labelling.u_id == u_id, Labelling.l_id == label.id)
    )

# Function for getting the information of a label
# TODO: Move to label_routes
def get_label_info(label, u_id, admin):
    # Schemas
    label_schema = LabelSchema()
    artifact_schema = ArtifactSchema()
    # Info of the label
    info = {
        "label" : label_schema.dump(label),
        "label_type": label.label_type.name,
        "artifacts" : artifact_schema.dump(get_label_artifacts(label, u_id, admin), many=True)
    }
    return info


# Function for getting the number of labels in the theme
def get_theme_label_count(t_id):
    return db.session.scalar(
            select(func.count(label_to_theme.c.l_id))
            .where(label_to_theme.c.t_id==t_id)
        )