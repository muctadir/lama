"""
Authors: Eduardo Costa Martins
"""

import re
from jwt import decode
from jwt.exceptions import InvalidSignatureError
from functools import wraps
from src.models.auth_models import User
from src.models.project_models import Membership
from src import db # need this in every route
from flask import current_app as app
from flask import make_response, request
from sqlalchemy.exc import OperationalError
from sqlalchemy import select
from inspect import getfullargspec
import datetime

def check_args(required, args):
    """
    @param required : a list of arguments needed for the backend method
    @param args : a dictionary of arguments supplied from the frontend
    @return : True <=> all required arguments supplied /\ no extra arguments supplied
    """
    if all(arg in args for arg in required): # All arguments supplied
        # Check no extra arguments supplied
        for key in args.keys():
            if key not in required:
                return False
        return True
    return False

def check_email(email):
    """
    @param email: a string
    @return : True <==> email is a validly formatted email
    Note: Does not check if email actually exists
    Note: Whilst the input field on the frontend can check this, users can edit html
        so the backend should also check formatting
    See: https://www.rfc-editor.org/rfc/rfc3696#section-3
    See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#validation
        Note: this pattern does not work here
    """
    return True

def check_username(username):
    """
    @param username : a string
    @return : True <=> username is valid
    A valid username is defined as a username that:
        has no leading or trailing whitespace
        is at least 5 characters long
        is no more than 32 characters long (database constraint)
    """
    return len(username.strip()) == len(username) and \
            len(username) >= 3 and \
            len(username) <= 32 # max username length according to db

def check_password(password):
    """
    @param username : a string
    @return : True <=> password is valid and complex
    A valid password is defined as a password that:
        has no leading or trailing whitespace
        is no more than 64 characters long (database constraint)
    A complex password is defined as a password that:
        is not in the list of banned common passwords (or similar to them)
        is at least 8 characters long
        fulfills at least one of the following requirements:
            contains an uppercase and lowercase character
            contains a special and non-special character
            contains a number and non-number character
            
            NB: we say at least one because enforcing many constraints actually makes passwords more predictable
    """
    banned = ["password", "password123"] # A list of common banned passwords (use env. variable?)
    caseRe = r"(?=.*[a-z]).*[A-Z]" # Uppercase and lowercase
    specialRe = r"(?=.*\W).*[\w]" # Special and non-special (note: underscore is non-special)
    numberRe = r"(?=.*[0-9]).*[^0-9]" # Number and non-number
    valid = len(password) <= 64 and len(password) == len(password.strip())
    complex = len(password) >= 8 and \
            password.lower() not in banned and \
            (re.match(caseRe, password) or \
            re.match(specialRe, password) or \
            re.match(numberRe, password))
    return valid and complex

def get_all_subclasses(cls):
    """
    @param cls : class to get subclasses of
    @return all subclasses of cls, including non-immediate subclasses
    Note: If you only need immediate subclasses then use cls.__subclasses__()
    """
    all_subclasses = set()

    for subclass in cls.__subclasses__():
        all_subclasses.add(subclass)
        all_subclasses.update(get_all_subclasses(subclass))
    
    return all_subclasses

def login_required(f):
    """
    Decorator that checks to see if the frontend is authorized (sending a valid token)
    and then passes on the corresponding user object to the decorated function
    Optionally passes user as a keyword argument
    You can enforce arguments to be keyword arguments by using * e.g.:
        def func(<positional arguments>, *, user):
    enforces user to be a keyword argument
    """
    # TODO: Check user status
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check that header for token is provided
        u_id_token = request.headers.get('u_id_token')
        if u_id_token is None:
            return make_response('1 Unauthorized', 401)
        try:
            # Decode the token
            u_id = decode(u_id_token, app.secret_key, algorithms=['HS256'])['u_id_token']
            # Fetch user with corresponding id
            user = db.session.get(User, u_id)
            # Check to see if user exists
            if not user:
                return make_response('2 Unauthorized', 401)
            # Add the found user as a keyword argument
            # Note, this means every function decorated with this must have user as an argument
            if 'user' in getfullargspec(f).kwonlyargs:
                kwargs['user'] = user
            return f(*args, **kwargs)
        except OperationalError as e:
            # Database error
            print(e)
            return make_response('Service Unavailable', 503)
        except InvalidSignatureError:
            # Token is signed incorrectly
            return make_response('3 Unauthorized', 401)
    return decorated_function

def super_admin_required(f):
    """
    Decorator that checks to see if the frontend is authorized (sending a valid token)
    with a super admin.
    Optionally passes super_admin as a keyword argument
    You can enforce arguments to be keyword arguments by using * e.g.:
        def func(<positional arguments>, *, super_admin):
    enforces user to be a keyword argument
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check that header for token is provided
        u_id_token = request.headers.get('u_id_token')
        if u_id_token is None:
            return make_response('Unauthorized', 401)
        try:
            # Decode the token
            u_id = decode(u_id_token, app.secret_key, algorithms=['HS256'])['u_id_token']
            # Fetch user with corresponding id
            # Note that querying the super_admin table equates to querying the user table and checking the type
            # So instead we query the user table (same amount of work) and then we also get to see the difference
            # between the id not existing, and a user not having permission
            user = db.session.get(User, u_id)
            # Check to see if user exists
            if not user:
                return make_response('Unauthorized', 401)
            # Check to see if user is a super_admin
            if user.type != 'super_admin':
                return make_response('Forbidden', 403)
            # Add the found admin as a keyword argument
            # Note, this means every function decorated with this must have user as an argument
            if 'super_admin' in getfullargspec(f).kwonlyargs:
                kwargs['super_admin'] = user
            return f(*args, **kwargs)
        except OperationalError as e:
            # Database error
            print(e)
            return make_response('Service Unavailable', 503)
        except InvalidSignatureError:
            # Token is signed incorrectly
            return make_response('3 Unauthorized', 401)
    return decorated_function

def in_project(f):
    """
    Decorator that checks if the user is in a certain project. This decorator needs to be placed _below_ the login_required decorator
    Requires 'p_id' to be in either the request body, or request parameters
    Optionally passes membership and/or user as a keyword argument
    """
    # TODO: Check user status
    @wraps(f)
    def decorated_function(*args, user, **kwargs):
        if request.method == 'GET':
            p_id = request.args['p_id']
        else:
            # TODO: Change request handler to not have to use params and get rid of this first case
            if 'params' in request.json:
                p_id = request.json['params']['p_id']
            else:
                p_id = request.json['p_id']
        # Check that pId argument was provided
        if not p_id:
            return make_response('Unauthorized', 401)
        
        membership = db.session.get(Membership, {'p_id': p_id, 'u_id': user.id})

        # Check that membership exists
        if not membership:
            return make_response('Unauthorized', 401)

        # Check if function requires certain keyword only arguments
        if 'user' in getfullargspec(f).kwonlyargs:
            kwargs['user'] = user
        if 'membership' in getfullargspec(f).kwonlyargs:
            kwargs['membership'] = membership

        return f(*args, **kwargs)

    return decorated_function

def time_from_seconds(seconds):
    seconds_leftover = int(seconds % 60)
    minutes = int((seconds - seconds_leftover) / 60)
    minutes_leftover = int(minutes % 60)
    hours = int((minutes -  minutes_leftover) / 60)
    
    return datetime.time(hours, minutes_leftover, seconds_leftover)