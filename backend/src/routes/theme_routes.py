# Veerle Furst
# Eduardo Costa Martins

from src.models import db
from src.models.item_models import Theme, Label, label_to_theme
from src.models.change_models import ChangeType
from src.models.project_models import Project
from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select, func, update
from src.app_util import login_required, check_args, in_project, check_string, check_whitespaces, not_frozen
from src.routes.label_routes import get_label_info, get_loose_labels
from sqlalchemy.exc import OperationalError
from src.exc import ChangeSyntaxError, ThemeCycleDetected
from src.search import search_func_all_res, best_search_results
from collections import defaultdict

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
    theme_schema = Theme.__marshmallow__()

    # List for theme information
    theme_info = [{
        'theme': theme_schema.dump(theme),
        'number_of_labels': get_theme_label_count(theme.id)
    } for theme in all_themes]

    # Convert the list of dictionaries to json
    dict_json = jsonify(theme_info)

    # Return the list of dictionaries
    return make_response(dict_json, 200)


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
    theme_schema = Theme.__marshmallow__()

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
    sub_themes = (theme.sub_themes).filter_by(deleted=0)
    # Make a json list of sub-themes
    sub_themes_list_json = theme_schema.dump(sub_themes, many=True)

    # LABELS
    # Make list of all labels
    labels = (theme.labels).filter_by(deleted=0)

    # Then throw this loop in a list comprehension
    labels_list_json = [get_label_info(
        label, user.id, membership.admin) for label in labels]

    # INFO
    # Put all values into a dictonary
    info = {
        "theme": theme_json,
        "super_theme": super_theme_json,
        "sub_themes": sub_themes_list_json,
        "labels": labels_list_json
    }

    # Convert the list of dictionaries to json
    dict_json = jsonify(info)

    # Return the list of dictionaries
    return make_response(dict_json, 200)


"""
Given a theme id, returns a list of possible themes that can be added as sub themes
This means themes that:
    - are in the same project
    - have no super theme
    - would not introduce a cycle if they were added as a sub theme
    - themes that are not deleted
"""


@theme_routes.route("/possible-sub-themes", methods=["GET"])
@login_required
@in_project
def possible_sub_themes():
    # The required arguments
    required = ["p_id", "t_id"]

    # Get args
    args = request.args

    # Check if all required arguments are there
    if not check_args(required, args):
        return make_response("Not all required arguments supplied", 400)

    # Schema to serialize
    theme_schema = Theme.__marshmallow__()

    # Get the project id
    p_id = int(args["p_id"])
    # Get theme id
    t_id = int(args["t_id"])

    # Check cycle subthemes when we are in edit mode
    root_id = __get_root(t_id) if t_id != 0 else 0

    # Get the themes without parents, and those that would not introduce a cycle
    themes = db.session.scalars(
        select(Theme)
        .where(
            Theme.p_id == p_id,
            Theme.super_theme == None,
            Theme.id != root_id,
            Theme.deleted == False
        )
    ).all()

    # Dump the themes to get the info
    themes_info = theme_schema.dump(themes, many=True)

    # Convert the list of dictionaries to json
    list_json = jsonify(themes_info)

    # Return the list of dictionaries
    return make_response(list_json, 200)


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
@not_frozen
def create_theme(*, user):
    # The required arguments
    required = ["name", "description", "labels", "sub_themes", "p_id"]

    # Get args
    args = request.json

    # Check if all required arguments are there
    if not check_args(required, args):
        return make_response("Not all required arguments supplied", 400)

    # Check for invalid characters
    if check_whitespaces([args['name'], args['description']]):
        return make_response("Input contains leading or trailing whitespaces", 400)

    # Check for invalid characters
    if check_string([args['name']]):
        return make_response("Input contains a forbidden character", 511)

    # Check if the theme name is unique
    try:
        if theme_name_taken(args["name"], 0):
            # Respond that theme name already exists
            return make_response("Theme name already exists", 400)
    except OperationalError as err:
        # An illegal character was passed to the database
        if "Illegal" in err.args[0]:
            return make_response("Input contains an illegal character", 400)
        # Another error occured
        else:
            return make_response("Bad request", 400)

    # Theme creation info
    theme_creation_info = {
        "name": args["name"],
        "description": args["description"],
        "p_id": args["p_id"]
    }

    # Load the theme data into a theme object
    thema_schema = Theme.__marshmallow__()
    theme = thema_schema.load(theme_creation_info)

    # Add the theme to the database
    db.session.add(theme)
    # Flush updates the id of the theme object
    db.session.flush()

    # Record the creation of this theme in the theme changelog
    __record_creation(theme.id, theme.name, args['p_id'], user.id)

    # Make the sub_themes the sub_themes of the created theme
    sub_theme_ids = [sub_theme['id'] for sub_theme in args["sub_themes"]]
    try:
        make_sub_themes(theme, sub_theme_ids, user.id)
    except ValueError as e:
        if str(e).startswith("Deleted"):
            return make_response("You cannot add deleted themes", 400)
        elif str(e).startswith("Theme not"):
            return make_response("You cannot add themes in different projects", 400)
        return make_response("You cannot add themes that already have super themes", 400)
    # Note we do not catch ThemeCycleDetected since it cannot happen whilst creating a theme

    # Make the labels the labels of the created theme
    try:
        make_labels(theme, args["labels"], user.id)
    except ValueError as e:
        if str(e).startswith("Deleted"):
            return make_response("You cannot add deleted labels", 400)
        return make_response("You cannot add labels in different projects", 400)

    # Create the project
    try:
        db.session.commit()
    except OperationalError as err:
        if "Illegal mix of collations" in err.args[0]:
            return make_response("Input contains an illegal character", 400)
        else:
            return make_response("Internal Server Error", 503)

    # Return the confirmation
    return make_response("Theme created", 201)


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
@not_frozen
def edit_theme(*, user):
    # The required arguments
    required = ["id", "name", "description", "labels", "sub_themes", "p_id"]

    # Get args
    args = request.json

    # Check if all required arguments are there
    if not check_args(required, args):
        return make_response("Not all required arguments supplied", 400)

    # Check for invalid characters
    if check_whitespaces([args['name'], args['description']]):
        return make_response("Input contains leading or trailing whitespaces", 400)

    # Check for invalid characters
    if check_string([args['name']]):
        return make_response("Input contains a forbidden character", 511)

    # Check if the theme name is unique
    try:
        if theme_name_taken(args["name"], args["id"]):
            # Theme name already exists in the database
            return make_response("Theme name already exists", 400)
    except OperationalError as err:
        # A character was passed to the database that the database cannot handle
        if "Illegal" in err.args[0]:
            return make_response("Input contains an illegal character", 400)
        # Another error occured while querying
        else:
            return make_response("Bad request", 400)

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

    # Records the renaming in the theme changelog, only if the theme was actually renamed
    if theme.name != args['name']:
        __record_name_edit(theme.id, theme.name, p_id, user.id, args['name'])

    # Records a changing of the description in the theme changelog, only if the description was actually changed
    if theme.description != args['description']:
        __record_description_edit(theme.id, args['name'], p_id, user.id)

    # Change the theme information
    db.session.execute(
        update(Theme).
        where(Theme.id == t_id).
        values(
            name=args["name"],
            description=args["description"]
        )
    )

    sub_theme_ids = [sub_theme['id'] for sub_theme in args["sub_themes"]]

    # Set the sub_themes of the theme
    try:
        make_sub_themes(theme, sub_theme_ids, user.id)
    except ThemeCycleDetected:
        return make_response("Your choice of subthemes would introduce a cycle", 400)
    except ValueError as e:
        if str(e).startswith("Deleted"):
            return make_response("You cannot add deleted themes", 400)
        elif str(e).startswith("Theme not"):
            return make_response("You cannot add themes in different projects", 400)
        return make_response("You cannot add themes that already have super themes", 400)

    # Set the labels of the theme
    try:
        make_labels(theme, args["labels"], user.id)
    except ValueError as e:
        if str(e).startswith("Deleted"):
            return make_response("You cannot add deleted labels", 400)
        return make_response("You cannot add labels in different projects", 400)

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
@not_frozen
def delete_theme(*, user):
    # The required arguments
    required = ["p_id", "t_id"]

    # Get args
    theme_info = request.json
    
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
        values(deleted=True)
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


# Author: Eduardo
# Search labels
@theme_routes.route('/search', methods=['GET'])
@login_required
@in_project
def search_route():
    # Get arguments
    args = request.args
    # Required arguments
    required = ['p_id', 'search_words']

    # Check if required agruments are supplied
    if not check_args(required, args):
        return make_response('Not all required arguments supplied', 400)

    # Sanity conversion to int (for when checking for equality in sql)
    p_id = int(args['p_id'])

    # Get all the themes that are not deleted
    themes = db.session.scalars(
        select(
            Theme
        ).where(
            Theme.p_id == p_id,
            Theme.deleted == False
        )
    ).all()

    # Columns we search through
    search_columns = ['id', 'name', 'description']

    # Get search results
    results = search_func_all_res(
        args['search_words'], themes, 'id', search_columns)
    # Take the best results
    clean_results = best_search_results(
        results, len(args['search_words'].split()))
    # Gets the actual label object from the search
    themes_results = [result['item'] for result in clean_results]
    # Schema for serialising
    theme_schema = Theme.__marshmallow__()
    # Serialise results and jsonify
    return make_response(jsonify(theme_schema.dump(themes_results, many=True)), 200)


"""
Author: Eduardo Costa Martins
Return project hierarchy (see get_project_hierarchy())
"""


@theme_routes.route("/themeVisData", methods=["GET"])
@login_required
@in_project
def theme_vis_route():
    # Arguments supplied by the frontend
    args = request.args
    # Arguments that we need
    required = ['p_id']

    # Check that the required arguments were supplied (no more, no less)
    if not check_args(required, args):
        return make_response("Bad Request", 400)

    # Get the required data for theme visualization (already in the required format)
    try:
        hierarchy = get_project_hierarchy(args['p_id'])
    except ThemeCycleDetected:
        return make_response("Cycle detected: cannot display theme hierarchy", 406)

    # The project hierarchy is None if the project does not exist
    # Maybe a redundant check since the existence of the project is guaranteed due to the
    # foreign key dependency of Membership (and we check membership in @in_project)
    if not hierarchy:
        return make_response("Bad Request", 400)

    return make_response(jsonify(hierarchy), 200)


"""
Function for getting the number of labels in the theme
@params t_id: theme id
"""


def get_theme_label_count(t_id):
    return db.session.scalar(
        select(func.count(label_to_theme.c.l_id))
        .where(label_to_theme.c.t_id == t_id)
    )


"""
Robust method for setting the labels of a theme
@params labels_info includes: {
    id: id of the label
}
@throws ValueError if the user attempts to add a deleted label or a label in a different project
"""


def make_labels(theme, labels_info, u_id):
    # List for the label ids
    label_ids_list = [label['id'] for label in labels_info]

    # Get all labels that are in the list
    labels = db.session.scalars(
        select(Label)
        .where(Label.id.in_(label_ids_list))
    ).all()

    for label in labels:
        # Check the user is not trying to add deleted labels
        if label.deleted:
            raise ValueError(f"Deleted label added, id: {label.id}")
        # Check the user is not trying to add labels in a different project
        if label.p_id != theme.p_id:
            raise ValueError(f"Label not in correct project, id: {label.id}")

    label_names = [label.name for label in labels]

    # If the assigned labels have changed
    if set(labels) != set((theme.labels).filter_by(deleted=0)):
        theme.labels = labels
        __record_children(theme.id, theme.name, theme.p_id,
                          u_id, label_names, 'label')


"""
Robust method for setting new subthemes of a theme
@params sub_themes_ids : a list of ids of sub_themes
@throws ThemeCycleDetected if the user attempts to add a subtheme that would introduce a cycle
@throws ValueError if the user attempts to add a deleted theme, a theme in a different project, or a theme which already has a super theme
"""


def make_sub_themes(theme, sub_theme_ids, u_id):
    root_id = __get_root(theme.id)

    if root_id in sub_theme_ids:
        raise ThemeCycleDetected

    # Get all themes that are in the list
    sub_themes = db.session.scalars(
        select(Theme)
        .where(Theme.id.in_(sub_theme_ids))
    ).all()

    for sub_theme in sub_themes:
        # Check the user is not trying to add deleted themes
        if sub_theme.deleted:
            raise ValueError(f"Deleted theme added, id: {sub_theme.id}")
        # Check the user is not trying to add themes in a different project
        if sub_theme.p_id != theme.p_id:
            raise ValueError(f"Theme not in correct project, id: {sub_theme.id}")
        # Check the user is not trying to add themes that already have a super theme (that is not the given one)
        if sub_theme.super_theme_id is not None and sub_theme.super_theme_id != theme.id:
            raise ValueError(f"Theme already has a super theme, id: {sub_theme.id}")

    # Get names from themes
    sub_theme_names = [sub_theme.name for sub_theme in sub_themes]

    # If the assigned subthemes have changed
    if set(sub_themes) != set((theme.sub_themes).filter_by(deleted=0)):
        theme.sub_themes = sub_themes
        __record_children(theme.id, theme.name, theme.p_id, u_id,
                          sub_theme_names, 'subtheme')


"""
Function that checks if a theme name is already taken
@params name: string, the name to be checked
@returns true if name is already a theme name and false otherwise
"""


def theme_name_taken(name, t_id):
    return bool(db.session.scalars(
        select(Theme)
        .where(
            Theme.name == name,
            Theme.id != t_id
        ))
                .first())


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


def __record_children(t_id, t_name, p_id, u_id, c_names, c_type):
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


"""
Author: Eduardo Costa Martins
Takes a theme id, and gets all its descendant subthemes and labels
Note that SQL has a limit on recursion depth. _Our_ database defaults to 1000. Yours may not.
@param t_id: id of the theme to get subthemes and labels of
@returns a list of tuples of the type
    (
        The id of its super theme (or None if it does not have a super theme),
        The id of the child,
        Its name,
        Whether or not it has been deleted,
        Its type (0 for theme, 1 for label)
    )
@raises ThemeCycleDetected if the recursion limit is reached (likely due to a cycle)
"""


def __get_children(t_id):
    # Recursive queries in SQL can be done using CTEs (Common Table Expressions)
    # This is the anchor statement (like a base case) which gets the immediate subthemes of the given theme
    subthemes = select(
        Theme.super_theme_id,
        Theme.id,
        Theme.name,
        Theme.deleted
    ).where(
        Theme.id == t_id
    ).cte(
        recursive=True
    )

    # Since we recurse on the results generated by the previous query, we need to alias it
    subthemes_alias = subthemes.alias()

    # The union all connects the recursive statement with the anchor statement
    subthemes = subthemes.union_all(
        # Recursive statement, gets the children of all retrieved themes so far
        select(
            Theme.super_theme_id,
            Theme.id,
            Theme.name,
            Theme.deleted
        ).where(
            Theme.super_theme_id == subthemes_alias.c.id
        )
    )

    # We select all the information from the CTE
    # We also append the number 0 to each result to distinguish the type
    try:
        results = db.session.execute(select(subthemes, 0)).all()

        # Then we extend this result with all the labels for each theme included in the results
        # A label may be used in many themes, this is fine
        # We also append the number 1 to each result to distinguish the type
        results += db.session.execute(select(
            label_to_theme.c.t_id,
            label_to_theme.c.l_id,
            Label.name,
            Label.deleted,
            1
        ).where(
            Label.id == label_to_theme.c.l_id,
            label_to_theme.c.t_id == subthemes.c.id
        )).all()

    except OperationalError as e:
        # CTEs are limited so I am not aware of a way to stop the recursion early (DISTINCT not allowed for CTE)
        # So currently we catch an exception and check the error code
        # This could be made better by actually, checking the type of database we use, but suitable for now
        # e.orig.args[0] contains the error code
        if e.orig.args[0] in [ThemeCycleDetected.MariaDB, ThemeCycleDetected.MySQLdb]:
            raise ThemeCycleDetected
        raise e

    return results


"""
Author: Eduardo Costa Martins
@param t_id: The id of the theme to get children of
@returns The theme passed, and its descendants as a nested dictionary in a tree-like form. 
Each dictionary is of the form:
{
    id: the id of the item (theme/label)
    name: the name of the item (theme/label)
    deleted: if the item is deleted
    type: the type of the item, as a string 'Theme' or 'Label'
    children: a list of dictionaries of items that are children of this theme
}
The children key does not exist for labels, or themes without children.
The top level dictionary represents the theme that was passed
"""


def __grouped_children(t_id):
    results = __get_children(t_id)

    # A dictionary which will use a default implementation to add things to lists
    # Or create the list if this does not exist
    grouped_children = defaultdict(list)

    # Group children by their parent
    # Also formats the type from 0, 1, to Theme, Label
    for result in results:
        # Indexed by the parent_id
        grouped_children[result[0]].append(
            {
                # The child id
                'id': result[1],
                # The name of the child
                'name': result[2],
                # If the theme or label is deleted
                'deleted': result[3],
                # The type of the child
                'type': 'Theme' if result[4] == 0 else 'Label'
            }
        )

    # By nature of __get_children() the root theme will be in the first position
    # Since grouped_children is indexed by super_theme_id, we let this be the root
    root = results[0][0]

    # We collapse grouped_children by iteratively constructing a tree
    # We construct the tree in a breadth-first manner
    # Here the accumulator will represent all children at a certain depth
    accumulator = grouped_children[root]

    # We keep nesting until we reach a depth with no children
    while len(accumulator) > 0:
        # This will contain the children at the next depth
        new_accumulator = []
        # For each item at this depth
        for sibling in accumulator:
            # Check if the item is a theme, and if the theme has children
            if sibling['type'] == 'Theme' and sibling['id'] in grouped_children:
                # Get the children of the theme with this id
                children = grouped_children.pop(sibling['id'])
                # Update this theme's children
                sibling['children'] = children
                # Update the new accumulator with the items at the next depth
                new_accumulator.extend(children)
        # We are done using the old accumulator, update it with the new one
        accumulator = new_accumulator

    # By the nature of __get_children(), the passed theme is the root element
    # and there are no other themes at its depth retrieved (no siblings retrieved)
    # Thus we can safely just return the first (and only) element at the root

    return grouped_children[root][0]


"""
Author: Eduardo Costa Martins
Groups the theme hierarchies (see grouped_children()) for maximal themes under a project node.
The project node has structure
{
    'id' : p_id,
    'name' : project name,
    'deleted' : False
    'type' : 'Project',
    'children' : [theme hierarchies for maximal themes, and loose labels]
}
@param p_id : the project to get the hierarchy of
@returns the project hierarchy as described above, or None if the project with that id does not exist
A loose label is one that is not assigned to a theme
The deleted is still provided to make sure the node has the same structure as other nodes
"""


def get_project_hierarchy(p_id):
    project = db.session.get(Project, p_id)

    # Check if project exists
    if not project:
        return None

    # The ids of all themes which are maximal (do not have a super theme)
    maximal_themes = db.session.scalars(select(
        Theme.id
    ).where(
        # Theme is in project
        Theme.p_id == p_id,
        # Theme is maximial
        Theme.super_theme_id == None
    )).all()

    # All themes grouped in a hierarchy, this list contains the hierarchy for each maximal theme
    grouped_themes = [__grouped_children(t_id) for t_id in maximal_themes]

    # We group the maximal themes under the project node
    hierarchy = {
        'id': project.id,
        'name': project.name,
        'deleted': False,
        'type': 'Project',
        'children': grouped_themes
    }

    # Get labels without a theme
    loose_labels = get_loose_labels(p_id)

    # Add those labels as a direct child of the project
    hierarchy['children'].extend(loose_labels)

    return hierarchy


"""
Author: Eduardo Costa Martins
@param t_id: id of a theme
@returns List of tuples corresponding to information of themes on the path to the root of the given theme's tree
         Each tuple has the form (super_theme_id, theme_id)
"""


def __get_super_themes(t_id):
    # Recursive queries in SQL can be done using CTEs (Common Table Expressions)
    # This is the anchor statement (like a base case) which gets the given theme, and the id of its super theme
    super_themes = select(
        Theme.super_theme_id,
        Theme.id
    ).where(
        Theme.id == t_id
    ).cte(
        recursive=True
    )

    # Since we recurse on the results generated by the previous query, we need to alias it
    super_themes_alias = super_themes.alias()

    # The union all connects the recursive statement with the anchor statement
    super_themes = super_themes.union_all(
        # Recursive statement, gets the parent of newly retrieved themes
        select(
            Theme.super_theme_id,
            Theme.id
        ).where(
            Theme.id == super_themes_alias.c.super_theme_id
        )
    )

    try:
        results = db.session.execute(select(super_themes)).all()
    except OperationalError as e:
        # CTEs are limited so I am not aware of a way to stop the recursion early (DISTINCT not allowed for CTE)
        # So currently we catch an exception and check the error code
        # This could be made better by actually, checking the type of database we use, but suitable for now
        # e.orig.args[0] contains the error code
        if e.orig.args[0] in [ThemeCycleDetected.MariaDB, ThemeCycleDetected.MySQLdb]:
            raise ThemeCycleDetected
        raise e

    return results


"""
Author: Eduardo Costa Martins
@param t_id : id of a theme
@returns the id of the theme that is the root of the hierarchy tree this theme is contained in
@raises ValueError if the root cannot be found (likely due to poor integrity of the database)
"""


def __get_root(t_id):
    # Get all super themes
    themes = __get_super_themes(t_id)

    # The root theme is designated by the one with no super theme
    # By the construction of the recursive query, the root element should be the last one in the list
    if themes[-1][0] is None:
        return themes[-1][1]
    # If it's not, then we search through every theme
    else:
        for theme in themes:
            if theme[0] is None:
                return theme[1]

    # The maximal super theme in this hierarchy is not given in the list of themes
    raise ValueError
