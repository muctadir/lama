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

@label_routes.route('/create', methods=['POST'])
@login_required
def create_label(*, user):

    args = request.json

    required = ('labelTypeId', 'labelName', 'labelDescription', 'pId')

    if not check_args(required, args):
        return make_response('Bad Request', 400)

    # TODO: Check formatting

    label_type = db.session.get(LabelType, args['labelTypeId'])

    if not label_type:
        return make_response('Label type does not exist', 400)
    
    if label_type.p_id != args['pId']:
        return make_response('Label type not in this project', 400)

    label = Label(name=args['labelName'],
        description=args['labelDescription'],
        lt_id=args['lt_id'])
    
    db.session.add(label)
    db.session.commit()

    # label_schema = LabelSchema()
    # label_json = jsonify(label_schema.dump(labels, many=True))

    return make_response('Created')