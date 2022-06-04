# Author: Eduardo
# Author: Bartjan
from crypt import methods
from backend.src.app_util import check_args
from src import db # need this in every route
from flask import current_app as app
from flask import make_response, request, Blueprint, jsonify
from sqlalchemy import select, update
from src.app_util import login_required
from src.models.item_models import Label, LabelSchema, LabelType, LabelTypeSchema

# Merge labels
# Get all labels
# Edit label

label_routes = Blueprint("label", __name__, url_prefix="/label")

# Author: Eduardo
@label_routes.route('/create', methods=['POST'])
@login_required
def create_label(*, user):

    args = request.json

    required = ('labelTypeId', 'labelName', 'labelDescription', 'pId')

    # Check whether the required arguments are delivered
    if not check_args(required, args):
        return make_response('Bad Request', 400)
    # Check whether the length of the label name is at least one character long
    if len(args['labelName']) <= 0:
        return make_response('Bad request: Label name cannot have size <= 0')
    # Check whether the length of label description is at least one character long
    if len(args['labelDescription']) <= 0:
        return make_response('Bad request: Label description cannot have size <= 0')
    # Check whether the label type exists
    label_type = db.session.get(LabelType, args['labelTypeId'])
    if not label_type:
        return make_response('Label type does not exist', 400)
    # Check whether the label is part of the project
    if label_type.p_id != args['pId']:
        return make_response('Label type not in this project', 400)
    # Make the label
    label = Label(name=args['labelName'],
        description=args['labelDescription'],
        lt_id=args['lt_id'])
    # Commit the label
    db.session.add(label)
    db.session.commit()

    # label_schema = LabelSchema()
    # label_json = jsonify(label_schema.dump(labels, many=True))

    return make_response('Created')

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