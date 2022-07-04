from src import create_app, db, db_init
from src.models.auth_models import User
from pytest import raises
from sqlalchemy.exc import OperationalError
from dotenv import load_dotenv
from sqlalchemy import select
"""
Author: Eduardo Costa Martins
This file is for testing things related to the construction of the app.
"""

def test_db_opt_init():

    # Tests need to be told to load environment variables explicitly
    load_dotenv()

    # Create an app without initializing the database
    app = create_app({'TESTING': True, 'INIT': False})


    with app.app_context():

        # Assert that the database is not initialized
        with raises(OperationalError):
            db.session.get(User, 1)

        # Initialize it
        db_init('migrations-test')

        # Get super admin
        user = db.session.get(User, 1)

        assert user.super_admin == True
        assert user.description == "Auto-generated super admin"

        # Check that only one user was created
        users = db.session.execute(select(User)).all()

        assert len(users) == 1

def test_app_config(app):

    # Checks the database URIs for testing and non-testing apps

    assert app.config['SQLALCHEMY_DATABASE_URI'] == 'sqlite:///:memory:'

    load_dotenv()

    new_app = create_app()
    assert new_app.config['SQLALCHEMY_DATABASE_URI'] != 'sqlite:///:memory:'

