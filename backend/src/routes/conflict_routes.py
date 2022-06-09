# Ana-Maria Olteniceanu

from flask import jsonify, Blueprint, make_response, request
from sqlalchemy import select, func, distinct
from src.models.item_models import Labelling
from src.models import db

conflict_routes = Blueprint("conflict", __name__, url_prefix="/conflict")

"""
Author: Eduardo Costa Martins
Returns the number of conflicts in a project
@params p_id: int, id of the project
@returns the number of conflicts in project with id p_id
"""
def nr_project_conflicts(p_id):
    # Number of differing labels per label type and artifact
    per_label_type = select(
        # Artifact id
        Labelling.a_id,
        # Label type id (can get rid of this maybe?)
        Labelling.lt_id,
        # Distinct labels for a label type (renamed to 'label_count')
        func.count(distinct(Labelling.l_id)).label('label_count')
    # In the given project
    ).where(
        Labelling.p_id == p_id
    # Grouped by artifacts and by label type
    ).group_by(
        Labelling.a_id,
        Labelling.lt_id
    ).subquery()

    # Number of conflicts per artifact
    per_artifact = select(
        # Artifact id
        per_label_type.c.a_id,
        # Number of conflicts (replace count with a_id?)
        func.count(per_label_type.c.lt_id).label('conflict_count')
    ).where(
        # Counts as a conflict if there is more than one distinct label for a label type
        per_label_type.c.label_count > 1
    ).group_by(
        # Grouped by artifact
        per_label_type.c.a_id
    ).subquery()

    # Sum conflicts across all artifacts
    per_project = select(
        func.sum(per_artifact.c.conflict_count)
    )

    result = db.session.scalar(per_project)

    if not result:
        result = 0

    return result

"""
Author: Eduardo Costa Martins
@returns a dictionary indexed by user id mapping to the number of conflicts 
         the user has in the project given by p_id. A user with 0 conflicts
         is not indexed.
"""
def nr_user_conflicts(p_id):

    # Number of differing labels per label type and artifact
    per_label_type = select(
        Labelling.a_id, # Artifact id
        Labelling.lt_id, # Label type id (can get rid of this maybe?)
        func.count(distinct(Labelling.l_id)).label('label_count') # Distinct labels for a label type (renamed to 'label_count')
    ).where(
        Labelling.p_id == p_id
    ).group_by(
        Labelling.a_id, # Grouped by artifacts and
        Labelling.lt_id # by label type
    ).subquery()

    # Number of conflicts per artifact
    per_artifact = select(
        per_label_type.c.a_id, # Artifact id
        func.count(per_label_type.c.lt_id).label('conflict_count') # Number of conflicts (replace count with a_id?)
    ).where(
        per_label_type.c.label_count > 1 # Counts as a conflict if there is more than one distinct label for a label type
    ).group_by(
        per_label_type.c.a_id # Grouped by artifact
    ).subquery()

    # Pair each user with artifacts they have labelled and the conflicts for that artifact
    per_user_artifact = select(
        Labelling.u_id, Labelling.a_id, per_artifact.c.conflict_count.label('conflict_count')
    ).where(
        Labelling.a_id == per_artifact.c.a_id
    ).group_by(
        Labelling.a_id, Labelling.u_id
    ).subquery()

    # Sum the number of conflicts for each user (which is summing the conflicts for each artifact they have labelled)
    per_user = select(
        per_user_artifact.c.u_id, func.sum(per_user_artifact.c.conflict_count)
    ).group_by(
        per_user_artifact.c.u_id
    )

    results = db.session.execute(per_user).all()

    results = dict(
        (u_id, int(conflicts)) for u_id, conflicts in results
    )

    return results