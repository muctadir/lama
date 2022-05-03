import click
from flask import Flask
from flask.cli import AppGroup
#from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS

host = "localhost:3306"
username = "root"
password = ""
dbname = "lama"

app = Flask("__name__")
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqldb://{username}:{password}@{host}/{dbname}'.format(
        username=username,
        password=password, 
        host=host, 
        dbname=dbname)
app.config['SQLALCHEMY_ECHO'] = False  # Set this configuration to True if you want to see all of the SQL generated.
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # To suppress this warning

CORS(app)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
# Important: Initialize Marshmallow after SQLAlchemy
ma = Marshmallow(app)


# login_manager = LoginManager()
# login_manager.init_app(app)

db_opt = AppGroup("db-opt")

# TODO: add db-opt command to do all the initializing

# clears database recreates table
# TODO: Use Migrate for this instead, and for initialization
@db_opt.command("reset")
def reset():
        # TODO: Figure out how to delete tables
        db.create_all()

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