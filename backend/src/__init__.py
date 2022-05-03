import click
from flask import Flask
from flask.cli import AppGroup
#from flask_login import LoginManager
from flask_migrate import Migrate, init, migrate, upgrade, stamp
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from os import environ

HOST = environ.get("HOST")
PORT = environ.get("PORT")
USERNAME = environ.get("USER")
PASSWORD = environ.get("PASSWORD")
DATABASE = environ.get("DATABASE")
DIALECT = environ.get("DIALECT")
DRIVER = environ.get("DRIVER")
URI = f"{DIALECT}+{DRIVER}://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}"

app = Flask("__name__")
app.config['SQLALCHEMY_DATABASE_URI'] = URI
app.config['SQLALCHEMY_ECHO'] = False  # Set this configuration to True if you want to see all of the SQL generated.
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # To suppress this warning

db = SQLAlchemy(app)
mig = Migrate(app, db)
# Important: Initialize Marshmallow after SQLAlchemy
ma = Marshmallow(app)

# login_manager = LoginManager()
# login_manager.init_app(app)

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

app.cli.add_command(db_opt)

# Circular imports are a special workaround for Flask, and also lets us have routes and models in their own module 
from src import routes
from src.models.auth_models import User