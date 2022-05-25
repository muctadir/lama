_Author: Ave, last updated 2022/05/25_

# Backend unit testing

## Relevant files

`src/__init__.py` contains the `app_create` factory. We can specify
that the created application object is used for testing. In that case, the
factory will do some special setup on the application object:
* Create an in-memory database. This is automatically removed after each test.
* Migrate the models into that database, so that we have all tables defined.

`src/models/__init__.py` contains the `db` object. This object is not a single
connection to a database, but instead a manager that supports switching between
app objects. Whenever `db` is used, it checks the `current_app` proxy exposed by
Flask, and it then connects to the database specified in the config of that app.

`src/conftest.py` contains "fixtures". This concept is introduced by the `pytest`
framework. Tests are functions, and they may accept parameters that correspond
to the name of a fixture. The test runner then executes the fixture definition
from `conftest.py`, and provides it to the test. A fixture will be executed
every time a new test runs. All of the setup and teardown code that is shared
between tests should go in there. Currently, the only fixture that is relevant
for use in our test cases is `client`. This simulates HTTP requests to the
Flask application.

`test*.py` contains test cases. See the section below for info on how the test
runner finds and executes these. Tests are simply functions, that accept
parameters corresponding to a name defined in `conftest.py`. All assertions
should be done with the standard Python keyword `assert`. I'm not sure how
we can give more descriptive messages on test failure, but the lines including
`assert` some very self-documenting. Perhaps we should put comments above them
to explain why a given assertion should hold.

## Running tests
There are two options for your execution environment:
* Running tests locally.
* Running tests in the Docker container.

If you want to run them locally, make sure all packages in `requirements.txt`
have been installed, by using `pip install -r requirements.txt`. (Preferably
in a virtual environment for reproducability.) This installs the `pytest`
package, which should give you access to the `pytest` CLI command.

I have not run tests in the Docker container yet, but this should be the most
reliable method. In Docker desktop, access the Flask container using a shell.
Then, run `flask stop` to stop the running process.

From here, the testing procedure is the same. In the terminal, run the `pytest`
command from the `src/` folder. In truth, you can run it from any folder, but for
reproducibility of results we should stick to one option. The test runner will
look for a `conftest.py` file to find fixtures, and any Python file starting
with `test`. This means that tests could be defined anywhere in the project, but
gathering them in the `src/tests/` folder is good practice. The runner then
finds tests methods, by looking for methods with a name that starts with `test`.
Fixtures are provided as described above. The result of the tests is given in
the console. Passing tests will pass silently, but failing tests will print
additional info. For more detail, arguments can be supplied to the `pytest` CLI
command.

## Additional resources
For more info on the client object:
https://werkzeug.palletsprojects.com/en/2.1.x/test/

For more info on the response objects returned:
https://werkzeug.palletsprojects.com/en/2.1.x/test/#werkzeug.test.TestResponse

A good overview/tutorial:
https://flask.palletsprojects.com/en/2.1.x/testing/

## Future work
* Simulate logged in users making requests: 
https://flask-login.readthedocs.io/en/latest/#automated-testing

* Display code coverage:
https://flask.palletsprojects.com/en/2.1.x/testing/

* Unit test auxillary functions that are not routes.