# Author: B Henkemans
from urllib import request
from sqlalchemy import select
from src.models.item_models import Label, Labelling
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
        request_handler2 = RequestHandler(app, client, 3)

        # Regular user get all without argument, missing p_id
        response = request_handler.get('/labelling/by_label', {}, True)
        assert response.status_code == 400

        # Regular user get all without argument
        response = request_handler.get(
            '/labelling/by_label', {'p_id': 3}, True)
        assert response.status_code == 400

        # Regular user get all
        response = request_handler2.get(
            '/labelling/by_label', {'p_id': 2, 'label_id': 1}, True)
        assert response.status_code == 200

        # Admin get all
        request_handler_admin = RequestHandler(app, client, 1)
        response = request_handler_admin.get(
            '/labelling/by_label', {'p_id': 2, 'label_id': 1}, True)
        assert response.status_code == 200

def test_labelling(app, client):
    with app.app_context():
        # Request unauthenticated - non existent user
        request_handler_unauthenticated = RequestHandler(app, client, '')
        response = request_handler_unauthenticated.post(
            '/labelling/create', {'p_id': 1, 'resultArray': []}, True)
        assert response.status_code == 401
        assert response.text == "User does not exist"

        # Request unauthenticated - user not part of project
        request_handler_unauthenticated = RequestHandler(app, client, 7)
        response = request_handler_unauthenticated.post(
            '/labelling/create', {'p_id': 2, 'resultArray': []}, True)
        assert response.status_code == 401
        assert response.text == "Unauthorized"

        # Request authenticate
        request_handler = RequestHandler(app, client, 2)

        # Request missing parameter, p_id
        response = request_handler.post(
            '/labelling/create', {}, True)
        assert response.status_code == 400

        # Request missing
        response = request_handler.post(
            '/labelling/create', {'p_id': 1}, True)
        assert response.status_code == 400
        assert response.text == "Bad Request"


        # Request regular labelling  
        requestArray = {
            'a_id': 176,
            'label_type': {'id':  2, 'name': ""},
            'label': {'id' : 1, 'name': ""},
            'remark': "This is a correct emotion", 
            'time': 0
        }

        response = request_handler.post(
            '/labelling/create', {'p_id': 1, 'resultArray':  [requestArray]}, True)
        assert response.status_code == 201

        # Request regular labelling - duplicate 
        requestArray = {
            'a_id': 1,
            'label_type': {'id':  2, 'name': ""},
            'label': {'id' : 1, 'name': ""},
            'remark': "This is an emotion", 
            'time': 0
        }

        response = request_handler.post(
            '/labelling/create', {'p_id': 1, 'resultArray':  [requestArray]}, True)

        assert response.status_code == 500

def test_edit(app, client):
    # p_id not in args
    data = {
        "a_id": 1,
        "labellings": []
    }
    edit_helper(app, client, data, 'Bad Request, missing p_id', 400, 1)

    # a_id not in args
    data = {
        "p_id": 1,
        "labellings": []
    }
    edit_helper(app, client, data, 'Bad Request', 400, 1)

    # labellings not in args
    data = {
        "a_id": 1,
        "p_id": 1
    }
    edit_helper(app, client, data, 'Bad Request', 400, 1)

    # Access denied if user is not allowed to edit this labelling
    data = {
        "p_id": 1,
        "a_id": 1, 
        "labellings": [{}, {}]
    }
    edit_helper(app, client, data, 'This member is not admin', 401, 6)

def edit_helper(app, client, data, expected_text, expected_code, u_id):
    # Request handler
    request_handler = RequestHandler(app, client, u_id)

    # Make request to database
    response = request_handler.patch('/labelling/edit', data, True)

    # Check the response is correct
    print(response.text)
    
    assert response.text == expected_text
    assert response.status_code == expected_code

    # If the code is 200, then edit was successful
    # Check if the edit is correct
    if expected_text == 200:
        # Using db requires app context
        with app.app_context():
            for labelling in data['labellings']:
                # Get the labelling we edited
                entry = db.session.scalar(
                    select(Labelling).where(Labelling.u_id==u_id, Labelling.lt_id==labelling['lt_id'],
                    Labelling.a_id==data['a_id']))

                # Check that the labelling was edited correctly
                assert entry.l_id == labelling['id']
                assert entry.p_id == data['p_id']