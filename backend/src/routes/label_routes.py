# Author: Eduardo
# Author: Bartjan
# Author: Victoria
from src.app_util import check_args
from src import db # need this in every route
from flask import current_app as app
from flask import make_response, request, Blueprint, jsonify
from sqlalchemy import select, update
from src.app_util import login_required, in_project
from src.models.item_models import Label, LabelSchema, LabelType, LabelTypeSchema, \
  Labelling, LabellingSchema, Theme, ThemeSchema, Artifact, ArtifactSchema

label_routes = Blueprint("label", __name__, url_prefix="/label")

# Author: Eduardo
@label_routes.route('/create', methods=['POST'])
@login_required
@in_project
def create_label():

    args = request.json

    required = ['labelTypeId', 'labelName', 'labelDescription', 'p_id']

    # Check whether the required arguments are delivered
    if not check_args(required, args):
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
        db.session.commit() 
    except:
        return make_response('Internal Server Error: Commit to database unsuccesful', 500)

    return make_response('Created')

# Author: Bartjan, Victoria
@label_routes.route('/edit', methods=['PATCH'])
@login_required
@in_project
def edit_label():
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
    
    try:
        db.session.execute(
            update(Label)
            .where(Label.id == args['labelId']).values(name=args['labelName'], description=args['labelDescription'])
        )
        db.session.commit()
    except:
        return make_response('Internal Server Error: Commit to database unsuccesful', 500)

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
def merge_route():
    args = request.json
    required = ['leftLabelId', 'rightLabelId', 'newLabelName', 'newLabelDescription', 'p_id']

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    # Check whether the length of the label name is at least one character long
    if len(args['newLabelName']) <= 0:
        return make_response('Bad request: Label name cannot have size <= 0', 400)
    # Check whether the length of label description is at least one character long
    if len(args['newLabelDescription']) <= 0:
        return make_response('Bad request: Label description cannot have size <= 0', 400)    
    # Check whether the ids are different
    if len(args['leftLabelId'] == args['rightLabelId']) <= 0:
        return make_response('Bad request: Cannot merge the same label twice', 400)

    ids = [args['leftLabelId'], args['rightLabelId']]
    labels = db.session.execute(
            select(Label)
            .where(Label.id.in_(ids))).scalars.all()
    
    # Check that the labels exist
    if len(labels) != 2:
        return make_response('Bad request: One or more labels do not exist', 400)
    # Check labels are in the same project
    if labels[0].p_id != labels[1].p_id:
        return make_response('Bad request: Labels must be in the same project', 400)
    # Check labels are of the same type
    if labels[0].lt_id != labels[1].lt_id:
        return make_response('Bad request: Labels must be of the same type', 400)
    
    # Create new label
    new_label = Label(name=args['newLabelName'], 
            description=args['newLabelDescription'],
            lt_id=labels[0].lt_id,
            p_id=labels[0].p_id)

    try:
        db.session.add(new_label)
        db.session.commit()
    except:
        return make_response('Internal Server Error: Commit to database unsuccesful', 500)

    # Update all labellings
    try:
        db.session.execute(
            update(Labelling)
            .where(Labelling.l_id.in_(ids)).values(l_id=new_label.id))
        db.session.commit()
    except:
        return make_response('Internal Server Error: Commit to database unsuccesful', 500)

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