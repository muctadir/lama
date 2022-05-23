# TODO: Short description of each of these libraries.
import click
from flask import Flask
from flask.cli import AppGroup
from flask_login import LoginManager
from flask_migrate import Migrate, init, migrate, upgrade
from src.models import db, ma
from src.models.auth_models import User
from src.routes import demos, auth_routes
from flask_cors import CORS
from os import environ
from pathlib import Path
from shutil import rmtree
from secrets import token_hex



# Read environment variables. Currently these are stored in .env and .flaskenv.
HOST = environ.get("HOST")
PORT = environ.get("PORT")
USERNAME = environ.get("USER")
PASSWORD = environ.get("PASSWORD")
DATABASE = environ.get("DATABASE")
DIALECT = environ.get("DIALECT")
DRIVER = environ.get("DRIVER")
# This identifies the connection to the Dockerized database.
URI = f"{DIALECT}+{DRIVER}://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}"



# In the command line we have access to the `$ flask` command.
# AppGroups allow us to define extensions for this command-line interface.
# In this case, we can call `$ flask db-opt init` and `$ flask db-opt fill`.
db_opt = AppGroup("db-opt")

# Currently, database initialization needs to be done by hand.
# TODO: We should do this automatically.
# `migrate()` takes the defined models and creates tables in the database, if
# those tables do not yet exist.
@db_opt.command("init")
def db_init():
    init()
    migrate(message="Initial migration")
    upgrade()

# TODO: Add db reset (this always breaks the migrations in my experience)

# Fills the user table with a bunch of random users.
# TODO: Update this to match the new database models. Also, this should probably
# be defined in another file. (Testing setup needs to reuse it as well.)
@db_opt.command("fill")
def fill():
    lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla aliquet."
    lorem = lorem.replace(",", "")
    lorem = lorem.replace(".", "")
    password = "1234"
    users = [User(username=word, password=password) for word in lorem.split()]
    db.session.add_all(users)
    db.session.commit()    



# This method returns a Flask application object, based on the given config
# dict. This allows us to have different behaviour for testing and non-testing
# environments.
def create_app(config={'TESTING': False}):
    # __name__ identifies this .py file, it's a technicality needed for Flask.
    app = Flask(__name__)
    # Setting the database URI.
    if config['TESTING'] == True:
        # When testing, we want to have access to a mock database.
        # This is an SQLite database stored in-memory.
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = URI
    # Set this configuration to True if you want to see all of the SQL generated
    app.config['SQLALCHEMY_ECHO'] = False
    # To suppress this warning.
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

    # The db object is not a connection to a particular database, but rather the
    # interface by which SQLAlchemy exposes its functions.
    # We can reuse the same db object, even if we switch application objects.
    db.init_app(app)    
    mig = Migrate(app, db)

    # Since a new database is created when testing, we must migrate each time.
    if config['TESTING'] == True:
        # The in-memory database is discarded after each test, so we have to
        # remove the migrations folder used by the last test.
        # TODO: Perhaps to this in teardown?
        mig_path = Path(__file__).parent.parent / 'migrations-test'
        if mig_path.is_dir():
            rmtree(str(mig_path))
        # This signals which app object the commands below apply to.
        with app.app_context():
            init(directory='migrations-test')
            migrate(directory='migrations-test')
            upgrade(directory='migrations-test')

    # Used for managing user logins and sessions.
    login_manager = LoginManager()
    login_manager.init_app(app)

    # TODO: More comments, but this may be changed in the soon future.
    # Docs specify to return None if no user with id instead of an exception
    # Docs do not specify what to do in case of database exception
    # Leads to me to believe they do not like exceptions
    @login_manager.user_loader
    def load_user(user_id):
        try:
            user = db.session.query(User).get(user_id)
            if user:
                return user
        finally: 
            return None

    # generates a secret key for login use (TODO: Elaborate on this)
    app.secret_key = token_hex() 

    # Allows the Flask CLI to use the `db-opt` commands. I'm not quite sure how
    # it knows about this.
    app.cli.add_command(db_opt)

    # The endpoints for the API are defined in blueprints. These are imported
    # and hooked to the app object.
    app.register_blueprint(auth_routes)
    app.register_blueprint(demos)

    # Magic library that makes cross-origin resource sharing work.
    # TODO: Check if we are setting this up correctly.
    CORS(app)

    # For testing apps, additional teardown is required. This code is found in
    # conftest.py
    return app