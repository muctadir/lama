# Author: Victoria
# Author: Bartjan
# Author: Eduardo Costa Martins
from src.app_util import check_args
from src import db # need this in every route
from flask import current_app as app
from flask import make_response, request, Blueprint, jsonify
from sqlalchemy import select, update
from src.app_util import login_required, in_project
from src.models.item_models import Label, LabelSchema, LabelType, LabelTypeSchema
from collections import defaultdict

label_type_routes = Blueprint("labeltype", __name__, url_prefix="/labeltype")

@label_type_routes.route('/all', methods=['GET'])
@login_required
@in_project
def get_label_types(): 
    args = request.args
    required = ['p_id']

    if not check_args(required, args):
        return make_response('Bad Request', 400)
    
    # Get all the labels of a labelType
    label_types = db.session.execute(
            select(LabelType).where(LabelType.p_id==args['p_id'])
        ).scalars().all()
        
    label_type_schema = LabelTypeSchema()
    label_type_json = jsonify(label_type_schema.dump(label_types, many=True))

    return make_response(label_type_json)

@label_type_routes.route('/allWithLabels', methods=['GET'])
@login_required
@in_project
def get_label_types_wl(): 
    args = request.args
    required = ['p_id']

    if not check_args(required, args):
        return make_response('Bad Request', 400)
    
    # Get all the labels of a labelType
    labelTypes = db.session.execute(
        select(LabelType)
        .where(
            LabelType.p_id == args['p_id']
        )
    ).scalars().all()

    label_type_schema = LabelTypeSchema()
    label_schema = LabelSchema()
    
    dict_json = jsonify([{
        'label_type': label_type_schema.dump(labelType), 
        'labels': label_schema.dump(labelType.labels, many = True)
    } for labelType in labelTypes])
    
    return make_response(dict_json)

# Author: Eduardo Costa Martins
@label_type_routes.route("/labelsByType", methods=["GET"])
@login_required
@in_project
def get_labels_by_label_type():
    # Get args from request 
    args = request.args
    # What args are required
    required = ['p_id']
    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)
    
    label_schema = LabelSchema()
    label_type_schema = LabelTypeSchema()

    grouped_results = labels_by_label_type(args['p_id'])

    # Convert dictionary to a list of pairs
    # Each pair is of a label type and a list of labels belonging to that type
    as_list = [(label_type_schema.dump(k), label_schema.dump(v, many=True)) for k, v in grouped_results.items()]

    return jsonify(as_list)

"""
Author: Eduardo Costa Martins
@params p_id : int|string the project id for which you want the label types and labels
@returns a dictionary indexed by label type _objects_, mapping to a list of labels of that type
"""
def labels_by_label_type(p_id):

    stmt = select(
        LabelType, Label
    ).where(
        Label.lt_id == LabelType.id,
        LabelType.p_id == p_id
    )

    results = db.session.execute(stmt).all()

    grouped_results = defaultdict(list)
    for k, v in results:
        grouped_results[k].append(v)

    return grouped_results