# Author: Eduardo Costa Martins
from src.app_util import check_args
from src.models.auth_models import User
from src import db
from src.models.item_models import Artifact, Theme, Label
from src.models.change_models import ChangeType
from flask import current_app as app
from flask import make_response, request, Blueprint, jsonify
from sqlalchemy import select
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import OperationalError
from src.app_util import login_required, in_project, parse_change

change_routes = Blueprint('change', __name__, url_prefix='/change')

@change_routes.route('/artifactChanges', methods=['GET'])
@login_required
@in_project
def get_artifact_changes(membership):
    
    if not membership.admin:
        make_response('Forbidden', 403)

    args = request.args
    
    required = ('p_id')

    if not check_args(required, args):
        return make_response('Bad Request', 400)

    changes = jsonify(artifact_changes(args['p_id']))

    return make_response(changes)

def artifact_changes(p_id):
    # PascalCase because this is a class
    ArtifactChange = Artifact.__change__

    changes = db.session.execute(select(
        ArtifactChange,
        User.username
    ).where(
        User.id == ArtifactChange.u_id,
        ArtifactChange.p_id == p_id,
    ).order_by(
        ArtifactChange.timestamp.desc()
    )).all()

    processed_changes = [{
        'a_id': change[0].i_id,
        'timestamp': change[0].timestamp.strftime("%Y/%m/%d, %H:%M:%S"),
        'username': change[1],
        'description': parse_change(change[0], change[1])
    } for change in changes]

    return processed_changes