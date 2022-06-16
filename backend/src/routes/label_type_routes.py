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

# Author: B. Henkemans
# Gets label types
@label_type_routes.route('/all', methods=['GET'])
@login_required
@in_project
def get_label_types(): 
    # Get args from request
    args = request.args
    # What args are required
    required = ['p_id']

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)
    
    # Get all the labels of a labelType
    label_types = db.session.execute(
            select(LabelType)
            .where(LabelType.p_id==args['p_id'])
        ).scalars().all()
    
    # Initialise label type schema
    label_type_schema = LabelTypeSchema()
    # Jsonify label type schema
    label_type_json = jsonify(label_type_schema.dump(label_types, many=True))

    return make_response(label_type_json)

# Author: B. Henkemans
# Gets label types with labels
@label_type_routes.route('/allWithLabels', methods=['GET'])
@login_required
@in_project
def get_label_types_wl(): 
    # Get args from request
    args = request.args
    # What args are required
    required = ['p_id']

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)
    
    # Get all the labels of a labelType
    labelTypes = db.session.scalars(
        select(LabelType)
        .where(
            LabelType.p_id == args['p_id']
        )
    ).all()

    # Initialise label type schema
    label_type_schema = LabelTypeSchema()
    # Initialise label schema
    label_schema = LabelSchema()
    
    # Create dictionary with label type and labels
    dict_json = jsonify([{
        'label_type': label_type_schema.dump(labelType), 
        'labels': label_schema.dump((labelType.labels).filter_by(deleted=0), many = True)
    } for labelType in labelTypes])
    
    return make_response(dict_json)

# Author: Eduardo Costa Martins
# Get labels by label type
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
    
    # Initialise label schema
    label_schema = LabelSchema()
    # Initialise label type schema
    label_type_schema = LabelTypeSchema()

    # Group results
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
    # Get labels by label type
    stmt = select(
        LabelType, Label
    ).where(
        Label.lt_id == LabelType.id,
        LabelType.p_id == p_id
    )
    # Get the results
    results = db.session.execute(stmt).all()

    # Group the results
    grouped_results = defaultdict(list)
    for k, v in results:
        grouped_results[k].append(v)

    return grouped_results
