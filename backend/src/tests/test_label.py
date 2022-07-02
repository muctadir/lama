# Author: B Henkemans
from urllib import request
from sqlalchemy import select
from src.models.item_models import Label
from src import db
from src.conftest import RequestHandler


def test_create(app, client):
    """
        In this test, the create label route is tested.
    """
    with app.app_context():

        label = {
            'labelTypeId': 3,
            'labelName': 'Good idea',
            'labelDescription': 'This is an example of a good idea!',
            'p_id': 2
        }
        # Incorrect method
        response = client.get('/label/create')
        assert response.status_code == 405

        # Incorrect method
        response = client.patch('/label/create')
        assert response.status_code == 405

        # Non-existent user
        request_handler_empty = RequestHandler(app, client, '')
        create_label_helper(request_handler_empty, label,
                            'User does not exist', 401)

        # User not part of project
        request_handler_wrong_project = RequestHandler(app, client, 7)
        create_label_helper(request_handler_wrong_project,
                            label, 'Unauthorized', 401)

        # Setting up authorized user
        request_handler = RequestHandler(app, client, 2)

        # Request missing information, missing p_id
        create_label_helper(request_handler, {},
                            'Bad Request, missing p_id', 400)

        # Request missing information, p_id included
        label_missing_information = {'labelTypeId': 3,
                                    'labelDescription': 'This is an example of a good idea!',
                                    'p_id': 2}
        create_label_helper(
            request_handler, label_missing_information, 'Bad Request', 400)

        # Request with invalid character in the name
        label_invalid_character = {'labelTypeId': 3,
                                'labelName': 'Good idea\\',
                                'labelDescription': 'This is an example of a good idea!',
                                'p_id': 2}

        create_label_helper(
            request_handler, label_invalid_character, 'Input contains a forbidden character', 511)

        # Request with empty name
        label_empty_name = {'labelTypeId': 3,
                            'labelName': '',
                            'labelDescription': 'This is an example of a good idea!',
                            'p_id': 2}

        create_label_helper(
            request_handler, label_empty_name, 'Label name cannot be empty', 400)

        # Request with empty description
        label_empty_name = {'labelTypeId': 3,
                            'labelName': 'Good idea',
                            'labelDescription': '',
                            'p_id': 2}

        create_label_helper(
            request_handler, label_empty_name, 'Label description cannot be empty', 400)

        # Request with taken name
        label_duplicate = {'labelTypeId': 3,
                        'labelName': 'Boring idea',
                        'labelDescription': 'just boring',
                        'p_id': 2}

        create_label_helper(
            request_handler, label_duplicate, 'Label name already exists', 400)

        # Request with labelTypeId \not\in project
        label_wrong_lt = {'labelTypeId': 2,
                        'labelName': 'Brilliant idea',
                        'labelDescription': 'A brilliant idea!',
                        'p_id': 2}
        create_label_helper(
            request_handler, label_wrong_lt, 'Label type not in this project', 400)

        # Regular insert
        create_label_helper(request_handler, label, 'Created', 200)

        # Request with label name which exists in another project
        label_wrong_lt = {'labelTypeId': 3,
                        'labelName': 'Angry',
                        'labelDescription': 'A brilliant idea!',
                        'p_id': 2}
        create_label_helper(
            request_handler, label_wrong_lt, 'Created', 200)

        # Missing tests:
        # - Frozen project
        # - White space

def test_edit(app, client):
    with app.app_context():

        label = {
            'labelId': 24,
            'labelName': 'Boring idea',
            'labelDescription': 'boring',
            'p_id': 2
        }
        # Incorrect method
        response = client.get('/label/edit')
        assert response.status_code == 405

        # Incorrect method
        response = client.post('/label/edit')
        assert response.status_code == 405

        # Non-existent user
        request_handler_empty = RequestHandler(app, client, '')
        edit_label_helper(request_handler_empty, label,
                        'User does not exist', 401)

        # User not part of project
        request_handler_wrong_project = RequestHandler(app, client, 7)
        edit_label_helper(request_handler_wrong_project,
                        label, 'Unauthorized', 401)

        # Setting up authorized user
        request_handler = RequestHandler(app, client, 2)

        # Request missing information, missing p_id
        edit_label_helper(request_handler, {},
                        'Bad Request, missing p_id', 400)

        # Request missing information, p_id included
        label_missing_information = {
            'labelId': 24,
            'labelName': 'Boring idea',
            'p_id': 2
            }
        edit_label_helper(
            request_handler, label_missing_information, 'Bad Request', 400)


"""
Author: Bartjan Henkemans
A helper to execute create label tests
@param request_handler: The request handler to handle the requests.
@param label: the label information
@param u_id_token: token which authenticates the user
@param expected_text: What we expect as a text response
@param expected_text: What we expect as a code response 
"""


def create_label_helper(request_handler, label, expected_text, expected_status):
    # Send the post request
    response = request_handler.post('/label/create', label, True)
    # Check if the correct response code is received
    assert response.status_code == expected_status
    # Check if the correct response text is received
    assert response.text == expected_text
    # If we expect this to work
    if expected_status == 200:
        # Query on the data provided
        entry = db.session.scalars(select(Label).where(
            Label.lt_id == label['labelTypeId'],
            Label.name == label['labelName'],
            Label.description == label['labelDescription'],
            Label.p_id == label['p_id'])).all()
        # There should be a result
        assert entry
        assert len(entry) == 1


"""
Author: Bartjan Henkemans
A helper to execute edit label tests
@param request_handler: The request handler to handle the requests.
@param label: the label information
@param u_id_token: token which authenticates the user
@param expected_text: What we expect as a text response
@param expected_text: What we expect as a code response 
"""


def edit_label_helper(request_handler, label, expected_text, expected_status):
    # Send the post request
    response = request_handler.patch('/label/edit', label, True)
    # Check if the correct response code is received
    assert response.status_code == expected_status
    # Check if the correct response text is received
    assert response.text == expected_text
