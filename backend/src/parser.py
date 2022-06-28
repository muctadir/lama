"""
Authors: Eduardo Costa Martins
"""

from src.exc import ChangeSyntaxError

"""
This function will parse a change to a readable description. It looks at the type of change that was 
made and deflects the parsing to a helper function which parses that type of change.

Each change has a description which contains encoded, compact information. When parsing,
the encoded description will be converted to a more readable format which is displayed on the frontend.
This also allows us to easily make changes here if we do not like the formats we have now.

@param change: An object of type Change
@param username: the name of the user corresponding to the u_id in the change
"""
def parse_change(change, username):
    from src.models.change_models import ChangeType
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
        case ChangeType.theme_children:
            return __parse_theme_children(change, username)
        case ChangeType.labelled:
            return __parse_labelled(change, username)
        case ChangeType.deleted:
            return __parse_deleted(change, username)


def __parse_creation(change, username):
    """
    A creation string should be of the format
    "label_type_name" if a label was created
    or null otherwise
    """
    item_type = change.item_class_name
    parsed_name = f'"{change.name}"' if item_type != 'Artifact' else change.name
    if item_type == 'Label':
        description = change.description.split(' ; ')
        if len(description) != 1:
            raise ChangeSyntaxError
        return f"{username} created {item_type} {parsed_name} of type \"{change.description}\""
    if change.description:
        raise ChangeSyntaxError
    return f"{username} created {item_type} {parsed_name}"


def __parse_name_edit(change, username):
    """
    A name edit string should be of the format:
    "new_name"
    """
    item_type = change.item_class_name
    description = change.description.split(' ; ')
    if len(description) != 1:
        raise ChangeSyntaxError
    return f"{username} renamed {item_type} \"{change.name}\" to \"{description[0]}\""


def __parse_desc_edit(change, username):
    """
    A description edit string should be null
    """
    item_type = change.item_class_name
    if change.description:
        raise ChangeSyntaxError
    return f"{username} changed the description of {item_type} \"{change.name}\""


def __parse_split(change, username):
    """
    A split string should be of the format:
    "parent_id"
    """
    description = change.description.split(' ; ')
    if len(description) != 1:
        raise ChangeSyntaxError
    return f"{username} created Artifact {change.name} by splitting from Artifact {change.description}"


def __parse_merge(change, username):
    """
    A merge string should be of the format:
    "new_label_name ; label_type_name ; <comma separated label names that were merged>" for labels
    or
    "new_label_name ; label_type_name ; old_label_name" for artifacts and themes
    """
    description = change.description.split(' ; ')
    if len(description) != 3:
        raise ChangeSyntaxError
    match change.item_class_name:
        case 'Label':
            names = description[2].split(',')
            if len(names) < 2:
                raise ChangeSyntaxError
            parsed_names = '["' + '", "'.join(names) + '"]'
            return f"{username} created Label \"{change.name}\" of type \"{description[1]}\" by merging labels {parsed_names}"
        case 'Artifact':
            return f"{username} changed a labelling for Artifact {change.name} of type \"{description[1]}\" from \"{description[2]}\" to \"{description[0]}\" as a result of a merge"
        case 'Theme':
            return f"Theme \"{change.name}\" had Label \"{description[2]}\" of type \"{description[1]}\" switched for \"{description[0]}\" as a result of a merge {username} made"
        case _:
            raise ChangeSyntaxError


def __parse_theme_children(change, username):
    """
    A theme_children string should be of the format:
    "'subtheme'|'label' ; <comma separated theme names>"
    """
    description = change.description.split(' ; ')
    if len(description) != 2:
        raise ChangeSyntaxError
    names = description[1].split(',')
    parsed_names = '["' + '", "'.join(names) + \
        '"]' if names[0] != '' else 'nothing'
    return f"{username} set {description[0]}s of Theme \"{change.name}\" to {parsed_names}"


def __parse_labelled(change, username):
    """
    A labelled string should be of the format:
    'label' ; label_type_name ; label_name
    or
    'edit' ; label_type_name ; old_label_name ; new_label_name ; old_username
    """
    description = change.description.split(' ; ')
    match description[0]:
        case 'label':
            if len(description) != 3:
                raise ChangeSyntaxError
            return f"{username} labelled Artifact {change.name} with Label \"{description[2]}\" of type \"{description[1]}\""
        case 'edit':
            if len(description) != 5:
                raise ChangeSyntaxError
            return f"{username} changed {description[4]}'s labelling for Artifact {change.name} of type \"{description[1]}\" from \"{description[2]}\" to \"{description[3]}\""
        case _:
            raise ChangeSyntaxError


def __parse_deleted(change, username):
    """
    A deleted string should be null
    """
    item_type = change.item_class_name
    if change.description:
        raise ChangeSyntaxError
    return f"{username} deleted {item_type} \"{change.name}\""
