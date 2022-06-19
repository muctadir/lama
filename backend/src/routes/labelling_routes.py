from cProfile import label
from src.app_util import check_args
from src import db # need this in every route
from flask import current_app as app
from flask import make_response, request, Blueprint, jsonify
from sqlalchemy import select, update, func
from sqlalchemy.exc import OperationalError
from src.app_util import login_required, in_project, time_from_seconds
from src.models.item_models import Label, LabelSchema, LabelType, LabelTypeSchema, \
  Labelling, LabellingSchema, Theme, ThemeSchema, Artifact, ArtifactSchema
from src.models.project_models import Project

labelling_routes = Blueprint("labelling", __name__, url_prefix="/labelling")

"""
Author: B. Henkemans, V. Bogachenkova
@params user
@params membership
@returns all the labellings per label
"""
@labelling_routes.route('/by_label', methods=['GET'])
@login_required
@in_project
def get_labelling_by_label(*, user, membership):
    # Get args from request 
    args = request.args
    # What args are required
    required = ['p_id', 'label_id']

    # Check if required args are presentF
    if not check_args(required, args):
        return make_response('Bad Request', 400)
    
    # If you are an admin get all the labellings,
    # otherwise only get the user's labellings
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

    # Dictionary to store data: artifact id, remark and the username
    labelling_data = jsonify([{
        'a_id' : labelling.a_id,
        'remark' : labelling.remark,
        'username' : labelling.user.username
    } for labelling in labellings])

    return make_response(labelling_data)


"""
Author: B. Henkemans, V. Bogachenkova
@params user
@posts the labelling to the backend
"""
@labelling_routes.route('/create', methods=['POST'])
@login_required
@in_project
def post_labelling(*, user):
    
    args = request.json['params']
    # What args are required
    required = ['p_id', 'resultArray']

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)
    
    # For every labelling, record the required data:
    # artifact id, label type id, label id, project id, remark and time
    for labelling in args['resultArray']:
        labelling_ = Labelling(u_id=user.id, 
            a_id=labelling['a_id'], 
            lt_id=labelling['lt_id'], 
            l_id=labelling['l_id'], 
            p_id=args['p_id'], 
            remark=labelling['remark'],
            time=time_from_seconds(labelling['time'])
        )
        # Check if the labelling was added, otherwise throw and error
        try:
            db.session.add(labelling_)
        except OperationalError:
            return make_response('Internal Server Error: Adding to database unsuccessful', 500)

    # Check if the labelling was commited, otherwise throw and error
    try:
        db.session.commit()
    except OperationalError:
        return make_response('Internal Server Error: Commit to database unsuccessful', 500)
    # Make a response
    return make_response()
    
"""
Author: Linh Nguyen, Ana-Maria Olteniceanu
Editing existing labelling(s)
@params user: current user
@params membership: the membership of the current user
@post: updating the labelling in the database
"""
@labelling_routes.route('/edit', methods=['PATCH'])
@login_required
@in_project
def edit_labelling(*, user, membership):
    
    # TODO: implement this properly
    # if not membership.admin:
    #     return make_response('This member is not admin', 401)
    
    # Get args from request 
    args = request.json['params']
    # What args are required
    required = ['p_id', 'lt_id', 'a_id', 'labellings']

    # Check if required args are presentF
    if not check_args(required, args):
        return make_response('Bad Request', 400)
    
    #Array to hold updated labellings
    updated_labellings = []
    
    #Appending updated information about each labelling to the list above
    for key in args['labellings']:
        print(args['labellings'][key]['id'])
        updated_labellings.append({'u_id': user.id,'a_id': args['a_id'], 'lt_id': args['lt_id'],
                    'l_id': args['labellings'][key]['id']})       

    # Get project with supplied ID
    project = db.session.get(Project, args['p_id'])
    if not project:
        return make_response('Project does not exist', 400)

    # Committing the information to the backend
    try: 
    # Updating the information in the database
    db.session.bulk_update_mappings(Labelling, updated_labellings)
    db.session.commit()
    except OperationalError:
        #Returning an error response
        return make_response('Internal Server Error', 503)

    # Returning a response
    return make_response('Succeeded', 200)