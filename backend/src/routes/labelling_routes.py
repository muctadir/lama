from src.app_util import check_args
from src import db # need this in every route
from flask import current_app as app
from flask import make_response, request, Blueprint, jsonify
from sqlalchemy import select, update, func
from src.app_util import login_required, in_project
from src.models.item_models import Label, LabelSchema, LabelType, LabelTypeSchema, \
  Labelling, LabellingSchema, Theme, ThemeSchema, Artifact, ArtifactSchema

labelling_routes = Blueprint("labelling", __name__, url_prefix="/labelling")

@labelling_routes.route('/by_label', methods=['GET'])
@login_required
@in_project
def get_labelling_by_label(*, user, membership):

    args = request.args
    required = ['p_id', 'label_id']

    # Check if required args are presentF
    if not check_args(required, args):
        return make_response('Bad Request', 400)
    
    if membership.admin:
        labellings = db.session.execute(
            select(Labelling).where(Labelling.l_id == args['label_id'], 
            Labelling.p_id == args['p_id'])
        ).scalars().all()
    else: 
        labellings = db.session.execute(
            select(Labelling).where(Labelling.l_id == args['label_id'],
             Labelling.p_id == args['p_id'], Labelling.u_id == user.id)
        ).scalars().all()
    
    labelling_data = jsonify([{
        'a_id' : labelling.a_id,
        'remark' : labelling.remark,
        'username' : labelling.user.username
    } for labelling in labellings])

    return make_response(labelling_data)


@labelling_routes.route('/create', methods=['POST'])
@login_required
@in_project
def post_labelling(*, user):
    args = request.json['params']
    required = ['p_id', 'resultArray']
    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)
    
    for labelling in args['resultArray']:
        labelling_ = Labelling(u_id=user.id, 
            a_id=labelling['a_id'], 
            lt_id=labelling['lt_id'], 
            l_id=labelling['l_id'], 
            p_id=args['p_id'], 
            remark=labelling['remark'],
            time=func.current_timestamp()
        )
        try:
            db.session.add(labelling_)
        except:
            return make_response('Internal Server Error: Adding to database unsuccessful', 500)
    
    try:
        db.session.commit()
    except:
        return make_response('Internal Server Error: Commit to database unsuccessful', 500)

    return make_response()