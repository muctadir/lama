import os

from flask import Flask, request, jsonify
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

app = Flask("__name__") # Using just __name__ will not pick up debugging info from queries in 'deeper' folders

# MySQL Database
host = "localhost" # default port is 5000
username = "admin"
password = "1234"
dbname = "db"
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqldb://{username}:{password}@{host}/{dbname}'.format(username=username,
        password=password, host=host, dbname=dbname)
app.config['SQLALCHEMY_ECHO'] = False  # Set this configuration to True if you want to see all of the SQL generated.
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # To suppress this warning
db = SQLAlchemy(app)
migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.init_app(app)

# Importing at end because the routes themselves import this module (which we do so we can have the routes in separate files)
from src import routes