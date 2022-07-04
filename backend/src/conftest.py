from pytest import fixture
from src import create_app, db
from src.exc import HandlerAuthenticationError
from jwt import encode

"""
Author: Eduardo Costa Martins
"""
@fixture
def app():
    app = create_app({'TESTING': True})

    # Database modifications require app context
    with app.app_context():

        # Read the file with insert statements.
        # Note: this cannot be the raw dump, it has to have been converted using sql2lite.py
        with open("src/tests/lama_test.sql") as file:

            # SQLite does not have support for executing multiple statements at once
            # so we insert one by one
            for line in file.readlines():
                # Execute the insert
                db.session.execute(line)
        # Commit all insertions
        db.session.commit()

    yield app

# To simulate requests
@fixture
def client(app):
    return app.test_client()

# To simulate doing CLI commands (we probably won't need this one?)
@fixture
def runner(app):
    return app.test_cli_runner()


"""
Author: Eduardo Costa Martins
This is supposed to simulate requests made using the frontend request handler.
The only difference is that instead of returning the response data, it returns the entire response object
This is done for testing purposes.
"""
class RequestHandler:

    # Additional headers passed, on top of required ones such as content_type
    headers = {}

    def __init__(self, app, client, u_id=None):

        self.app = app
        self.client = client
        # Optionally store the encoded u_id as the session token
        if u_id is None:
            self.session_token = None
        else:
            self.session_token = encode(
                {'u_id_token': u_id}, app.secret_key, algorithm='HS256')

    # Simulates a post request (with the params being nested in a dictionary)
    def post(self, path, params, auth):

        self.verify_authentication(auth)

        response = self.client.post(
            path, json={'params': params}, headers=self.headers)

        return response

    # Simulates a patch request (with the params being nested in a dictionary)
    def patch(self, path, params, auth):

        self.verify_authentication(auth)

        response = self.client.patch(
            path, json={'params': params}, headers=self.headers)

        return response

    # Simulates a get request
    def get(self, path, params, auth):

        self.verify_authentication(auth)

        response = self.client.get(
            path, query_string=params, headers=self.headers)

        return response

    # Sets the headers for a request based on whether or not authentication is required (and a session token is provided)
    def verify_authentication(self, authentication_req):

        if authentication_req:
            if self.session_token is None:
                raise HandlerAuthenticationError
            self.headers['u_id_token'] = self.session_token
        else:
            self.headers['u_id_token'] = ''
