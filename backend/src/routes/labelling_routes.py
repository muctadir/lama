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
from src.models.change_models import ChangeType

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
        labelling_ = Labelling(
            u_id=user.id, 
            a_id=labelling['a_id'], 
            lt_id=labelling['label_type']['id'], 
            l_id=labelling['label']['id'], 
            p_id=args['p_id'], 
            remark=labelling['remark'],
            time=time_from_seconds(labelling['time'])
        )
        # Check if the labelling was added, otherwise throw and error
        try:
            __record_labelling(args['p_id'], user.id, labelling['label_type']['name'], labelling['label']['name'], labelling['a_id'])
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
    # Get args from request 
    args = request.json['params']
    # What args are required
    required = ['p_id', 'a_id', 'labellings']

    # Checking if user is allowed to edit this labelling
    if not membership.admin and len(args['labellings']) != 1:
        return make_response('This member is not admin', 401)

    # Check if required args are presentF
    if not check_args(required, args):
        return make_response('Bad Request', 400)
    
    # Array to hold updated labellings
    updated_labellings = []

    # Get a list of labeltypes in the project
    label_types = db.session.scalars(
        select(LabelType.name).where(LabelType.p_id==args['p_id'])
    ).all()

    # For each label type, go through all labellings given and add them to the list
    for lt in label_types:
        try: 
            updated_labellings.extend([
                {'u_id': args['labellings'][key][lt]['u_id'],'a_id': args['a_id'], 'lt_id': args['labellings'][key][lt]['lt_id'],
                        'l_id': args['labellings'][key][lt]['id']} for key in args['labellings']
        ])
        # In the case of a key error, then there were no labellings provided for a certain label type
        # Thus continue with the rest of the label types
        except KeyError:
            continue

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

"""
Records a labelling in the artifact changelog
@param p_id: the id of the project of the labelling
@param u_id: the id of the user that labelled the artifact
@param lt_name: the name of the label type corresponding to this labelling
@param l_name: the name of the label used to label the artifact
@param a_id: the id of the artifact that was labelled
"""
def __record_labelling(p_id, u_id, lt_name, l_name, a_id):
    # PascalCase because it is a class
    ArtifactChange = Artifact.__change__

    change = ArtifactChange(
        p_id=p_id,
        i_id=a_id,
        u_id=u_id,
        name=a_id,
        change_type=ChangeType.labelled,
        # Encoding a change description, designating how it was labelled, and with what
        description=f"label ; {lt_name} ; {l_name}"
    )

    db.session.add(change)