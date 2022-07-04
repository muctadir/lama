# Author: B Henkemans
from urllib import request
from sqlalchemy import select
from src.models.item_models import Label, LabelType
from src import db
from src.conftest import RequestHandler

# TODO: Check whether the information received matches that of the database
def test_get_all(app, client):
    with app.app_context():
        # Request unauthenticated - non existent user
        request_handler_unauthenticated = RequestHandler(app, client, '')
        response = request_handler_unauthenticated.get(
            '/labeltype/all', {'p_id': 1}, True)
        assert response.status_code == 401
        assert response.text == "User does not exist"

        # Request unauthenticated - user not part of project
        request_handler_unauthenticated = RequestHandler(app, client, 7)
        response = request_handler_unauthenticated.get(
            '/labeltype/all', {'p_id': 2}, True)
        assert response.status_code == 401
        assert response.text == "Unauthorized"

        # Set up request handler for User 1
        request_handler = RequestHandler(app, client, 2)

        # Regular user get all without argument
        response = request_handler.get('/labeltype/all', {}, True)
        assert response.status_code == 400
        # assert response.text == "Bad Request, missing p_id"

        # Regular user get all
        response = request_handler.get('/labeltype/all', {'p_id': 1}, True)
        assert response.status_code == 200

        # Admin get all
        request_handler_admin = RequestHandler(app, client, 1)
        response = request_handler_admin.get(
            '/labeltype/all', {'p_id': 1}, True)
        assert response.status_code == 200

# TODO: Check whether the information received matches that of the database
def test_get_all_with_labels(app, client):
    with app.app_context():
        # Request unauthenticated - non existent user
        request_handler_unauthenticated = RequestHandler(app, client, '')
        response = request_handler_unauthenticated.get(
            '/labeltype/allWithLabels', {'p_id': 1}, True)
        assert response.status_code == 401
        assert response.text == "User does not exist"

        # Request unauthenticated - user not part of project
        request_handler_unauthenticated = RequestHandler(app, client, 7)
        response = request_handler_unauthenticated.get(
            '/labeltype/allWithLabels', {'p_id': 2}, True)
        assert response.status_code == 401
        assert response.text == "Unauthorized"

        # Set up request handler for User 1
        request_handler = RequestHandler(app, client, 2)

        # Regular user get all without argument
        response = request_handler.get('/labeltype/allWithLabels', {}, True)
        assert response.status_code == 400

        # Regular user get all
        response = request_handler.get(
            '/labeltype/allWithLabels', {'p_id': 1}, True)
        assert response.status_code == 200

        # Admin get all
        request_handler_admin = RequestHandler(app, client, 1)
        response = request_handler_admin.get(
            '/labeltype/allWithLabels', {'p_id': 1}, True)

# TODO: Check whether the information received matches that of the database
def test_label_by_type(app, client):
    with app.app_context():
        assert True
        # Request unauthenticated - non existent user
        request_handler_unauthenticated = RequestHandler(app, client, '')
        response = request_handler_unauthenticated.get(
            '/labeltype/labelsByType', {'p_id': 1, 'lt_id': 1}, True)
        assert response.status_code == 401
        assert response.text == "User does not exist"

        # Request unauthenticated - user not part of project
        request_handler_unauthenticated = RequestHandler(app, client, 7)
        response = request_handler_unauthenticated.get(
            '/labeltype/labelsByType', {'p_id': 2, 'lt_id': 1}, True)
        assert response.status_code == 401
        assert response.text == "Unauthorized"

        # Set up request handler for User 1
        request_handler = RequestHandler(app, client, 2)

        # Regular user get all without argument, no p_id
        response = request_handler.get('/labeltype/labelsByType', {}, True)
        assert response.status_code == 400

        # Regular user get all without argument, no lt_id
        response = request_handler.get(
            '/labeltype/labelsByType', {'p_id': 1}, True)
        assert response.status_code == 400
        assert response.text == "Bad Request"

        # Regular user get all, not part of project
        response = request_handler.get(
            '/labeltype/labelsByType', {'p_id': 1, 'lt_id': 3}, True)
        assert response.status_code == 400
        assert response.text == 'Label type does not exist in this project'

        # Regular user get all
        response = request_handler.get(
            '/labeltype/labelsByType', {'p_id': 1, 'lt_id': 1}, True)
        assert response.status_code == 200
