from sqlalchemy import select, distinct, func
from src.models.item_models import Artifact, Labelling, ArtifactSchema
from src.models.auth_models import UserSchema, User
from src.models.project_models import Project
from src import db
from src.exc import TestAuthenticationError
from src.conftest import RequestHandler
from pytest import raises
from src.routes.artifact_routes import __get_artifact_info, __get_artifact, __get_extended, generate_artifact_identifier
from src.searching.search import search_func_all_res, best_search_results

# Tests that artifact/artifactmanagement cannot be accessed
# if the user is not logged in
def test_artifactmanagement_not_logged_in(app, client):
    # Checks if route can be accessed without being logged in
    check_login(app, client, '/artifact/artifactmanagement', {
        'p_id': 3,
        'page': 1,
        'page_size': 5,
        'seek_index': 0,
        'seek_page': 0
    }, 'GET')

# Tests that artifact/artifactmanagement cannot be accessed
# if user does not have access to the project
def test_artifactmanagement_no_project_access(app, client):
    # Checks if route can be accessed when user does not have access to a project
    check_in_project(app, client, '/artifact/artifactmanagement', {
        'p_id': 3,
        'page': 1,
        'page_size': 5,
        'seek_index': 0,
        'seek_page': 0
    }, 'GET', 4)

# Tests that artifact/artifactmanagement throws an error if not
# all params are given in request
def test_artifactmanagement_not_all_params(app, client):
    # Make request with no args
    check_no_params(app, client, '/artifact/artifactmanagement', {}, 'GET', 4)

    # Make request without seek_page
    check_no_params(app, client, '/artifact/artifactmanagement', {
        'p_id': 1,
        'page': 1,
        'page_size': 5,
        'seek_index': 0,
    }, 'GET', 4)

    # Make request without seek_index
    check_no_params(app, client, '/artifact/artifactmanagement', {
        'p_id': 1,
        'page': 1,
        'page_size': 5,
        'seek_page': 0
    }, 'GET', 4)

    # Make request without page_size
    check_no_params(app, client, '/artifact/artifactmanagement', {
        'p_id': 1,
        'page': 1,
        'seek_index': 0,
        'seek_page': 0
    }, 'GET', 4)

    # Make request without page
    check_no_params(app, client, '/artifact/artifactmanagement', {
        'p_id': 1,
        'page_size': 5,
        'seek_index': 0,
        'seek_page': 0
    }, 'GET', 4)

    # Make request without p_id
    check_no_params(app, client, '/artifact/artifactmanagement', {
        'page': 1,
        'page_size': 5,
        'seek_index': 0,
        'seek_page': 0
    }, 'GET', 4)

# Tests that all artifacts are given if user is admin of project
def test_artifactmanagement_admin(app, client):
    artifact_management_help(app, client, 4, 1, True, 5, 11, 2)

# Tests if no artifacts show if the current user is not admin and has not labelled anything
def test_artifactmanagement_notadmin_nolabellings(app, client):
    # User with id 8 has no labelled artifacts in project with id 1
    request_handler = RequestHandler(app, client, 8)

    # Get artifacts displayed to current user
    response = request_handler.get('/artifact/artifactmanagement', {
        'p_id': 1,
        'page': 1,
        'page_size': 5,
        'seek_index': 0,
        'seek_page': 0
    }, True)

    # Check that the status code is correct
    assert(response.status_code == 200)

    # Get data from the response
    data = response.json

    # Check that the response is correct
    assert(data['info'] == [])
    assert(data['nArtifacts'] == 0)
    assert(data['nLabelTypes'] == 2)

# Tests that no artifacts show if the current user is not admin and has not labelled anything
def test_artifactmanagement_notadmin_labellings(app, client):
    artifact_management_help(app, client, 4, 2, False, 5, 11, 1)

# Tests if /artifact/creation can be accessed without being logged in
def test_create_artifact_nologin(app, client):
    check_login(app, client, '/artifact/creation', {
        'p_id': 1,
        'artifacts': []
    }, 'POST')

# Tests if /artifact/creation throws an error if the logged in user
# does not have access to the project
def test_create_artifact_notinproject(app, client):
    check_in_project(app, client, '/artifact/creation', {
        'p_id': 3,
        'artifacts': ['some artifact']
    }, 'POST', 3)

# Tests that artifact/creation throws an error if project is frozen
def test_create_artifact_frozen(app, client):
    # Try to add artifacts to the frozen project
    check_frozen(app, client, '/artifact/creation', {
        'p_id': 1,
        'artifacts': {'array': [{
            'data': "Artifact 1",
            'p_id': 1
        },
            {
            'data': "Artifact 2",
            'p_id': 1
        }]
        }
    }, 'POST', 2, 1)

# Tests that artifact/creation throws an error if not
# all params are given in request
def test_create_artifact_not_all_params(app, client):
    # Request handler
    request_handler = RequestHandler(app, client, 3)

    # Make request with no args
    response = request_handler.post('/artifact/creation', {}, True)
    # Check that the status code is correct
    assert(response.status_code == 500)

    # Make request without p_id
    response = request_handler.post('/artifact/creation', {
        'artifacts': []
    }, True)
    # Check that the status code is correct
    assert(response.status_code == 500)

    # Make request without artifacts
    response = request_handler.post('/artifact/creation', {
        'p_id': 1
    }, True)
    # Check that the status code is correct
    assert(response.status_code == 400)

# Tests if artifact/creation behaves correctly when
# there are no artifacts being submitted by an admin
def test_create_artifact_no_artifacts_admin(app, client):
    create_artifact_help(app, client, 2, 1, {'array': []}, True)

# Tests if artifact/creation behaves correctly when
# there are no artifacts being submitted by a non-admin
def test_create_artifact_no_artifacts_notadmin(app, client):
    create_artifact_help(app, client, 6, 1, {'array': []}, False)

# Tests if artifact/creation behaves correctly when
# artifacts are being submitted by an admin
def test_create_artifact_artifacts_admin(app, client):
    create_artifact_help(app, client, 2, 1, {'array': [{
        'data': "Artifact 1",
        'p_id': 1
    },
        {
        'data': "Artifact 2",
        'p_id': 1
    }]}, True)

# Tests if artifact/creation behaves correctly when
# artifacts are being submitted by a non-admin
def test_create_artifact_artifacts_notadmin(app, client):
    create_artifact_help(app, client, 6, 1, {'array': [{
        'data': "Artifact 1",
        'p_id': 1
    },
        {
        'data': "Artifact 2",
        'p_id': 1
    }]}, False)

# Tests that artifact/singleArtifact cannot be accessed
# if the user is not logged in
def test_singleArtifact_no_login(app, client):
    check_login(app, client, '/artifact/singleArtifact', {
        'p_id': 1,
        'a_id': 1,
        'extended': True
    }, 'GET')

# Tests that artifact/singleArtifact cannot be accessed
# if user does not have access to the project
def test_singleArtifact_no_project_access(app, client):
    check_in_project(app, client, '/artifact/singleArtifact', {
        'p_id': 4,
        'a_id': 1,
        'extended': True
    }, 'GET', 2)

# Tests that artifact/singleArtifact throws an error if not
# all params are given in request
def test_singleArtifact_not_all_params(app, client):
    # Make request with no params
    check_no_params(app, client, '/artifact/singleArtifact', {}, 'GET', 2)

    # Make request without p_id
    check_no_params(app, client, '/artifact/singleArtifact', {
        'a_id': 1,
        'extended': True
    }, 'GET', 2)

    # Make request without a_id
    check_no_params(app, client, '/artifact/singleArtifact', {
        'p_id': 1,
        'extended': True
    }, 'GET', 2)

    # Make request without extended
    check_no_params(app, client, '/artifact/singleArtifact', {
        'p_id': 1,
        'a_id': 1
    }, 'GET', 2)

    # Make request without p_id and a_id
    check_no_params(app, client, '/artifact/singleArtifact', {
        'extended': True
    }, 'GET', 2)

    # Make request without p_id and extended
    check_no_params(app, client, '/artifact/singleArtifact', {
        'a_id': 1
    }, 'GET', 2)

    # Make request without a_id and extended
    check_no_params(app, client, '/artifact/singleArtifact', {
        'p_id': 1
    }, 'GET', 2)

# Tests that an admin can get the correct data
# of an artifact they labelled
def test_singleArtifact_admin(app, client):
    # Check if the data is received correctly without extension
    singleArtifact_help(app, client, 2, 1, 1, True, 'user1', 'false')
    # Check if the data is received correctly with extension
    singleArtifact_help(app, client, 2, 1, 1, True, 'user1', 'true')

# Tests that an admin can get the correct data
# of an artifact they did not label
def test_singleArtifact_admin_notLabelled(app, client):
    # Check if the data is received correctly without extension
    singleArtifact_help(app, client, 3, 1, 1, True, 'user2', 'false')
    # Check if the data is received correctly with extension
    singleArtifact_help(app, client, 3, 1, 1, True, 'user2', 'true')

# Tests that a non-admin can get the correct data
# of an artifact they labelled
def test_singleArtifact_notAdmin(app, client):
    # Check if the data is received correctly without extension
    singleArtifact_help(app, client, 6, 2, 1, False, 'user5', 'false')
    # Check if the data is received correctly with extension
    singleArtifact_help(app, client, 6, 2, 1, False, 'user5', 'true')

# Tests that a non-admin does not have access to an artifact
# they have not labelled
def test_singleArtifact_notAdmin_notLabelled(app, client):
    # Request handler
    request_handler = RequestHandler(app, client, 6)

    # Make request to backend without extension
    response = request_handler.get('/artifact/singleArtifact', {
        'p_id': 1,
        'a_id': 1,
        'extended': 'false'
    }, True)
    # Check that the response has the right status code
    assert(response.status_code == 401)

    # Make request to backend without extension
    response = request_handler.get('/artifact/singleArtifact', {
        'p_id': 1,
        'a_id': 1,
        'extended': 'true'
    }, True)
    # Check that the response has the right status code
    assert(response.status_code == 401)

# Tests that artifact/search cannot be accessed
# if the user is not logged in
def test_search_no_login(app, client):
    check_login(app, client, '/artifact/search', {
        'p_id': 1,
        'a_id': 1,
        'extended': True
    }, 'GET')

# Tests that artifact/search cannot be accessed
# if user does not have access to the project
def test_search_no_project_access(app, client):
    check_in_project(app, client, '/artifact/search', {
        'p_id': 4,
        'a_id': 1,
        'extended': True
    }, 'GET', 2)

# Tests that artifact/search throws an error if not
# all params are given in request
def test_search_not_all_params(app, client):
    # Make a request with no params
    check_no_params(app, client, '/artifact/search', {}, 'GET', 2)

    # Make a request without p_id
    check_no_params(app, client, '/artifact/search',
                    {'search_words': "some words"}, 'GET', 2)

    # Make a request without search_words
    check_no_params(app, client, '/artifact/search', {'p_id': 1}, 'GET', 2)

# Tests that artifact/search returns the right search results
# when the user doing the search is an admin
def test_search_admin(app, client):
    # Test the search with no words in the search input
    search_help(app, client, 2, 1, "", True)

    # Test the search with a single word in the search input
    search_help(app, client, 2, 1, "Pellentesque", True)

    # Test the search with multiple words in the search input
    search_help(app, client, 2, 1, "Pellentesque dui purus", True)

# Tests that artifact/search returns the right search results
# when the user doing the search is not an admin
def test_search_notAdmin(app, client):
    # Test the search with no words in the search input
    search_help(app, client, 6, 1, "", True)

    # Test the search with a single word in the search input
    search_help(app, client, 6, 1, "Pellentesque", True)

    # Test the search with multiple words in the search input
    search_help(app, client, 6, 1, "Pellentesque dui purus", True)

# Tests that artifact/randomArtifact cannot be accessed
# if the user is not logged in
def test_randomArtifact_no_login(app, client):
    check_login(app, client, '/artifact/randomArtifact', {'p_id': 1}, 'GET')

# Tests that artifact/randomArtifact cannot be accessed
# if user does not have access to the project
def test_randomArtifact_no_project_access(app, client):
    check_in_project(app, client, '/artifact/randomArtifact',
                     {'p_id': 4}, 'GET', 2)

# Tests that artifact/randomArtifact throws an error if not
# all params are given in request
def test_randomArtifact_not_all_params(app, client):
    # Make a request with no params
    check_no_params(app, client, '/artifact/randomArtifact', {}, 'GET', 2)

# Tests that artifact/getLabellers cannot be accessed
# if the user is not logged in
def test_getLabellers_no_login(app, client):
    check_login(app, client, '/artifact/getLabellers',
                {'p_id': 1, 'a_id': 1}, 'GET')

# Tests that artifact/getLabellers cannot be accessed
# if user does not have access to the project
def test_getLabellers_no_project_access(app, client):
    check_in_project(app, client, '/artifact/getLabellers',
                     {'p_id': 4, 'a_id': 63}, 'GET', 2)

# Tests that artifact/getLabellers throws an error if not
# all params are given in request
def test_getLabellers_not_all_params(app, client):
    # Make a request with no params
    check_no_params(app, client, '/artifact/getLabellers', {}, 'GET', 2)

    # Make a request without p_id
    check_no_params(app, client, '/artifact/getLabellers',
                    {'a_id': 1}, 'GET', 2)

    # Make a request without a_id
    check_no_params(app, client, '/artifact/getLabellers',
                    {'p_id': 1}, 'GET', 2)

# Tests that an admin can get the correct labellers
# of an artifact they labelled
def test_getLabellers_admin(app, client):
    # Check if the data is received correctly
    getLabellers_help(app, client, 2, 1, 1)

# Tests that an admin can get the labellers
# of an artifact they did not label
def test_getLabellers_admin_notLabelled(app, client):
    # Check if the data is received correctly if there are labellers
    getLabellers_help(app, client, 4, 1, 1)
    # Check if the data is received correctly if there are no labellers
    getLabellers_help(app, client, 2, 2, 12)

# Tests that a non-admin can get the labellers
# of an artifact they labelled
def test_getLabellers_notAdmin(app, client):
    # Check if the data is received correctly
    getLabellers_help(app, client, 6, 1, 2)

# Tests that a non-admin does not have access to see the labellers
# of an artifact they have not labelled
def test_getLabellerst_notAdmin_notLabelled(app, client):
    # Check if the data is received correctly
    getLabellers_help(app, client, 6, 1, 1)

# Tests that artifact/split cannot be accessed
# if the user is not logged in
def test_split_no_login(app, client):
    check_login(app, client, '/artifact/split', {'p_id': 1,
                                                 'parent_id': 1,
                                                 'identifier': '2FA3F',
                                                 'start': 0,
                                                 'end': 17,
                                                 'data': 'Lorem ipsum dolor'}, 'POST')

# Tests that artifact/split cannot be accessed
# if user does not have access to the project
def test_split_no_project_access(app, client):
    check_in_project(app, client, '/artifact/split', {'p_id': 4,
                                                      'parent_id': 63,
                                                      'identifier': '2FA3F',
                                                      'start': 0,
                                                      'end': 17,
                                                      'data': 'Lorem ipsum dolor'}, 'POST', 2)

# Tests that artifact/split throws an error if project is frozen
def test_split_frozen(app, client):
    # Try to add artifacts to the frozen project
    check_frozen(app, client, '/artifact/split', {
        'p_id': 1,
        'parent_id': 1,
        'identifier': '2FA3F',
        'start': 0,
        'end': 17,
        'data': 'Lorem ipsum dolor'}, 'POST', 2, 1)

# Tests that artifact/split throws an error if not
# all params are given in request
def test_split_not_all_params(app, client):
    # Request handler
    request_handler = RequestHandler(app, client, 2)
    # Make a request with no params
    result = request_handler.post('/artifact/split', {}, True)
    # Check that the right status code is returned
    assert(result.status_code == 500)

    # Make a request without p_id
    result = request_handler.post('/artifact/split', {'parent_id': 1,
                                                      'identifier': '2FA3F',
                                                      'start': 0,
                                                      'end': 17,
                                                      'data': 'Lorem ipsum dolor'}, True)
    # Check that the right status code is returned
    assert(result.status_code == 500)

    # Make a request without parent_id
    check_no_params(app, client, '/artifact/split', {'p_id': 1,
                                                     'identifier': '2FA3F',
                                                     'start': 0,
                                                     'end': 17,
                                                     'data': 'Lorem ipsum dolor'}, 'POST', 2)

    # Make a request without identifier
    check_no_params(app, client, '/artifact/split', {'p_id': 1,
                                                     'parent_id': 1,
                                                     'start': 0,
                                                     'end': 17,
                                                     'data': 'Lorem ipsum dolor'}, 'POST', 2)

    # Make a request without start
    check_no_params(app, client, '/artifact/split', {'p_id': 1,
                                                     'parent_id': 1,
                                                     'identifier': '2FA3F',
                                                     'end': 17,
                                                     'data': 'Lorem ipsum dolor'}, 'POST', 2)

    # Make a request without end
    check_no_params(app, client, '/artifact/split', {'p_id': 1,
                                                     'parent_id': 1,
                                                     'identifier': '2FA3F',
                                                     'start': 0,
                                                     'data': 'Lorem ipsum dolor'}, 'POST', 2)

    # Make a request without data
    check_no_params(app, client, '/artifact/split', {'p_id': 1,
                                                     'parent_id': 1,
                                                     'identifier': '2FA3F',
                                                     'start': 0,
                                                     'end': 17}, 'POST', 2)

# Tests that artifact/split throws an error if the params
# passed to the route are inconsistent
def test_split_inconsistent(app, client):
    # We can use the check_no_params function since it checks for all erros with code 400
    # Check for identifier not matching the identifier of the parent artifact
    check_no_params(app, client, 'artifact/split', {'p_id': 1,
                                                    'parent_id': 1,
                                                    'identifier': '2FA3C',
                                                    'start': 0,
                                                    'end': 17,
                                                    'data': 'Lorem ipsum dolor'}, 'POST', 2)

    # Check for data not matching the substring indicated by start and end
    check_no_params(app, client, 'artifact/split', {'p_id': 1,
                                                    'parent_id': 1,
                                                    'identifier': '2FA3F',
                                                    'start': 0,
                                                    'end': 17,
                                                    'data': 'Lorem ipsum doloc'}, 'POST', 2)

# Tests that an admin can split an artifact they labelled
def test_split_admin_labelled(app, client):
    split_help(app, client, 2, 1, 1, 0, 17, '2FA3F', 'Lorem ipsum dolor')

# Tests that an admin can split an artifact they have not labelled
def test_split_admin_notLabelled(app, client):
    split_help(app, client, 3, 1, 1, 0, 17, '2FA3F', 'Lorem ipsum dolor')

# Tests that a non-admin can split an artifact they labelled
def test_split_notAdmin_labelled(app, client):
    split_help(app, client, 6, 1, 2, 0, 13, '2FA3F', 'Cras pulvinar')

# Tests that a non-admin can split an artifact they have not labelled
def test_split_notAdmin_notLabelled(app, client):
    split_help(app, client, 6, 1, 1, 0, 17, '2FA3F', 'Lorem ipsum dolor')

# Test that generate_artifact_identifier throws an error for invalid p_id
def test_generate_artifact_identifier_exception():
    # Check for p_id = 0
    with raises(Exception):
        generate_artifact_identifier(0)

    # Check for p_id < 0
    with raises(Exception):
        generate_artifact_identifier(-1)

# Tests that the identifier generated by generate_artifact_identifier is unique
def test_generate_artifact_identifier(app):
    # Project id
    p_id = 3

    # Using db requires app context
    with app.app_context():
        # Get the identifiers in the project
        identifiers = db.session.scalars(select(distinct(Artifact.identifier)).where(
            Artifact.p_id == p_id)).all()

        # Call the function
        identifier = generate_artifact_identifier(p_id)

        # Check that the generated identifier is unique
        assert(identifier not in identifiers)

# Tests that get_random_artifact returns an artifact not labelled by the user
# and which is not completely labelled
def test_get_random_artifact(app):
    # Project id
    p_id = 1
    # User id
    u_id = 3

    # Get random artifact
    result = get_random_artifact(app, u_id, p_id)

    # Using db requires app context
    with app.app_context():
        # Check if the artifact has not been labelled by the user
        assert(db.session.scalar(select(Labelling).where(
            Labelling.a_id == result.id,
            Labelling.u_id == u_id
        )) == None)

        # Get criteria of project
        criteria = db.session.scalar(select(Project.criteria).where(
            Project.id == p_id
        ))

        # Check if the artifact is not completely labelled
        assert(db.session.scalar(select(func.count(distinct(Labelling.u_id))).where(
            Labelling.a_id == result.id
        )) < criteria)

# Tests that get_random_artifact does not return anything
# when all artifacts have been labelled by the user
def test_get_random_artifact_all_labelled(app):
    # Project id
    p_id = 1
    # User id
    u_id = 2

    # Get random artifact
    result = get_random_artifact(app, u_id, p_id)

    # Check that there is no artifact that was returned
    assert (result == None)


"""
A helper function for executing tests on split
@param app: app for the test
@param client: client for the test
@param u_id: id of the current user
@param p_id: id of the current project
@param a_id: id of the current artifact
@param start: the start character from the original artifact
@param end: the start character from the original artifact
@param identifier: the identifier of the original artifact
@param data: text of the split artifact
"""
def split_help(app, client, u_id, p_id, a_id, start, end, identifier, data):
    # Request handler
    request_handler = RequestHandler(app, client, u_id)

    # Make the call to the database
    response = request_handler.post('artifact/split', {'p_id': p_id,
                                                       'parent_id': a_id,
                                                       'identifier': identifier,
                                                       'start': start,
                                                       'end': end,
                                                       'data': data}, True)

    # Check that response has correct status code
    assert(response.status_code == 200)

    # Get data from the response
    data = int(response.text)

    # Using db requires app context
    with app.app_context():
        # Get the expected text of the artifact that would result from the split
        expected = db.session.scalar(select(Artifact.data).where(
            Artifact.id == a_id))[start:end]

        # Get the artifact that resulted from the split
        new_artifact = db.session.scalar(select(Artifact).where(
            Artifact.id == data))

        # Check that the new artifact has correct data
        assert(new_artifact.identifier == identifier)
        assert(new_artifact.data == expected)


"""
A helper function for executing tests on getLabellers
@param app: app for the test
@param client: client for the test
@param u_id: id of the current user
@param p_id: id of the current project
@param a_id: id of the current artifact
"""
def getLabellers_help(app, client, u_id, p_id, a_id):
    # Request handler
    request_handler = RequestHandler(app, client, u_id)

    # Schema to serialize users
    user_schema = UserSchema()

    # Using db requires app context
    with app.app_context():
        # Get the expected list of labellers for this artifact
        expected = user_schema.dump(db.session.scalars(select(User).where(
            User.id == Labelling.u_id,
            Labelling.a_id == a_id
        ).distinct()).all(), many=True)

    # Make a request to the database
    response = request_handler.get(
        "/artifact/getLabellers", {'p_id': p_id, 'a_id': a_id}, True)

    # Check that response has correct status code
    assert(response.status_code == 200)

    # Get data from the response
    data = response.json

    # Check that the response data is the same as expected
    assert([labeller for labeller in data if labeller not in expected] == [])
    assert([labeller for labeller in expected if labeller not in data] == [])


"""
A helper function for executing search tests
@param app: app for the test
@param client: client for the test
@param u_id: id of the current user
@param p_id: id of the current project
@param search_words: string of words to be used for the search 
@param admin: true if the current user is project admin, false otherwise
"""
def search_help(app, client, u_id, p_id, search_words, admin):
    # Request handler
    request_handler = RequestHandler(app, client, u_id)

    # Using db requires app context
    with app.app_context():
        # Get the artifacts the user is allowed to view
        if admin:
            artifacts = db.session.scalars(select(Artifact).where(Artifact.p_id == p_id,
                                                                  Labelling.a_id == Artifact.id,
                                                                  Labelling.u_id == u_id).distinct()).all()
        else:
            artifacts = db.session.scalars(
                select(Artifact).where(Artifact.p_id == p_id,
                                       Labelling.a_id == Artifact.id,
                                       Labelling.u_id == u_id).distinct()).all()

        # Get the expected values of the search route
        expected_info = [info['item'] for info in
                         best_search_results(
            search_func_all_res(search_words, artifacts, 'id', ['id', 'data']),
            len(search_words.split()))]

        expected = [__get_artifact_info(artifact)
                    for artifact in expected_info]

    # Make call to the database
    response = request_handler.get("artifact/search", {
        'p_id': p_id,
        'search_words': search_words
    }, True)

    # Check that response has correct status code
    assert(response.status_code == 200)

    # Get data from the response
    data = response.json

    # Make sure that the response data is the same as the expected
    assert([info for info in data if info not in expected] == [])
    assert([info for info in expected if info not in data] == [])


"""
A helper function for executing tests on singleArtifact
@param app: app for the test
@param client: client for the test
@param u_id: id of the current user
@param p_id: id of the current project
@param artifacts: list of artifact text to be loaded into the database 
@param admin: true if the current user is project admin, false otherwise
"""
def singleArtifact_help(app, client, u_id, a_id, p_id, admin, username, extended):
    # Request handler
    request_handler = RequestHandler(app, client, u_id)

    # Schema to serialize the artifact
    artifact_schema = ArtifactSchema()
    # Schema to serialize users
    user_schema = UserSchema()

    # Using db requires app context
    with app.app_context():
        # Get the artifact
        artifact = __get_artifact(a_id)

        # Get the expected values of the request
        expected = {
            "artifact": artifact_schema.dump(artifact),
            "username": username,
            "admin": admin,
            "users": user_schema.dump(
                db.session.scalars(select(User)
                                   .where(Labelling.p_id == p_id,
                                          Labelling.u_id == User.id,
                                          Labelling.a_id == a_id).distinct()).all(), many=True)
        }

        # Get the expected extension of the request response if needed
        if extended == 'true':
            extended_data = __get_extended(artifact)

    # Make request to the database for not extended data
    response = request_handler.get('/artifact/singleArtifact', {
        'p_id': p_id,
        'a_id': a_id,
        'extended': extended
    }, True)

    # Check that response has correct status code
    assert(response.status_code == 200)

    # Get data from the response
    data = response.json

    # Check that the received data is the same as the expected one
    assert(data["artifact"] == expected["artifact"])
    assert(data["username"] == expected["username"])
    assert(data["admin"] == expected["admin"])
    assert(data["users"] == expected["users"])
    if extended == 'true':
        assert(data["artifact_children"] == extended_data["artifact_children"])
        assert(data["artifact_labellings"] ==
               extended_data["artifact_labellings"])


"""
A helper function for executing artifact creation tests
@param app: app for the test
@param client: client for the test
@param u_id: id of the current user
@param p_id: id of the current project
@param artifacts: list of artifact text to be loaded into the database 
@param admin: true if the current user is project admin, false otherwise
"""
def create_artifact_help(app, client, u_id, p_id, artifacts, admin):
    # Request handler
    request_handler = RequestHandler(app, client, u_id)

    # Using db requires app context
    with app.app_context():
        # Get all the artifacts in the project
        all_artifacts = db.session.scalars(select(Artifact).where(
            Artifact.p_id == p_id
        )).all()

        # Make request with no artifacts submitted
        response = request_handler.post('/artifact/creation', {
            'p_id': p_id,
            'artifacts': artifacts
        }, True)
        # Check that the status code is correct
        assert(response.status_code == 201)

        # Get the response data
        data = response.json

        # Check that the response data is correct
        assert(data['identifier'] not in [
               artifact.identifier for artifact in all_artifacts])
        assert(data['admin'] == admin)

        # Get all artifacts in the project after the new artifacts were submitted
        new_all_artifacts = db.session.scalars(select(Artifact).where(
            Artifact.p_id == p_id
        )).all()

        # Check if the correct number of artifacts is in the database
        assert(len(new_all_artifacts) - len(all_artifacts)
               == len(artifacts['array']))

        # Check that no old artifacts were removed
        assert(
            [artifact for artifact in all_artifacts if artifact not in new_all_artifacts] == [])

        # Data of all new artifacts
        artifact_data = db.session.scalars(select(Artifact.data).where(
            Artifact.identifier == data['identifier']
        )).all()

    # Check that all the artifacts to be added are in the database
    assert([text['data'] for text in artifacts['array']
           if text['data'] not in artifact_data] == [])


"""
A helper function for executing tests on displaying the
artifact management page
@param app: app for the test
@param client: client for the test
@param u_id: id of the current user
@param i_id: id of the logged in user
@param p_id: id of the current project
@param admin: true if the current user is project admin, false otherwise
@param page_size: max number of artifacts displayed on one page
@param n_artifacts: expected number of total artifacts displayed to the user
@param n_label_types: number of label types in the project
"""
def artifact_management_help(app, client, u_id, p_id, admin,
                             page_size, n_artifacts, n_label_types):
    # Request handler
    request_handler = RequestHandler(app, client, u_id)

    # Set of ids of all artifacts displayed to admin
    artifact_ids = set()
    # List of all artifacts displayed to admin
    artifacts = []
    # Set the number of pages to be shown and
    # the number of artifacts on the last page
    if n_artifacts % page_size > 0:
        n_pages = n_artifacts // page_size + 1
        n_last_page = n_artifacts % page_size
    else:
        n_pages = n_artifacts // page_size
        n_last_page = page_size

    # Last index of the page before the one that is displayed
    seek_index = 0
    # Check correct artifacts are returned for each page
    for i in range(1, n_pages + 1):
        # Make request for the ith page of artifacts
        response = request_handler.get('/artifact/artifactmanagement', {
            'p_id': p_id,
            'page': i,
            'page_size': page_size,
            'seek_index': seek_index,
            'seek_page': i
        }, True)

        # Check that the status code is correct
        assert(response.status_code == 200)

        # Get data from the response
        data = response.json

        # Check that the data from the response is correct
        assert(data['nArtifacts'] == n_artifacts)
        assert(data['nLabelTypes'] == n_label_types)

        # Check that the right number of artifacts was returned on the page
        if i < n_pages:
            assert(len(data['info']) == page_size)
        else:
            assert(len(data['info']) == n_last_page)

        # List of ids of the artifacts displayed on the page
        ids = [dict['artifact']['id'] for dict in data['info']]

        # Add the returned artifacts and their ids to
        # the list of artifacts and the set of all artifact ids
        artifacts.extend(data['info'])
        artifact_ids.update(ids)

        # Set the new value of seek_index
        seek_index = ids[-1]

    # Check that the right number of artifacts was returned overall
    # If the number is incorrect, then either the pagination returned duplicate artifacts
    assert(len(artifact_ids) == n_artifacts)

    # Using db requires app context
    with app.app_context():
        if admin:
            all_artifacts = db.session.scalars(
                select(Artifact).where(Artifact.p_id == p_id)).all()
        else:
            all_artifacts = db.session.scalars(select(Artifact).where(
                Artifact.id == Labelling.a_id,
                Artifact.p_id == p_id,
                Labelling.u_id == u_id,
                Labelling.p_id == p_id
            ).distinct()).all()

        # Expected list of artifact info
        expected = [__get_artifact_info(info) for info in all_artifacts]

    # Check that the returned artifacts are the same as what they are supposed to be
    assert [i for i in expected if i not in artifacts] == []
    assert [i for i in artifacts if i not in expected] == []


"""
A helper function for testing if a route throws the right error when
the user is not logged in
@param app: app for the test
@param client: client for the test
@param route: the route that the request is being made to
@param params: the parameters passed to the request
@method: GET, POST or PATCH
"""
def check_login(app, client, route, params, method):
    # Request handler
    request_handler = RequestHandler(app, client)

    # Make a request and check if the right error is thrown
    with raises(TestAuthenticationError):
        if method == 'GET':
            request_handler.get(route, params, True)
        if method == 'POST':
            request_handler.post(route, params, True)
        if method == 'PATCH':
            request_handler.post(route, params, True)


"""
A helper function for testing if a route throws the right error when
the user does not have access to a project
@param app: app for the test
@param client: client for the test
@param route: the route that the request is being made to
@param params: the parameters passed to the request
@method: GET, POST or PATCH
@u_id: id of the user
"""
def check_in_project(app, client, route, params, method, u_id):
    # Request handler
    request_handler = RequestHandler(app, client, u_id)

    # Make a request to the database
    if method == 'GET':
        response = request_handler.get(route, params, True)
    if method == 'POST':
        response = request_handler.post(route, params, True)
    if method == 'PATCH':
        response = request_handler.post(route, params, True)

    # Check that the status code is correct
    assert(response.status_code == 401)


"""
A helper function for testing if a route throws the right error when
the request does not have all the necessary params
@param app: app for the test
@param client: client for the test
@param route: the route that the request is being made to
@param params: the parameters passed to the request
@method: GET, POST or PATCH
@u_id: id of the user
"""
def check_no_params(app, client, route, params, method, u_id):
    # Request handler
    request_handler = RequestHandler(app, client, u_id)

    # Make a request to the database
    if method == 'GET':
        response = request_handler.get(route, params, True)
    if method == 'POST':
        response = request_handler.post(route, params, True)
    if method == 'PATCH':
        response = request_handler.post(route, params, True)

    # Check that the status code is correct
    assert(response.status_code == 400)


"""
Helper function for testing if a route can be accessed when the project is frozen
@param app: app for the test
@param client: client for the test
@param route: the route that the request is being made to
@param params: the parameters passed to the request
@method: GET, POST or PATCH
@u_id: id of the user
@p_id: id of the project
"""
def check_frozen(app, client, route, params, method, u_id, p_id):
    # Request handler
    request_handler = RequestHandler(app, client, u_id)

    # Freeze the project
    request_handler.patch('project/freeze', {
        'p_id': p_id,
        'frozen': True
    }, True)

 # Make a request to the database
    if method == 'GET':
        response = request_handler.get(route, params, True)
    if method == 'POST':
        response = request_handler.post(route, params, True)
    if method == 'PATCH':
        response = request_handler.post(route, params, True)

    # Check that the status code is correct
    assert(response.status_code == 400)

# Copy of the get_random_artifact function in artifact_routes
# func.rand() is replaced by func.random() because sqlite is incompetent
# Gets a random artifact which has not been already labelled by the user
def get_random_artifact(app, u_id, p_id):
    with app.app_context():
        # Criteria for artifact completion
        criteria = db.session.scalar(
            select(Project.criteria).where(Project.id == p_id))

        # Artifact ids that have been labelled by enough people
        # NB: Even with conflicts, it still should not be seen by more people
        labellings = select(
            Labelling.a_id,
            Labelling.lt_id,
            func.count(Labelling.l_id).label('label_count')
        ).where(
            Labelling.p_id == p_id
        ).group_by(
            Labelling.a_id,
            Labelling.lt_id
        ).subquery()

        min_labellings = select(
            labellings.c.a_id,
            func.min(labellings.c.label_count).label('min_count')
        ).group_by(
            labellings.c.a_id
        ).subquery()

        completed = select(
            min_labellings.c.a_id
        ).where(
            min_labellings.c.min_count >= criteria
        )

        # Artifact ids that the user has already labelled
        labelled = select(distinct(Labelling.a_id)).where(
            Labelling.u_id == u_id)

        artifact = db.session.scalar(
            select(Artifact)
            .where(
                Artifact.p_id == p_id,
                Artifact.id.not_in(completed),
                Artifact.id.not_in(labelled)
            ).order_by(func.random())
            .limit(1)
        )

        return artifact