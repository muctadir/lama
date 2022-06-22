# Author: Eduardo
# Author: Bartjan
# Author: Victoria
from src import db  # need this in every route
from flask import make_response, request, Blueprint, jsonify
from sqlalchemy import select, update, func, delete, insert
from sqlalchemy.exc import OperationalError
from src.app_util import login_required, in_project, check_string, check_whitespaces, check_args, not_frozen
from src.models.change_models import ChangeType
from src.models.item_models import Label, LabelSchema, LabelType, \
  Labelling, ThemeSchema, Artifact, ArtifactSchema, label_to_theme, Theme
from src.searching.search import search_func_all_res, best_search_results

label_routes = Blueprint("label", __name__, url_prefix="/label")

# Author: Eduardo, Bartjan
# Create a label
@label_routes.route('/create', methods=['POST'])
@login_required
@in_project
@not_frozen
def create_label(*, user):

    args = request.json['params']

    required = ['labelTypeId', 'labelName', 'labelDescription', 'p_id']

    # Check whether the required arguments are delivered
    if not check_args(required, args):
        return make_response('Bad Request', 400)
    
    # Check for invalid characters
    if check_whitespaces(args):
        return make_response("Input contains leading or trailing whitespaces", 400)

    # Check for invalid characters
    if check_string([args['labelName'], args['labelDescription']]):
        return make_response("Input contains a forbidden character", 511)

    # Check whether the length of the label name is at least one character long
    if len(args['labelName']) <= 0:
        return make_response('Bad request: Label name cannot have size <= 0', 400)

    # Check whether the length of label description is at least one character long
    if len(args['labelDescription']) <= 0:
        return make_response('Bad request: Label description cannot have size <= 0', 400)

    # Check whether the label type exists
    label_type = db.session.get(LabelType, args['labelTypeId'])
    if not label_type:
        return make_response('Label type does not exist', 400)

    # # Check whether the labeltype is part of the project
    if label_type.p_id != args['p_id']:
        return make_response('Label type not in this project', 400)

    # Make the label
    label = Label(name=args['labelName'],
                  description=args['labelDescription'],
                  lt_id=args['labelTypeId'],
                  p_id=args['p_id'])

    # Commit the label
    try:
        db.session.add(label)
        # Flushing updates the id of the label object
        db.session.flush()
        # Records the creation of the label in the label changelog
        __record_creation(label.id, label.name, label_type.name, args['p_id'], user.id)
        db.session.commit() 
    except OperationalError:
        return make_response('Internal Server Error: Commit to database unsuccessful', 500)

    return make_response('Created')

# Author: Bartjan, Victoria, Linh, Jarl
# Edit label
@label_routes.route('/edit', methods=['PATCH'])
@login_required
@in_project
@not_frozen
def edit_label(*, user):
    # Get args
    args = request.json['params']
    # Required args
    required = ('labelId', 'labelName', 'labelDescription', 'p_id')
    # Checks if arguments were at least provided
    if not check_args(required, args):
        return make_response('Bad Request', 400)
    # Checks if the provided labelId is somewhat valid
    if args['labelId'] < 0:
        return make_response('Bad Request, labelId invalid', 400)
    # Get label from database
    try:
        label = db.session.get(Label, args['labelId'])
    except OperationalError:
        # Something went wrong
        return make_response('Internal Server Error: Fetching label from database unsuccessful.', 500)
    # Check if the response contained a label
    if not label:
        return make_response('Label does not exist', 400)
    # Check if the label is part of the project
    if label.p_id != args["p_id"]:
        return make_response('Label not part of project', 400)
    
    # Records a change in the description, only if the description has actually changed
    if label.description != args['labelDescription']:
        __record_description_edit(label.id, args['labelName'], args['p_id'], user.id)
    
    # Check if the label name is unique
    if label_name_taken(args["labelName"], 0):
        return make_response("Label name already exists", 400)

    # Records a change in the name, only if the name has actually changed
    if label.name != args['labelName']:
        __record_name_edit(label.id, label.name, args['p_id'], user.id, args['labelName'])

    db.session.execute(
        update(Label)
        .where(Label.id == args['labelId']).values(name=args['labelName'], description=args['labelDescription'])
    )
    
    try:
        db.session.commit()
    except OperationalError:

        return make_response('Internal Server Error: Commit to database unsuccessful', 500)

    return make_response()

# Author: Bartjan, Victoria
# Check whether the pID exists
@label_routes.route('/allLabels', methods=['GET'])
@login_required
@in_project
def get_all_labels():
    # Get args from request
    args = request.args
    # What args are required
    required = ['p_id']

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    # Get all the labels of a labelType
    labels = db.session.scalars(
        select(Label)
        .where(Label.p_id == args['p_id'], 
               Label.deleted != 1)
    ).all()

    # Initialise label schema
    label_schema = LabelSchema()

    # Send the label object, and the name of its type for each label
    label_data = jsonify([{
        'label': label_schema.dump(label),
        'label_type': label.label_type.name
    } for label in labels])

    return make_response(label_data)


# Author: Bartjan
@label_routes.route('/singleLabel', methods=['GET'])
@login_required
@in_project
def get_single_label():
    # Get args from request
    args = request.args
    # What args are required
    required = ['p_id', 'label_id']

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    # Get label
    label = db.session.get(Label, args['label_id'])

    if not label:
        return make_response('Label does not exist', 400)

    # Initialise label schema
    label_schema = LabelSchema()
    # Initialise theme schema
    theme_schema = ThemeSchema()
    
    # Create a dictionary with label, label type and themes
    dict_json = jsonify({
        'label': label_schema.dump(label),
        'label_type': label.label_type.name,
        'themes': theme_schema.dump(label.themes, many=True)
    })

    return make_response(dict_json)

# Author: Eduardo
# Merge labels
@label_routes.route('/merge', methods=['POST'])
@login_required
@in_project
@not_frozen
def merge_route(*, user):

    args = request.json['params']
    # Required parameters
    required = ('mergedLabels', 'newLabelName', 'newLabelDescription', 'p_id', 'labelTypeName')

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    # Check for invalid characters
    if check_whitespaces(args):
        return make_response("Input contains leading or trailing whitespaces", 400)
    
    # Check for invalid characters
    if check_string([args['newLabelName'], args['newLabelDescription']]):
        return make_response("Input contains a forbidden character", 511)

    # Check whether the length of the label name is at least one character long
    if args['newLabelName'] is None or len(args['newLabelName']) <= 0:
        return make_response('Label name cannot be empty')
    # Check whether the length of label description is at least one character long
    if args['newLabelDescription'] is None or len(args['newLabelDescription']) <= 0:
        return make_response('Bad request: Label description cannot be empty', 400)
    
    # Check that labels have different ids (set construction keeps only unique ids)
    label_ids = args['mergedLabels']
    if len(label_ids) != len(set(label_ids)):
        return make_response('Bad request: Label ids must be unique', 400)

    # Labels being merged
    labels = db.session.scalars(
        select(
            Label
        ).where(
            Label.id.in_(label_ids)
        )
    ).all()
    
    # Check that the labels exist
    if len(labels) != len(label_ids):
        return make_response('Bad request: One or more labels do not exist', 400)

    for label in labels:
        # Check labels are in the same project (the one selected)
        if label.p_id != args['p_id']:
            return make_response('Bad request: Labels must be in the same project', 400)
        # Check labels are of the same type
        if label.lt_id != labels[0].lt_id:
            return make_response('Bad request: Labels must be of the same type', 400)        
    
    # Create new label
    new_label = Label(
        name=args['newLabelName'], 
        description=args['newLabelDescription'],
        lt_id=labels[0].lt_id,
        p_id=args['p_id']
    )

    db.session.add(new_label)
    db.session.flush()

    # Artifact ids and label ids that are being affected
    artifact_changes_ids = select(
        Labelling.a_id,
        Labelling.l_id
    ).where(
        Labelling.l_id.in_(label_ids)
    ).distinct().subquery()

    # Replace label ids with label name
    artifact_changes = db.session.execute(
        select(
            artifact_changes_ids.c.a_id,
            Label.name
        ).where(
            artifact_changes_ids.c.l_id == Label.id
        )
    ).all()

    # Theme ids and label ids that were affected because they had a label assigned to them
    theme_changes_ids = select(
        label_to_theme.c.t_id,
        label_to_theme.c.l_id
    ).where(
        label_to_theme.c.l_id.in_(label_ids)
    ).subquery()

    # Replace label id with name and also get theme name
    theme_changes = db.session.execute(
        select(
            Theme.name,
            Theme.id,
            Label.name
        ).where(
            Theme.id == theme_changes_ids.c.t_id,
            Label.id == theme_changes_ids.c.l_id
        )
    ).all()

    __record_merge(new_label, labels, args['p_id'], user.id, args['labelTypeName'], artifact_changes, theme_changes)

    # Update all labellings
    db.session.execute(
        update(Labelling)
        .where(Labelling.l_id.in_(label_ids)).values(l_id=new_label.id)
    )

    # Update all the themes
    # First insert new label
    db.session.execute(
        insert(label_to_theme).from_select(
            # The columns we are inserting
            ['t_id', 'l_id', 'p_id'], 
            # The selection we insert
            select(
                # The theme ids being affected
                theme_changes_ids.c.t_id,
                # The new label id
                new_label.id, 
                # The project id
                args['p_id']
            ) # Distinct in case some themes contain multiple of the labels being merged
            .distinct()
        )
    )
    # Then delete all instances of this label being used in themes
    db.session.execute(
        delete(label_to_theme)
        .where(label_to_theme.c.l_id.in_(label_ids))
    )

    try:
        db.session.commit()
        return make_response('Success')
    except OperationalError:
        return make_response('Internal Server Error: Commit to database unsuccesful', 500)

# Author: Veerle Furst
# Function for getting the information (label, label_type, and artifacts) of a label
# @param label
# @param u_id - user id
# @param admin 
def get_label_info(label, u_id, admin):
    # Schemas
    label_schema = LabelSchema()
    artifact_schema = ArtifactSchema()
    # Info of the label
    info = {
        "label": label_schema.dump(label),
        "label_type": label.label_type.name,
        "artifacts": artifact_schema.dump(get_label_artifacts(label, u_id, admin), many=True)
    }
    return info

# Author: B. Henkemans
# Only gets the artifacts that the user with a given id can see
# @param label
# @param u_id - user id
# @param admin 
def get_label_artifacts(label, u_id, admin):
    if admin:
        return label.artifacts
    # Else get the artifacts they may see
    return db.session.execute(
        select(Artifact)
        .where(Artifact.id == Labelling.a_id, Labelling.u_id == u_id, Labelling.l_id == label.id)
    )

# Author: B. Henkemans
# Soft delete labels route
@label_routes.route('/delete', methods=['POST'])
@login_required
@in_project
@not_frozen
def soft_delete_route(*, user):
    args = request.json['params']
    # Required args
    required = ['l_id', 'p_id']
    # Check for arguments
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    label = db.session.get(Label, args['l_id'])

    # Check if label exists
    if not label:
        return make_response("Bad request", 400)

    # Check if label is in the same project
    if label.p_id != int(args['p_id']):
        return make_response("Bad request", 400)
    
    try:
        # Update the label and commit
        db.session.execute(
            update(Label)
            .where(Label.id == args['l_id']).values(deleted=1)
        )
        __record_delete(label.id, label.name, label.p_id, user.id)
        db.session.commit()
    except OperationalError:
        return make_response('Internal Server Error: Commit to database unsuccesful', 500)
    return make_response()


# Author: B. Henkemans
# Count how many times the label is used
@label_routes.route('/count_usage', methods=['GET'])
@login_required
@in_project
def count_usage_route():
    args = request.args 
    # Required args
    required = ['p_id', 'l_id']
    # Check Args
    if not check_args(required, args):
        return make_response('Bad Request', 400)
    try:
        # Count the number of labellings
        count = db.session.execute(
            select(func.count(Labelling.l_id))
            .where(
                Labelling.p_id == args['p_id'],
                Labelling.l_id == args['l_id'],
            )
        ).scalar()
        return make_response(str(count), 200)
    except OperationalError:
        return make_response('Internal Server Error', 500)

# Author: Eduardo
# Search labels
@label_routes.route('/search', methods=['GET'])
@login_required
@in_project
def search_route():

    # Get arguments
    args = request.args
    # Required arguments
    required = ('p_id', 'search_words')
    
    # Check if required agruments are supplied
    if not check_args(required, args):
        return make_response('Bad Request', 400)
    
    # Sanity conversion to int (for when checking for equality in sql)
    p_id = int(args['p_id'])

    # Get all the labels and the name of their label type
    # Note that the label type name needs to be supplied for the Label class in the frontend
    labels = db.session.execute(
        select(
            Label,
            LabelType.name
        ).where(
            Label.p_id == p_id,
            Label.lt_id == LabelType.id,
            Label.deleted == False
        )
    ).all()

    # Add the label type name as an attribute to the labels
    # It does feel illegal to set an attribute that does not exist, but that's python for you
    for label, type in labels:
        label.type = type
    
    # Extract just the label object (removing the type name since it's already in the object)
    labels = [label[0] for label in labels]

    # Columns we search through
    search_columns = ['id', 'name', 'description', 'type']

    # Get search results
    results = search_func_all_res(args['search_words'], labels, 'id', search_columns)
    # Take the best results
    clean_results = best_search_results(results, len(args['search_words'].split()))
    # Gets the actual label object from the search
    labels_results = [result['item'] for result in clean_results]
    # Schema for serialising
    label_schema = LabelSchema()
    # Serialise objects and jsonify them
    return make_response(jsonify(label_schema.dump(labels_results, many=True)))

"""
Records a creation of a label in the label changelog
@param l_id: the id of the label created
@param l_name: the name of the label created
@param lt_name: the name of the label type of the label created
@param p_id: the id of the project the new label is in
@param u_id: the id of the user that created the label
"""
def __record_creation(l_id, l_name, lt_name, p_id, u_id):
    # PascalCase because it is a class
    LabelChange = Label.__change__

    change = LabelChange(
        i_id=l_id,
        p_id=p_id,
        u_id=u_id,
        change_type=ChangeType.create,
        name=l_name,
        # Label creation description is encoded with just the label type name
        description=lt_name
    )

    db.session.add(change)

"""
Records the editing of label's name in the label changelog
@param l_id: the id of the label edited
@param old_name: the name of the label before the edit
@param new_name: the name of the label after the edit
@param p_id: the id of the project the label is in
@param u_id: the id of the user that edited the label
"""
def __record_name_edit(l_id, old_name, p_id, u_id, new_name):
    # PascalCase because it is a class
    LabelChange = Label.__change__

    change = LabelChange(
        i_id=l_id,
        p_id=p_id,
        u_id=u_id,
        # Names in change tables refer to the name before the change
        name=old_name,
        # A change description for renaming is encoded with just the new name
        description=new_name,
        change_type=ChangeType.name
    )

    db.session.add(change)

"""
Records the editing of label's name in the label changelog
@param l_id: the id of the label edited
@param old_name: the name of the label before the edit
@param p_id: the id of the project the label is in
@param u_id: the id of the user that edited the label
"""
def __record_description_edit(l_id, old_name, p_id, u_id):
    # PascalCase because it is a class
    LabelChange = Label.__change__

    change = LabelChange(
        i_id=l_id,
        p_id=p_id,
        u_id=u_id,
        name=old_name,
        change_type=ChangeType.description
    )

    db.session.add(change)

"""
Records the merge of a list of labels in the label changelog
@param new_label: the _object_ corresponding to the new label
@param labels: a list of label _objects_ that were merged into the new label
@param p_id: the project id all these labels belong to
@param u_id: the id of the user that made the merge
@param lt_name: the name of the label type of all these labels
@param artifact_changes: a list of tuples describing artifacts that were affected (and how) of the form
    (
        id of an artifact that was labelled with an old label,
        name of the label the artifact was labelled with before the merge
    )
@param theme_changes: a list of tuples describing themes that were changed (and how) of the form
    (
        the name of the theme affected,
        the id of the theme affected,
        name of a merged label that used to belong to the theme
    )
"""
def __record_merge(new_label, labels, p_id, u_id, lt_name, artifact_changes, theme_changes):
    # PascalCase because it is a class
    LabelChange = Label.__change__
    # Extract the names from the labels, and join them into a string separated by commas
    # This is used to encode a merge description
    names = ','.join([label.name for label in labels])

    # Record change for the label
    # We say that it is the new label that was changed (it is a type of creation)
    change = LabelChange(
        i_id=new_label.id,
        p_id=p_id,
        u_id=u_id,
        name=new_label.name,
        change_type=ChangeType.merge,
        # Format the description for a merge encoding
        description=f"{new_label.name} ; {lt_name} ; {names}"
    )
    db.session.add(change)

    # PascalCase because it is a class
    ArtifactChange = Artifact.__change__

    # Record change for the artifacts
    # Each artifact that used to be labelled with a merged label is changed
    changes = [ArtifactChange(
        i_id=a_id,
        p_id=p_id,
        u_id=u_id,
        name=a_id,
        change_type=ChangeType.merge,
        # Format the description for a merge encoding
        description=f"{new_label.name} ; {lt_name} ; {old_label_name}" 
    ) for a_id, old_label_name in artifact_changes]
    db.session.add_all(changes)

    # PascalCase because it is a class
    ThemeChange = Theme.__change__

    # Record change for the themes
    # Each theme that used to have a merged label assigned to it is changed
    changes = [ThemeChange(
        i_id=t_id,
        p_id=p_id,
        u_id=u_id,
        name=t_name,
        change_type=ChangeType.merge,
        # Format the description for a merge encoding
        description=f"{new_label.name} ; {lt_name} ; {old_label_name}" 
    ) for t_name, t_id, old_label_name in theme_changes]
    db.session.add_all(changes)

"""
Records the deletion of a label in the label changelog
Note that since the label can no longer be viewed, its personal history can't be viewed either
This change is still recorded in case the project is extended with a history page over all labels
@param l_id: The id of the label being deleted
@param name: The name of the label being deleted
@param p_id: The project id the label belong(ed/s) to
@param u_id: The id of the user that deleted the label
"""
def __record_delete(l_id, name, p_id, u_id):
    # PascalCase because it is a class
    LabelChange = Label.__change__

    change = LabelChange(
        i_id=l_id,
        p_id=p_id,
        u_id=u_id,
        name=name,
        change_type=ChangeType.deleted
    )
    db.session.add(change)

"""
Function that checks if a label name is already taken
@params name: string, the name to be checked
@returns true if name is already a label name and false otherwise
@author Linh, Jarl
"""
def label_name_taken(name, t_id):
    if bool(db.session.scalars(
        select(Label)
        .where(
            Label.name==name,
            Label.id!=t_id
        ))
        .first()):
        return True
    return False