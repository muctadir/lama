# Author: Eduardo
# Author: Bartjan
from src.app_util import check_args
from src import db # need this in every route
from flask import current_app as app
from flask import make_response, request, Blueprint, jsonify
from sqlalchemy import select, update
from src.app_util import login_required
from src.models.item_models import Label, LabelSchema, LabelType, LabelTypeSchema

# Merge labels

label_routes = Blueprint("label", __name__, url_prefix="/label")

# Author: Eduardo
@label_routes.route('/create', methods=['POST'])
@login_required
def create_label(*, user):

    args = request.json
    print(args)
    required = ['labelTypeId', 'labelName', 'labelDescription', 'p_id']

    # Check whether the required arguments are delivered
    if not check_args(required, args):
        return make_response('Bad Request', 400)
    # Check whether the length of the label name is at least one character long
    if len(args['labelName']) <= 0:
        return make_response('Bad request: Label name cannot have size <= 0')
    # Check whether the length of label description is at least one character long
    if len(args['labelDescription']) <= 0:
        return make_response('Bad request: Label description cannot have size <= 0')
    # # Check whether the label type exists
    # if (db.session.get(LabelType, args['labelTypeId']).count()) <= 0:
    #     return make_response('Label type does not exist', 400)

    # # Check whether the label is part of the project
    # if label_type.p_id != args['pId']:
    #     return make_response('Label type not in this project', 400)
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

    args = request.json
    required = ('labelId', 'labelTypeId', 'labelName', 'labelDescription', 'pId')

    if not check_args(required, args):
        return make_response('Bad Request', 400)

    label = db.session.get(Label, args['labelId'])
    newLabel = label
    if not label:
        return make_response('Label does not exist', 400)

    if label.p_id != args["pId"]:
        return make_response('Label not part of project', 400)

    if not args['labelTypeId'] != "":
        newLabel.lt_id = args['labelTypeId']

    if not len(args['labelName']) <= 0:
        newLabel.name = args['labelName']

    if not len(args['labelDescription']) <= 0:
        newLabel.description = args['labelDescription']

    if newLabel == label:
        # Returns if the label is not modified
        return make_response('Not Modified', 204)

    db.session.update(label)
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
    label = db.session.execute(
            select(Label).where(Label.id==args['label_id'])).scalars().first()
    
    if not label:
        return make_response('Label does not exist', 400)


    label_schema = LabelSchema()

    dict_json = jsonify({
        'label': label_schema.dump(label),
        'label_type': label.label_type.name
    })

    return make_response(dict_json)
