import click
from flask import Flask
from flask.cli import AppGroup
#from flask_login import LoginManager
from flask_migrate import Migrate, init, migrate, upgrade
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

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

db = SQLAlchemy(app)
migrate = Migrate(app, db)
# Important: Initialize Marshmallow after SQLAlchemy
ma = Marshmallow(app)


# login_manager = LoginManager()
# login_manager.init_app(app)

db_opt = AppGroup("db-opt")

# initializes database
@db_opt.command("init")
def init():
        init()
        db.create_all()
        update("Initial migration")

# drops all tables and recreates them (useful if you change the schema or models)
@db_opt.command("reset")
def reset():
        db.drop_all()
        db.create_all()
        update("Database reset")

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

def update(message):
        migrate(message=message)
        upgrade()

app.cli.add_command(db_opt)

# Circular imports are a special workaround for Flask, and also lets us have routes and models in their own module 
from src import routes
from src.models.auth_models import User