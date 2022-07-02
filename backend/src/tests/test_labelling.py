# Author: B Henkemans
from urllib import request
from sqlalchemy import select
from src.models.item_models import Label
from src import db
from src.conftest import RequestHandler

# Test whether the information received is the correct information.


def test_get_labellings_by_label(app, client):
    with app.app_context():
        # Request unauthenticated - non existent user
        request_handler_unauthenticated = RequestHandler(app, client, '')
        response = request_handler_unauthenticated.get(
            '/labelling/by_label', {'p_id': 1, 'label_id': 1}, True)
        assert response.status_code == 401
        assert response.text == "User does not exist"

        # Request unauthenticated - user not part of project
        request_handler_unauthenticated = RequestHandler(app, client, 7)
        response = request_handler_unauthenticated.get(
            '/labelling/by_label', {'p_id': 2, 'label_id': 1}, True)
        assert response.status_code == 401
        assert response.text == "Unauthorized"

        # Set up request handler for User 1
        request_handler = RequestHandler(app, client, 2)

        # Regular user get all without argument, missing p_id
        response = request_handler.get('/labelling/by_label', {}, True)
        assert response.status_code == 400
        # assert response.text == "Bad Request, missing p_id"

        # Regular user get all without argument
        response = request_handler.get(
            '/labelling/by_label', {'p_id': 1}, True)
        assert response.status_code == 400

        # Regular user get all
        response = request_handler.get(
            '/labelling/by_label', {'p_id': 2, 'label_id': 1}, True)
        assert response.status_code == 200

        # Admin get all
        request_handler_admin = RequestHandler(app, client, 1)
        response = request_handler_admin.get(
            '/labelling/by_label', {'p_id': 2, 'label_id': 1}, True)
        assert response.status_code == 200


def test_labelling(app, client):
    with app.app_context():
        assert True

def create_labelling_helper():
    assert True
