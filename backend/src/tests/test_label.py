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
            request_handler, label_missing_information, 'Not all required arguments supplied', 400)

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
        create_label_helper(request_handler, label, 'Created', 201)

        # Request with label name which exists in another project
        label_wrong_lt = {'labelTypeId': 3,
                          'labelName': 'Angry',
                          'labelDescription': 'A brilliant idea!',
                          'p_id': 2}
        create_label_helper(
            request_handler, label_wrong_lt, 'Created', 201)

        # Request with white spaces
        label = {'labelTypeId': 3,
                'labelName': 'Angry ',
                'labelDescription': 'A brilliant idea!',
                'p_id': 2}
        create_label_helper(request_handler, label, "Input contains leading or trailing whitespaces", 400)

        label = {'labelTypeId': 3,
                'labelName': 'Angry',
                'labelDescription': 'A brilliant idea! ',
                'p_id': 2}
        create_label_helper(request_handler, label, "Input contains leading or trailing whitespaces", 400)

def test_get_all_labels(app, client):
    with app.app_context():
        # Request unauthenticated - non existent user
        request_handler_unauthenticated = RequestHandler(app, client, '')
        response = request_handler_unauthenticated.get(
            '/label/allLabels', {'p_id': 1}, True)
        assert response.status_code == 401
        assert response.text == "User does not exist"

        # Request unauthenticated - user not part of project
        request_handler_unauthenticated = RequestHandler(app, client, 7)
        response = request_handler_unauthenticated.get(
            '/label/allLabels', {'p_id': 2}, True)
        assert response.status_code == 401
        assert response.text == "Unauthorized"

        # Set up request handler for User 1
        request_handler = RequestHandler(app, client, 2)

        # Regular user get all without argument
        response = request_handler.get('/label/allLabels', {}, True)
        assert response.status_code == 400
        # assert response.text == "Bad Request, missing p_id"

        # Regular user get all normal.
        request_handler_admin = RequestHandler(app, client, 1)
        response = request_handler_admin.get(
            '/label/allLabels', {'p_id': 1}, True)
        assert response.status_code == 200

        request_handler = RequestHandler(app, client, 1)


def test_get_single_label(app, client):
    with app.app_context():
        # Request unauthenticated - non existent user
        request_handler_unauthenticated = RequestHandler(app, client, '')
        response = request_handler_unauthenticated.get(
            '/label/singleLabel', {'p_id': 1, 'label_id': 1}, True)
        assert response.status_code == 401
        assert response.text == "User does not exist"

        # Request unauthenticated - user not part of project
        request_handler_unauthenticated = RequestHandler(app, client, 7)
        response = request_handler_unauthenticated.get(
            '/label/singleLabel', {'p_id': 2, 'label_id': 1}, True)
        assert response.status_code == 401
        assert response.text == "Unauthorized"

        # Set up request handler for User 1
        request_handler = RequestHandler(app, client, 2)

        # Regular user get all without argument
        response = request_handler.get(
            '/label/singleLabel', {}, True)
        assert response.status_code == 400

        response = request_handler.get(
            '/label/singleLabel', {'p_id': 1}, True)
        assert response.status_code == 400

        # Regular user get  normal.
        response = request_handler.get(
            '/label/singleLabel', {'p_id': 1, 'label_id': 1}, True)
        assert response.status_code == 200

        # Admin get  normal.
        request_handler = RequestHandler(app, client, 1)
        response = request_handler.get(
            '/label/singleLabel', {'p_id': 1, 'label_id': 1}, True)
        assert response.status_code == 200

        request_handler = RequestHandler(app, client, 1)


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

        # Invalid label id
        label = {
            'labelId': -1,
            'labelName': 'Boring idea',
            'labelDescription': 'boring',
            'p_id': 2
        }
        edit_label_helper(request_handler, label, 'Bad Request, labelId invalid', 400)

        # Whitespaces
        label = {
            'labelId': 24,
            'labelName': 'Boring idea ',
            'labelDescription': 'boring',
            'p_id': 2
        }
        edit_label_helper(request_handler, label, "Input contains leading or trailing whitespaces", 400)

        label = {
            'labelId': 24,
            'labelName': 'Boring idea',
            'labelDescription': 'boring ',
            'p_id': 2
        }
        edit_label_helper(request_handler, label, "Input contains leading or trailing whitespaces", 400)

        label = {
            'labelId': 24,
            'labelName': 'Boring i#dea',
            'labelDescription': 'boring',
            'p_id': 2
        }
        edit_label_helper(request_handler, label, "Input contains a forbidden character", 511)

        # Label that doesn't exist
        label = {
            'labelId': 100,
            'labelName': 'Boring idea',
            'labelDescription': 'boring',
            'p_id': 2
        }
        edit_label_helper(request_handler, label, 'Label does not exist', 400)

        # Label in wrong project
        label = {
            'labelId': 24,
            'labelName': 'Boring idea',
            'labelDescription': 'boring',
            'p_id': 3
        }
        edit_label_helper(request_handler, label, 'Label not part of project', 400)

def test_merge(app, client):

    # Simulate being logged in as an admin
    request_handler = RequestHandler(app, client, 1)

    merge_label_helper(request_handler, {'bad_param': 'test'}, 'Not all required arguments supplied', 400)

    merge_label_helper(request_handler, {'newLabelName': ''}, 'Label name cannot be empty', 400)

    merge_label_helper(request_handler, {'newLabelDescription': ''}, 'Label description cannot be empty', 400)

    merge_label_helper(request_handler, {'newLabelName': 'Merged Label '}, 'Input contains leading or trailing whitespaces', 400)

    merge_label_helper(request_handler, {'newLabelName': 'Merged ; Label'}, 'Input contains a forbidden character', 511)

    merge_label_helper(request_handler, {'newLabelName': 'Happy'}, 'Label name already exists', 400)

    merge_label_helper(request_handler, {'mergedLabels': [1, 1]}, 'Label ids must be unique', 400)

    merge_label_helper(request_handler, {'mergedLabels': [1, 30]}, 'One or more labels do not exist', 400)

    merge_label_helper(request_handler, {'p_id': 2}, 'Labels must be in the same project', 400)

    merge_label_helper(request_handler, {'mergedLabels': [1, 9]}, 'Labels must be of the same type', 400)

    merge_label_helper(request_handler, {}, 'Success', 200)


def merge_label_helper(request_handler, altered_params, expected_text, expected_status):
    
    merge_params = {
        'mergedLabels': [2, 4],
        'newLabelName': 'Merged Label',
        'newLabelDescription': 'Description for Merged Label',
        'labelTypeName': 'Emotion',
        'p_id': 1,
    }

    merge_params.update(altered_params)

    response = request_handler.post('/label/merge', merge_params, True)

    assert response.status_code == expected_status
    assert response.text == expected_text

    return response

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
    if expected_status == 201:
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