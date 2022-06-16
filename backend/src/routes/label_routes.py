# Author: Eduardo
# Author: Bartjan
# Author: Victoria
from src.app_util import check_args
from src import db # need this in every route
from flask import make_response, request, Blueprint, jsonify
from sqlalchemy import select, update, distinct
from sqlalchemy.exc import OperationalError
from src.app_util import login_required, in_project
from src.models.change_models import ChangeType
from src.models.item_models import Label, LabelSchema, LabelType, \
  Labelling, ThemeSchema, Artifact, ArtifactSchema

label_routes = Blueprint("label", __name__, url_prefix="/label")

# Author: Eduardo
@label_routes.route('/create', methods=['POST'])
@login_required
@in_project
def create_label(*, user):

    args = request.json

    required = ['labelTypeId', 'labelName', 'labelDescription', 'labelTypeName', 'p_id']

    # Check whether the required arguments are delivered
    if not check_args(required, args):
        print(args)
        return make_response('Bad Request', 400)
    # Check whether the length of the label name is at least one character long
    if len(args['labelName']) <= 0:
        return make_response('Bad request: Label name cannot have size <= 0', 400)
    # Check whether the length of label description is at least one character long
    if len(args['labelDescription']) <= 0:
        return make_response('Bad request: Label description cannot have size <= 0', 400)
    # # Check whether the label type exists
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
        db.session.flush()
        __record_creation(label.id, label.name, args['labelTypeName'], args['p_id'], user.id)
        db.session.commit() 
    except OperationalError:
        return make_response('Internal Server Error: Commit to database unsuccessful', 500)

    return make_response('Created')

# Author: Bartjan, Victoria
@label_routes.route('/edit', methods=['PATCH'])
@login_required
@in_project
def edit_label(*, user):
    # Get args 
    args = request.json
    # Required args
    required = ('labelId', 'labelName', 'labelDescription', 'p_id')

    if not check_args(required, args):
        return make_response('Bad Request', 400)

    label = db.session.get(Label, args['labelId'])
    if not label:
        return make_response('Label does not exist', 400)

    if label.p_id != args["p_id"]:
        return make_response('Label not part of project', 400)
    
    if label.name != args['name']:
        __record_name_edit(label.id, label.name, args['p_id'], label.id, args['name'])
    
    if label.description != args['description']:
        __record_description_edit(label.id, args['name'], args['p_id'], user.id)

    db.session.execute(
        update(Label)
        .where(Label.id == args['labelId']).values(name=args['labelName'], description=args['labelDescription'])
    )
    
    try:
        db.session.commit()
    except OperationalError:
        return make_response('Internal Server Error: Commit to database unsuccessful', 500)

    return make_response('Ok')

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
    labels = db.session.execute(
            select(Label)
            .where(Label.p_id==args['p_id'])
        ).scalars().all()

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


    label_schema = LabelSchema()
    theme_schema = ThemeSchema()

    dict_json = jsonify({
        'label': label_schema.dump(label),
        'label_type': label.label_type.name,
        'themes': theme_schema.dump(label.themes, many=True)
    })

    return make_response(dict_json)

# Author: Eduardo
@label_routes.route('/merge', methods=['POST'])
@login_required
@in_project
def merge_route(*, user):
    args = request.json
    required = ('mergedLabels', 'newLabelName', 'newLabelDescription', 'p_id', 'labelTypeName')

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    # Check whether the length of the label name is at least one character long
    if len(args['newLabelName']) <= 0:
        return make_response('Bad request: Label name cannot have size <= 0', 400)
    # Check whether the length of label description is at least one character long
    if len(args['newLabelDescription']) <= 0:
        return make_response('Bad request: Label description cannot have size <= 0', 400)
    
    # Check that labels have different ids (set construction keeps only unique ids)
    label_ids = [label['id'] for label in args['mergedLabels']]
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

    # Artifact ids and label ids that are being affected
    artifact_changes_ids = select(
        Labelling.a_id,
        distinct(Labelling.l_id)
    ).where(
        Labelling.l_id.in_(label_ids)
    ).group_by(
        Labelling.a_id
    ).subquery()

    # Replace label ids with label name
    artifact_changes = db.session.execute(
        select(
            artifact_changes_ids.a_id,
            Label.name
        ).where(
            artifact_changes_ids.l_id == Label.id
        )
    ).all()

    __record_merge(new_label, labels, args['p_id'], user.id, args['labelTypeName'], artifact_changes)

    # Update all labellings
    db.session.execute(
        update(Labelling)
        .where(Labelling.l_id.in_(label_ids)).values(l_id=new_label.id)
    )
    try:
        db.session.commit()
    except OperationalError:
        return make_response('Internal Server Error: Commit to database unsuccessful', 500)

# Author: Veerle Furst
# Function for getting the information (label, label_type, and artifacts) of a label
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

# Author: Veerle Furst
# Only gets the artifacts that the user with a given id can see
def get_label_artifacts(label, u_id, admin):
    if admin:
        return label.artifacts
    # Else get the artifacts they may see
    return db.session.execute(
        select(Artifact)
        .where(Artifact.id == Labelling.a_id, Labelling.u_id == u_id, Labelling.l_id == label.id)
    )

def __record_creation(l_id, l_name, lt_name, p_id, u_id):
    # PascalCase because it is a class
    LabelChange = Label.__change__

    change = LabelChange(
        i_id=l_id,
        p_id=p_id,
        u_id=u_id,
        change_type=ChangeType.create,
        name=l_name,
        description=lt_name
    )

    db.session.add(change)

def __record_name_edit(l_id, old_name, p_id, u_id, new_name):
    # PascalCase because it is a class
    LabelChange = Label.__change__

    change = LabelChange(
        i_id=l_id,
        p_id=p_id,
        u_id=u_id,
        name=old_name,
        description=new_name,
        change_type=ChangeType.name
    )

    db.session.add(change)

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

def __record_merge(new_label, labels, p_id, u_id, lt_name, artifact_changes):
    # PascalCase because it is a class
    LabelChange = Label.__change__
    names = ','.join([label.name for label in labels])

    # Record change for the label
    change = LabelChange(
        i_id=new_label.id,
        p_id=p_id,
        u_id=u_id,
        name=new_label.name,
        change_type=ChangeType.merge,
        description=f"{new_label.name} ; {lt_name} ; {names}"
    )
    db.session.add(change)

    # PascalCase because it is a class
    ArtifactChange = Artifact.__change__

    # Record change for the artifacts
    changes = [ArtifactChange(
        i_id=artifact.id,
        p_id=p_id,
        u_id=u_id,
        name=artifact.name,
        change_type=ChangeType.merge,
        description=f"{new_label.name} ; {lt_name} ; {old_label_name}" 
    ) for artifact, old_label_name in artifact_changes]
    db.session.add_all(changes)