# Author: Eduardo
# Author: Bartjan
from src.app_util import check_args
from src import db # need this in every route
from flask import current_app as app
from flask import make_response, request, Blueprint, jsonify
from sqlalchemy import select, update
<<<<<<< HEAD
from src.app_util import login_required
from src.models.item_models import Label, LabelSchema, LabelType
=======
from src.app_util import login_required, in_project
from src.models.item_models import Label, LabelSchema, LabelType, LabelTypeSchema, Labelling
>>>>>>> c3343efe9d1fb4206a8a0d1c0af6cb4118bf60eb

# Merge labels

label_routes = Blueprint("label", __name__, url_prefix="/label")

# Author: Eduardo
@label_routes.route('/create', methods=['POST'])
@login_required
def create_label(*, user):

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
    db.session.add(label)
    db.session.commit()

    return make_response('Created')

# Author: Bartjan, Victoria
@label_routes.route('/edit', methods=['PATCH'])
@login_required
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

    tmp = update(Label).where(Label.id == args['labelId']).values(name=args['labelName'], description=args['labelDescription'])
    print(tmp)

    db.session.execute(
        update(Label).where(Label.id == args['labelId']).values(name=args['labelName'],
        description=args['labelDescription'])
    )
    db.session.commit()

    return make_response('Ok')

# Author: Bartjan, Victoria
# Check whether the pID exists
@label_routes.route('/getAll', methods=['GET'])
@login_required
def get_all_labels(*, user):
    # Get args from request 
    args = request.args
    # What args are required
    required = ['p_id']

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)
        
    # if len(args['labelName']) <= 0:
    #     return make_response('Bad request: Label name cannot have size <= 0', 400)
    
    # Get all the labels of a labelType
    labels = db.session.execute(
            select(Label).where(Label.p_id==args['p_id'])
        ).scalars().all()

    label_schema = LabelSchema()

    #Make empty array to store our info objects 
    label_info_array = []

    # Go through every label, get the information,
    # append the labeltype 
    for label in labels:
        label_json = label_schema.dump(label)        
        info = {
            'label': label_json,
            'label_type': label.label_type.name
        }
        label_info_array.append(info)
    # JSONify and respond
    dict_json = jsonify(label_info_array)
    return make_response(dict_json)


# Author: Bartjan
@label_routes.route('/get', methods=['GET'])
@login_required
def get_single_label(*, user):
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

    dict_json = jsonify({
        'label': label_schema.dump(label),
        'label_type': label.label_type.name
    })

    return make_response(dict_json)

# Author: Eduardo
@label_routes.route('/merge', methods=['POST'])
@login_required
def merge(*, user):
    # TODO: Check user in project
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
            select(Label).where(Label.id.in_(ids))).scalars.all()
    
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
    db.session.add(new_label)
    db.session.commit()

    # Update all labellings
    db.session.execute(
        update(Labelling).where(Labelling.l_id.in_(ids)).values(l_id=new_label.id))
    db.session.commit()