# Author: Victoria
# Author: Bartjan
from src.app_util import check_args
from src import db # need this in every route
from flask import current_app as app
from flask import make_response, request, Blueprint, jsonify
from sqlalchemy import select, update
from src.app_util import login_required
from src.models.item_models import Label, LabelSchema, LabelType, LabelTypeSchema

label_type_routes = Blueprint("labeltype", __name__, url_prefix="/labeltype")

@label_type_routes.route('/getAll', methods=['GET'])
@login_required
def get_label_types(*, user): 
    args = request.args
    required = ['p_id']

    if not check_args(required, args):
        return make_response('Bad Request', 400)
    
    # Get all the labels of a labelType
    labelTypes = db.session.execute(
            select(LabelType).where(LabelType.p_id==args['p_id'])
        ).scalars().all()
        
    label_type_schema = LabelTypeSchema()
    label_type_json = jsonify(label_type_schema.dump(labelTypes, many=True))

    return make_response(label_type_json)