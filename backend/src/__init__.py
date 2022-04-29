import click
from flask import Flask, make_response
from flask.cli import AppGroup
#from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

host = "localhost:3306" # default port is 5000
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

# login_manager = LoginManager()
# login_manager.init_app(app)

@app.cli.command("create-tables")
def create_tables():
        db.create_all()

@app.cli.command("create-test")
@click.argument("index")
@click.argument("text")
def create_test(index, text):
        if index and text:
                existing_index = TestModel.query.filter(
                        TestModel.field1 == index
                ).first()
                if existing_index:
                        return make_response(f"Entry with index {index} already exists.")
                test = TestModel(
                        field1 = index,
                        field2 = text
                )
                db.session.add(test)
                db.session.commit()

# Importing at end because the routes themselves import this module (which we do so we can have the routes in separate files)
from src import routes
from src.models.model import TestModel