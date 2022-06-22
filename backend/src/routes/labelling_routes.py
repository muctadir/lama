from src.app_util import check_args
from src import db # need this in every route
from flask import make_response, request, Blueprint, jsonify
from sqlalchemy import select
from sqlalchemy.exc import OperationalError, MultipleResultsFound
from sqlalchemy.orm import aliased
from src.app_util import login_required, in_project, time_from_seconds
from src.models.item_models import Label, LabelType, Labelling, Artifact
from src.models.change_models import ChangeType
from src.models.auth_models import User

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
Author: Linh Nguyen, Ana-Maria Olteniceanu, Eduardo Costa Martins
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

    # Check if required args are present
    if not check_args(required, args):
        return make_response('Bad Request', 400)

    # Checking if user is allowed to edit this labelling
    if not membership.admin and len(args['labellings']) != 1:
        return make_response('This member is not admin', 401)

    # List to hold all changes made
    changes = []

    # Note: I could not find a bulk update which worked on ORM models, which is why we use dictionaries
    updated_labellings = [
        {
            'u_id' : labelling['u_id'],
            'a_id' : args['a_id'],
            'lt_id' : labelling['lt_id'],
            'l_id' : labelling['id']
        } for lt in args['labellings'].values() for labelling in lt.values()
    ]
    
    # Go through the updates an see which one was actually changed
    # Note: I tried my best to do this in one query, however I could not find a way to treat updated_labellings as a subquery
    for labelling in updated_labellings:
        # We need an alias since we join on Label twice (to get the old name, and the new name)
        label_alias = aliased(Label)

        try:
            # Try getting the change status
            change = db.session.execute(select(
                # Label type name
                LabelType.name,
                # Old label name
                Label.name,
                # New label name
                label_alias.name,
                # The name of the user that made the labelling
                User.username
            ).where(
                # These 3 are to get the original labelling
                Labelling.lt_id == labelling['lt_id'],
                Labelling.u_id == labelling['u_id'],
                Labelling.a_id == args['a_id'],
                # Joining for the old label
                label_alias.id == labelling['l_id'],
                # Joining for the new label
                Label.id == Labelling.l_id,
                # Where the labels are different
                label_alias.id != Label.id,
                # Joining for the label type (the same for both labels, so we could choose label_alias instead of Label)
                LabelType.id == Label.lt_id,
                # Joining for the user that made the original labelling
                User.id == Labelling.u_id
            )).one_or_none()

            # If the label was changed
            if change:
                changes.append(change)

        # Honestly I don't see how this exception will ever happen since each label has only one label type
        # and we are only joining on two elements (grouped into one)
        except MultipleResultsFound:
            return make_response('Not Acceptable', 506)

    # Updating the information in the database
    db.session.bulk_update_mappings(Labelling, updated_labellings)

    # Record the changes in the changelog
    __record_labelling_edits(args['p_id'], user.id, args['a_id'], changes)
    

    # Committing the information to the backend
    try: 
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

"""
Records the changing of potentially several labellings in the artifact changelog
@param p_id: the id of the project of the labelling
@param u_id: the id of the user that labelled the artifact
@param a_id: the id of the artifact that was labelled
@param edits: a list of tuples of the form
(
    label type name,
    old label name,
    new label name,
    username of user that made the original labelling
) for each edit made
"""
def __record_labelling_edits(p_id, u_id, a_id, edits):
    # PascalCase because it is a class
    ArtifactChange = Artifact.__change__

    changes = [ArtifactChange(
        p_id=p_id,
        i_id=a_id,
        u_id=u_id,
        name=a_id,
        change_type=ChangeType.labelled,
        # Encoding a change description, designating how it was labelled, and with what
        description=f"edit ; {edit[0]} ; {edit[1]} ; {edit[2]} ; {edit[3]}"
    ) for edit in edits]

    db.session.add_all(changes)