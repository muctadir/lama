# TODO: Short description of each of these libraries.

import click
from flask import Flask
from flask.cli import AppGroup
from flask_migrate import Migrate, init, migrate, upgrade
from src.models import db, ma
import src.models.auth_models
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
from src.models.item_models import Label


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
    from src.models.auth_models import User, UserStatus
    
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

# Fills the user table with a bunch of random users.
# TODO: Update this to match the new database models. Also, this should probably
# be defined in another file. (Testing setup needs to reuse it as well.)
@db_opt.command("fill")
def fill():

    from src.models.project_models import Membership, Project
    from src.models.item_models import LabelType, Label, Theme
    from src.models.auth_models import User, UserStatus

    # Creates 10 users which are all approved
    users = [User(
        username=f"TestUser{i}",
        password=generate_password_hash("1234"),
        email=f"test{i}@test.com",
        description=f"Description for test user {i}",
        super_admin=False
    ) for i in range(1, 11)]
    db.session.add_all(users)
    db.session.commit()

    # Creates 3 projects, the second of which is frozen
    projects = [Project(
        name=f"Project {i}",
        description=f"Description for test project {i}",
        frozen = i % 2
    ) for i in range(1, 4)]
    db.session.add_all(projects)
    db.session.commit()

    # Assigns the first 6/10 users to the first project
    # The last 6/10 users to the second project (two user overlap in projects)
    # No users to the third project
    # For each project, the first user is an admin, and the second user is soft-deleted
    memberships = [Membership(
        p_id = 1,
        u_id = i,
        admin = i == 1,
        deleted = i == 2
    ) for i in range(1, 7)]
    memberships.extend([Membership(
        p_id = 2,
        u_id = i,
        admin = i == 5,
        deleted = i == 6
    ) for i in range(5, 11)])
    db.session.add_all(memberships)
    db.session.commit()

    # Creates 3 label types for the first project
    # Creates 4 label types for the second project
    labeltypes =  [LabelType(
        name = f"Label Type {i}",
        id = i,
        p_id = 1
    ) for i in range(1, 4)]
    labeltypes.extend([LabelType(
        name = f"Label Type {i}",
        id = i,
        p_id = 2
    ) for i in range(4, 8)])
    db.session.add_all(labeltypes)
    db.session.commit()

    # Creates 2 labels for the first label types and 3 for the other labels in project 1
    # Creates 3 labels for the first two label types in project 2
    labels =  [Label(
        id = i,
        name = f"Label {i} (Label Type 1)",
        description=f"Description for label {i} for Label Type 1",
        lt_id = 1,
        p_id = 1
    ) for i in range(1, 3)]
    labels.extend([Label(
        id = i,
        name = f"Label {i} (Label Type 2)",
        description=f"Description for label {i} for Label Type 2",
        lt_id = 2,
        p_id = 1
    ) for i in range(3, 6)])
    labels.extend([Label(
        id = i,
        name = f"Label {i} (Label Type 3)",
        description=f"Description for label {i} for Label Type 3",
        lt_id = 3,
        p_id = 1
    ) for i in range(6, 9)])
    labels.extend([Label(
        id = i,
        name = f"Label {i} (Label Type 1)",
        description=f"Description for label {i} for Label Type 1",
        lt_id = 1,
        p_id = 2
    ) for i in range(9, 11)])
    labels.extend([Label(
        id = i,
        name = f"Label {i} (Label Type 2)",
        description=f"Description for label {i} for Label Type 2",
        lt_id = 2,
        p_id = 2
    ) for i in range(11, 13)])
    db.session.add_all(labels)
    db.session.commit()

    # Creates 2 theme in project 1 
    # Creates 3 theme in project 2
    theme = [Theme(
        id = i,
        name = f"Theme {i}",
        description=f"Description for theme {i}",
        p_id = 1
    ) for i in range(1, 3)]
    theme.extend([Theme(
        id = i,
        name = f"Theme {i}",
        description=f"Description for theme {i}",
        p_id = 2
    ) for i in range(3, 6)])
    db.session.add_all(theme)
    db.session.commit()

# TODO: Add db reset (this always breaks the migrations in my experience)

@db_opt.command("test")
def test():
    changes = get_changes(Label.__change__, 1, 1, True)
    for change in changes:
        print(f"{change['timestamp']} | {change['description']}")

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
    app.register_blueprint(conflict_routes)
    app.register_blueprint(theme_routes)
    app.register_blueprint(change_routes)

    # Magic library that makes cross-origin resource sharing work.
    CORS(app)

    # For testing apps, additional teardown is required. This code is found in
    # conftest.py
    return app