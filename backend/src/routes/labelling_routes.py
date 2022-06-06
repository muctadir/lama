from src.app_util import check_args
from src import db # need this in every route
from flask import current_app as app
from flask import make_response, request, Blueprint, jsonify
from sqlalchemy import select, update
from src.app_util import login_required, in_project
from src.models.item_models import Label, LabelSchema, LabelType, LabelTypeSchema, \
  Labelling, LabellingSchema, Theme, ThemeSchema, Artifact, ArtifactSchema

labelling_routes = Blueprint("labelling", __name__, url_prefix="/labelling")

@labelling_routes.route('/by_label', methods=['GET'])
@login_required
@in_project
def get_labelling(*, user):

    args = request.args
    required = ['p_id', 'label_id']

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)
    
    labellings = db.session.execute(
        select(Labelling).where(Labelling.l_id == args['label_id'], Labelling.p_id == args['p_id'], Labelling.u_id == user.id)
    ).scalars().all()
    
    labelling_data = jsonify([{
        'a_id' : labelling.a_id,
        'remark' : labelling.remark,
        'username' : labelling.user.username
    } for labelling in labellings])

    return make_response(labelling_data)