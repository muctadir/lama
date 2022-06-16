# TODO: Short description of each of these libraries.
import click
from flask import Flask
from flask.cli import AppGroup
from flask_migrate import Migrate, init, migrate, upgrade
from src.models import db
from src.models.auth_models import User, UserStatus
import src.models.project_models
import src.models.item_models
from src.routes import util_routes, auth_routes, project_routes, account_routes, label_routes, \
label_type_routes, labelling_routes, theme_routes, artifact_routes, conflict_routes, change_routes
from flask_cors import CORS
from os import environ
from pathlib import Path
from shutil import rmtree
from secrets import token_hex
from werkzeug.security import generate_password_hash
from src.routes.change_routes import get_changes



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
    SUPER_USER = environ.get("SUPER_USER")
    SUPER_PASSWORD = environ.get("SUPER_PASSWORD")
    SUPER_EMAIL = environ.get("SUPER_EMAIL")
    db.session.add(User(
        username=SUPER_USER,
        email=SUPER_EMAIL,
        password=generate_password_hash(SUPER_PASSWORD),
        status=UserStatus.approved,
        super_admin=True,
        description="Auto-generated super admin"
    ))
    db.session.commit()

# TODO: Add db reset (this always breaks the migrations in my experience)

@db_opt.command("test")
def test():
    pass

# This method returns a Flask application object, based on the given config
# dict. This allows us to have different behaviour for testing and non-testing
# environments.
def create_app(config={'TESTING': False}):
    # __name__ identifies this .py file, it's a technicality needed for Flask.
    app = Flask(__name__)
    # Setting the database URI.
    if config['TESTING'] is True:
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
    if config['TESTING'] is True:
        # The in-memory database is discarded after each test, so we have to
        # remove the migrations folder used by the last test.
        # TODO: Perhaps do this in teardown?
        mig_path = Path(__file__).parent.parent / 'migrations-test'
        if mig_path.is_dir():
            rmtree(str(mig_path))
        # This signals which app object the commands below apply to.
        with app.app_context():
            init(directory=str(mig_path))
            migrate(directory=str(mig_path))
            upgrade(directory=str(mig_path))

    # TODO: More comments, but this may be changed in the soon future.

    # generates a secret key for login use (TODO: Elaborate on this)
    app.secret_key = token_hex()

    # Allows the Flask CLI to use the `db-opt` commands. I'm not quite sure how
    # it knows about this.
    app.cli.add_command(db_opt)

    # The endpoints for the API are defined in blueprints. These are imported
    # and hooked to the app object.
    app.register_blueprint(auth_routes)
    app.register_blueprint(util_routes)
    app.register_blueprint(project_routes)
    app.register_blueprint(account_routes)
    app.register_blueprint(label_routes)
    app.register_blueprint(label_type_routes)
    app.register_blueprint(labelling_routes)
    app.register_blueprint(artifact_routes)
    app.register_blueprint(theme_routes)
    app.register_blueprint(change_routes)

    # Magic library that makes cross-origin resource sharing work.
    CORS(app)

    # For testing apps, additional teardown is required. This code is found in
    # conftest.py
    return app