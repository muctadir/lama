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
from secrets import token_hex

HOST = environ.get("HOST")
PORT = environ.get("PORT")
USERNAME = environ.get("USER")
PASSWORD = environ.get("PASSWORD")
DATABASE = environ.get("DATABASE")
DIALECT = environ.get("DIALECT")
DRIVER = environ.get("DRIVER")
URI = f"{DIALECT}+{DRIVER}://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}"
    
db_opt = AppGroup("db-opt")

# initializes database
@db_opt.command("init")
def db_init():
    init()
    migrate(message="Initial migration")
    upgrade()

# TODO: Add db reset (this always breaks the migrations in my experience)

# fills the user table with a bunch of random users
@db_opt.command("fill")
def fill():
    lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla aliquet."
    lorem = lorem.replace(",", "")
    lorem = lorem.replace(".", "")
    password = "1234"
    users = [User(username=word, password=password) for word in lorem.split()]
    db.session.add_all(users)
    db.session.commit()    

# TODO document the weird cli thing
# TODO refactor to use current_app
def create_app(test_config=None):
    app = Flask(__name__)
    if test_config == None:
        app.config['SQLALCHEMY_DATABASE_URI'] = URI
        app.config['SQLALCHEMY_ECHO'] = False  # Set this configuration to True if you want to see all of the SQL generated.
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # To suppress this warning

        CORS(app)

        db.init_app(app)
        mig = Migrate(app, db)

        login_manager = LoginManager()
        login_manager.init_app(app)
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

        app.secret_key = token_hex() # generates a secret key for login use

        app.cli.add_command(db_opt)

        app.register_blueprint(auth_routes)
        app.register_blueprint(demos)

        CORS(app)
        return app
    else:
        # TODO accept URI in test_config and merge these if conditions
        from flask import make_response
        @app.route("/foo", methods=["GET", "POST"])
        def foo_route():
            return make_response(("bar", 200))
        return app
        
# Circular imports are a special workaround for Flask, and also lets us have routes and models in their own module
# Essentially: app needs to import the routes
# Routes depend on app
# Import the routes after app is defined
# Register any blueprints associated with the routes
# (and yes, this is a Flask thing, I'm not just crazy)
# from src import routes # This will import routes not tied to a blueprint
# from src.routes.auth_routes import auth_routes # This will import the blueprint
