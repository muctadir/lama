from flask import Flask
from flask.cli import AppGroup
from flask_migrate import Migrate, init, migrate, upgrade
from src.models import db
from src.routes import *
from flask_cors import CORS
from os import environ, listdir
from os.path import join, dirname, exists
from dotenv import load_dotenv
from pathlib import Path
from shutil import rmtree
from secrets import token_hex
from werkzeug.security import generate_password_hash
from sqlalchemy import select
from sqlalchemy.exc import OperationalError
import click

# Add environment variables from file in root directory .env into process environment.
# First get path to .env file
dotenv_path = join(dirname(__file__), "../.env")
# Add variables
load_dotenv(dotenv_path)
# Read environment variables
IN_CONTAINER = environ.get("IN_DOCKER_CONTAINER", False)
HOST = environ.get("DB_HOSTNAME") if IN_CONTAINER else "localhost"
PORT = environ.get("DB_PORT")
USERNAME = environ.get("DB_USER")
PASSWORD = environ.get("DB_PASSWORD")
DATABASE = environ.get("DATABASE_NAME")
DIALECT = environ.get("DIALECT")
DRIVER = environ.get("DRIVER")
# This identifies the connection to the Dockerized database.
URI = f"{DIALECT}+{DRIVER}://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}"

# In the command line we have access to the `$ flask` command.
# AppGroups allow us to define extensions for this command-line interface.
# In this case, we can call `$ flask db-safe init` and `$ flask db-safe add-super-admin`.
db_safe = AppGroup("db-safe")

# Creates directory for database migrations if (and only if) it does not exist yet.
@db_safe.command("init")
@click.option("--dir", default='migrations')
def click_safe_init(dir):
    mig_dir = join(dirname(__file__), f"../{dir}")
    mig_exists = exists(mig_dir)

    if mig_exists and len(listdir(mig_dir)):
        print("Migration directory exists and is not empty... aborting initialisation")
        return
    
    init(directory=dir)

# Creates a super admin user based on environment variables if (and only if) one does not exist.
@db_safe.command("add-super-admin")
def click_add_super_admin():

    from src.models.auth_models import User, UserStatus
    from src.models.project_models import Project, Membership

    # This section creates the super admin upon initializing the database
    # The login details are retrieved from environment variables
    SUPER_USER = environ.get("SUPER_USER")
    SUPER_PASSWORD = environ.get("SUPER_PASSWORD")
    SUPER_EMAIL = environ.get("SUPER_EMAIL")

    # See if super admin already exists
    super_admin = db.session.scalar(
        select(User).where(User.super_admin == True)
    )

    if super_admin is not None:
        print("Super admin exists... aborting creation")
        return

    print("Creating super admin...")
    # The super admin is created and added
    db.session.add(User(
        username=SUPER_USER,
        email=SUPER_EMAIL,
        password=generate_password_hash(SUPER_PASSWORD),
        status=UserStatus.approved,
        super_admin=True,
        description="Auto-generated super admin"
    ))
    print("Super admin created... Adding to projects...")
    
    # Get newly created super admin
    super_admin = db.session.scalar(
        select(User).where(User.super_admin == True)
    )

    # Get all project ids
    projects = db.session.scalars(
        select(Project.id)
    )

    # Create admin membership from super admin to all projects
    memberships = [Membership(p_id=p_id, u_id=super_admin.id, admin=True) for p_id in projects]

    # Add memberships and commit
    db.session.add_all(memberships)
    try:
        db.session.commit()
    except OperationalError:
        raise OperationalError("Failed to commit creation of super admin")
    print("Added to projects")


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
    if config['TESTING']:
        # The in-memory database is discarded after each test, so we have to
        # remove the migrations folder used by the last test.
        mig_path = Path(__file__).parent.parent / 'migrations-test'
        if mig_path.is_dir():
            rmtree(str(mig_path))
        # This signals which app object the commands below apply to.
        if config['INIT']:
            with app.app_context():
                init(directory=str(mig_path))
                migrate(directory=str(mig_path))
                upgrade(directory=str(mig_path))

    # Generates a secret key for login use
    app.secret_key = token_hex()

    # Allows the Flask CLI to use the `db-safe` commands.
    app.cli.add_command(db_safe)

    # The endpoints for the API are defined in blueprints. These are imported
    # and hooked to the app object.
    app.register_blueprint(auth_routes.auth_routes)
    app.register_blueprint(util_routes.util_routes)
    app.register_blueprint(project_routes.project_routes)
    app.register_blueprint(account_routes.account_routes)
    app.register_blueprint(label_routes.label_routes)
    app.register_blueprint(label_type_routes.label_type_routes)
    app.register_blueprint(labelling_routes.labelling_routes)
    app.register_blueprint(artifact_routes.artifact_routes)
    app.register_blueprint(conflict_routes.conflict_routes)
    app.register_blueprint(theme_routes.theme_routes)
    app.register_blueprint(change_routes.change_routes)

    # Magic library that makes cross-origin resource sharing work.
    CORS(app)

    # For testing apps, additional teardown is required. This code is found in
    # conftest.py
    return app
