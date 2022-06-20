# Veerle Furst
# Eduardo Costa Martins

from flask import current_app as app
from src.models import db
from src.models.item_models import Theme, ThemeSchema, Label, label_to_theme
from src.models.change_models import ChangeType
from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select, func, update, or_
from src.app_util import login_required, check_args, in_project
from src.routes.label_routes import get_label_info
from sqlalchemy.exc import OperationalError
from src.exc import ChangeSyntaxError

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
def theme_management_info():

    # The required arguments
    required = ["p_id"]

    # Get args
    args = request.args
    
    # Check if all required arguments are there
    if not check_args(required, args):
        return make_response("Not all required arguments supplied", 400)

    # Get all themes
    all_themes = db.session.scalars(
        select(Theme)
        .where(
            Theme.p_id == args["p_id"],
            Theme.deleted == False
        )
    ).all()

    # Schemas to serialize
    theme_schema = ThemeSchema()

    # List for theme information
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
@in_project
def all_themes_no_parents():

    # The required arguments
    required = ["p_id", "t_id"]

    # Get args
    args = request.args

    # Check if all required arguments are there
    if not check_args(required, args):
        return make_response("Not all required arguments supplied", 400)

    # Schema to serialize
    theme_schema = ThemeSchema()

    # Get the project id
    p_id = int(args["p_id"])
    # Get theme id
    t_id = int(args["t_id"])

    # Get the themes without parents
    themes = db.session.scalars(
        select(Theme)
        .where(
            Theme.p_id == p_id,
            Theme.super_theme == None,
            Theme.id != t_id,
            Theme.deleted == False
        )
    ).all()

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

    # Check if the theme name is unique
    if theme_name_taken(theme_info["name"]):
        return make_response("Theme name already exists")

    # Theme creation info
    theme_creation_info = {
        "name": args["name"],
        "description": args["description"],
        "p_id": args["p_id"]
    }

    # Load the theme data into a theme object
    thema_schema = ThemeSchema()
    theme = thema_schema.load(theme_creation_info)

    # Add the theme to the database
    db.session.add(theme)
    # Flush updates the id of the theme object
    db.session.flush()
    # Record the creation of this theme in the theme changelog
    __record_creation(theme.id, theme.name, args['p_id'], user.id)

    # Make the sub_themes the sub_themes of the created theme
    make_sub_themes(theme, args["sub_themes"], args['p_id'], user.id)

    # Make the labels the labels of the created theme
    make_labels(theme, args["labels"], args['p_id'], user.id)

    # Create the project
    try:
        db.session.commit()   
    except OperationalError:
        return make_response("Internal Server Error", 503) 

    # Return the conformation
    return make_response("Theme created", 200)

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
        return make_response("Not all required arguments supplied", 400)

    # Check if the theme name is unique
    if theme_name_taken(args["name"]):
        return make_response("Theme name already exists")
    
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
    
    # Records a changing of the description in the theme changelog, only if the description was actually changed
    if theme.description != args['description']:
        __record_description_edit(theme.id, args['name'], p_id, user.id)
    # Records the renaming in the theme changelog, only if the theme was actually renamed
    if theme.name != args['name']:
        __record_name_edit(theme.id, theme.name, p_id, user.id, args['name'])
    

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
    make_sub_themes(theme, args["sub_themes"], args['p_id'], user.id)

    # Set the labels of the theme
    make_labels(theme, args["labels"], args['p_id'], user.id)

    # Edit the theme
    try:
        db.session.commit()   
    except OperationalError:
        return make_response("Internal Server Error", 503)       

    # Return the conformation
    return make_response("Theme edited", 200)

"""
For editing a theme 
@params a list of theme information:
{
    t_id: id of the theme
    p_id: project id
}
"""
@theme_routes.route("/delete_theme", methods=["POST"])
@login_required
@in_project
def delete_theme(*, user):

    # The required arguments
    required = ["p_id", "t_id"]

    # Get args
    args = request.json

    # Get the info
    theme_info = args["params"]

    # Check if all required arguments are there
    if not check_args(required, theme_info):
        return make_response("Not all required arguments supplied", 400)
    
    # Get theme id
    t_id = theme_info["t_id"]
    # Project id
    p_id = theme_info["p_id"]

    # Get the corresponding theme
    theme = db.session.get(Theme, t_id)
    
    # Check if the theme exists
    if not theme:
        return make_response("Bad request", 400)

    # Check if theme is in given project
    if theme.p_id != p_id:
        return make_response("Bad request", 400)
        
    # Change the theme information to be deleted
    db.session.execute(
        update(Theme).
        where(Theme.id == t_id).
        values(deleted = True)
    )

    # Records the deleting of this theme in the theme changelog
    __record_delete(theme.id, theme.name, p_id, user.id)

    # Delete the theme
    try:
        db.session.commit()   
    except OperationalError:
        return make_response("Internal Server Error", 503)       

    # Return the conformation
    return make_response("Theme deleted", 200)

"""
For getting the labels from the passed data
@params labels_info includes: {
    id: id of the label
}
"""
def make_labels(theme, labels_info, p_id, u_id):
    # List for the label ids
    label_ids_list = [label['id'] for label in labels_info]
    
    # Get all labels that are in the list
    labels = db.session.scalars(
        select(Label)
        .where(Label.id.in_(label_ids_list))
    ).all()

    label_names = [label.name for label in labels]

    # If the assigned labels have changed
    if set(labels) != set(theme.labels):
        theme.labels = labels
        __record_chilren(theme.id, theme.name, p_id, u_id, label_names, 'label')

"""
For getting the themes from the passed data
@params sub_themes_info includes: {
    id: id of the theme
}
"""
def make_sub_themes(theme, sub_themes_info, p_id, u_id):

    # List for the theme ids
    sub_theme_ids_list = [theme['id'] for theme in sub_themes_info]
    
    # Get all themes that are in the list
    sub_themes = db.session.scalars(
        select(Theme)
        .where(Theme.id.in_(sub_theme_ids_list))
    ).all()
    # Get names from themes
    sub_theme_names = [sub_theme.name for sub_theme in sub_themes]

    # If the assigned subthemes have changed
    if set(sub_themes) != set(theme.sub_themes):
        theme.sub_themes = sub_themes
        __record_chilren(theme.id, theme.name, p_id, u_id, sub_theme_names, 'subtheme')

"""
Function that checks if a theme name is already taken
@params name: string, the name to be checked
@returns true if name is already a theme name and false otherwise
"""
def theme_name_taken(name):
    if bool(db.session.scalars(
        select(Theme)
        .where(Theme.name==name))
        .first()):
        return True
    return False


"""
Records the creation of a theme in the theme changelog
@param t_id: the id of the theme created
@param name: the name of the theme created
@param p_id: the id of the project the theme is in
@param u_id: the id of the user that created the theme
"""
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

"""
Records the editing of a theme's name in the theme changelog
@param t_id: the id of the theme that was edited
@param old_name: the theme name before being renamed
@param new_name: the theme name after being renamed
@param p_id: the id of the project the theme is in
@param u_id: the id of the user that renamed the theme
"""
def __record_name_edit(t_id, old_name, p_id, u_id, new_name):
    # PascalCase because it is a class
    ThemeChange = Theme.__change__

    change = ThemeChange(
        i_id=t_id,
        p_id=p_id,
        u_id=u_id,
        # Names in the changelog tables refer to the old names
        name=old_name,
        # The encoding for renaming is just the new name
        description=new_name,
        change_type=ChangeType.name
    )

    db.session.add(change)

"""
Records the editing of a theme's description in the theme changelog
@param t_id: the id of the theme that was edited
@param name: the name of the theme that was edited
@param p_id: the project id of the theme that was edited
@param u_id: the id of the user that edited the theme
"""
def __record_description_edit(t_id, name, p_id, u_id):
    # PascalCase because it is a class
    ThemeChange = Theme.__change__

    change = ThemeChange(
        i_id=t_id,
        p_id=p_id,
        u_id=u_id,
        name=name,
        change_type=ChangeType.description
    )

    db.session.add(change)

"""
Records changing of a theme's 'children' in the theme changelog.
A child here refers to the labels or subthemes of a theme.
@param t_id: the id of the theme changed
@param t_name: the name of the theme changed
@param p_id: the id of the project the theme changed is in
@param u_id: the id of the user that changed the theme
@param c_names: a list of names of the children
@param c_type: the type of child, EITHER 'label' OR 'subtheme'
"""
def __record_chilren(t_id, t_name, p_id, u_id, c_names, c_type):
    # Check that the correct child type was provided
    if c_type != 'label' and c_type != 'subtheme':
        raise ChangeSyntaxError

    # PascalCase because it is a class
    ThemeChange = Theme.__change__

    change = ThemeChange(
        i_id=t_id,
        p_id=p_id,
        u_id=u_id,
        name=t_name,
        # The encoding for adding children is the type of child followed by the children names
        description=c_type + ' ; ' + ','.join(c_names),
        change_type=ChangeType.theme_children
    )
    db.session.add(change)

"""
Records the deletion of a theme in the theme changelog
Note that since the theme can no longer be viewed, its personal history can't be viewed either
This change is still recorded in case the project is extended with a history page over all themes
@param t_id: the id of the theme that was deleted
@param name: the name of the theme that was deleted
@param p_id: the id of the project the theme belong(ed/s) to
@param u_id: the id of the user that deleted the theme
"""
def __record_delete(t_id, name, p_id, u_id):
    # PascalCase because it is a class
    ThemeChange = Theme.__change__

    change = ThemeChange(
        i_id=t_id,
        p_id=p_id,
        u_id=u_id,
        name=name,
        change_type=ChangeType.deleted
    )
    db.session.add(change)
