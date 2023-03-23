"""
Authors: Eduardo Costa Martins
"""

import re
from jwt import decode
from jwt.exceptions import InvalidSignatureError
from functools import wraps
from src import db  # need this in every route
from flask import current_app as app
from flask import make_response, request
from sqlalchemy.exc import OperationalError
from inspect import getfullargspec
from datetime import time
from os import environ

def check_args(required, args):
    """
    @param required : a list of arguments needed for the backend method
    @param args : a dictionary of arguments supplied from the frontend
    @return : True <=> all required arguments supplied /\ no extra arguments supplied
    """
    if all(arg in args for arg in required):  # All arguments supplied
        # Check no extra arguments supplied
        for key in args.keys():
            if key not in required:
                return False
        return True
    return False


def check_email(email):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
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
    if(re.fullmatch(regex, email)):
        return True
    return False


def check_username(username):
    """
    @param username : a string
    @return : True <=> username is valid
    A valid username is defined as a username that:
        has no leading or trailing whitespace
        is at least 3 characters long
        is no more than 32 characters long (database constraint)
    """
    return len(username.strip()) == len(username) and \
        len(username) >= 3 and \
        len(username) <= 32  # max username length according to db


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
    banned = [
        "password", "password123"]  # A list of common banned passwords (use env. variable?)
    case_re = r"(?=.*[a-z]).*[A-Z]"  # Uppercase and lowercase
    # Special and non-special (note: underscore is non-special)
    special_re = r"(?=.*\W).*[\w]"
    number_re = r"(?=.*[0-9]).*[^0-9]"  # Number and non-number
    valid = len(password) <= 64 and len(password) == len(password.strip())
    complex_password = len(password) >= 8 and \
        password.lower() not in banned and \
        (re.match(case_re, password) or
         re.match(special_re, password) or
         re.match(number_re, password))
    return bool(valid and complex_password)


def check_string(strings):
    """
    Checks the given string for the characters \ ; , #
    @params strings: list of input strings
    @return whether the string input includes a forbidden character
    """
    chars = ["\\", ";", ",", "#"]
    for string in strings:
        has_char = [char in string for char in chars]
        if True in has_char:
            # A string includes a forbidden character
            return True
    return False


def check_whitespaces(strings):
    """
    Checks the given string has leading or trailing whitespaces
    @params strings: list of input strings
    @return whether the string input includes leading or trailing whitespace
    """
    for string in strings:
        if string != string.strip():
            # A string includes whitespace
            return True
    return False


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
    from src.models.auth_models import User, UserStatus
    """
    Decorator that checks to see if the frontend is authorized (sending a valid token)
    and then passes on the corresponding user object to the decorated function
    Optionally passes user as a keyword argument
    You can enforce arguments to be keyword arguments by using * e.g.:
        def func(<positional arguments>, *, user):
    enforces user to be a keyword argument
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check that header for token is provided
        u_id_token = request.headers.get('u_id_token')
        if u_id_token is None or u_id_token == '':
            return make_response('Authentication token not provided', 401)
        try:
            # Decode the token
            u_id = decode(u_id_token, app.secret_key,
                          algorithms=['HS256'])['u_id_token']
            # Fetch user with corresponding id
            user = db.session.get(User, u_id)
            # Check to see if user exists
            if not user:
                return make_response('User does not exist', 401)
            # Checks whether the user account is approved
            if user.status != UserStatus.approved:
                return make_response('User account has been deactivated', 401)
            # Add the found user as a keyword argument
            # Note, this means every function decorated with this must have user as an argument
            if 'user' in getfullargspec(f).kwonlyargs:
                kwargs['user'] = user
            return f(*args, **kwargs)
        except OperationalError:
            # Database error
            return make_response('Service Unavailable', 503)
        except InvalidSignatureError:
            # Token is signed incorrectly
            return make_response('3 Unauthorized', 401)
    return decorated_function


def super_admin_required(f):
    from src.models.auth_models import User
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
        if u_id_token is None or u_id_token == '':
            return make_response('Unauthorized', 401)
        try:
            # Decode the token
            u_id = decode(u_id_token, app.secret_key,
                          algorithms=['HS256'])['u_id_token']
            # Fetch user with corresponding id
            # Note that querying the super_admin table equates to querying the user table and checking the type
            # So instead we query the user table (same amount of work) and then we also get to see the difference
            # between the id not existing, and a user not having permission
            user = db.session.get(User, u_id)
            # Check to see if user exists
            if not user:
                return make_response('Unauthorized', 401)
            # Check to see if user is a super_admin
            if not user.super_admin:
                return make_response('Forbidden', 403)
            # Add the found admin as a keyword argument
            # Note, this means every function decorated with this must have user as an argument
            if 'super_admin' in getfullargspec(f).kwonlyargs:
                kwargs['super_admin'] = user
            return f(*args, **kwargs)
        except OperationalError:
            # Database error
            return make_response('Service Unavailable', 503)
        except InvalidSignatureError:
            # Token is signed incorrectly
            return make_response('3 Unauthorized', 401)
    return decorated_function


def in_project(f):
    from src.models.project_models import Membership
    """
    Decorator that checks if the user is in a certain project. This decorator needs to be placed _below_ the login_required decorator
    Requires 'p_id' to be in either the request body, or request parameters
    Optionally passes membership and/or user as a keyword argument
    """
    @wraps(f)
    def decorated_function(*args, user, **kwargs):
        if request.method == 'GET':
            p_id = request.args['p_id']
        else:
            if 'p_id' in request.json:
                p_id = request.json['p_id']
            else:
                return make_response('Bad Request, missing p_id', 400)
        # Check that pId argument was provided
        if not p_id:
            return make_response('Unauthorized', 401)

        membership = db.session.get(
            Membership, {'p_id': p_id, 'u_id': user.id})

        # Check that membership exists and that membership was not deleted.
        if not membership or membership.deleted:
            return make_response('Unauthorized', 401)

        # Check if function requires certain keyword only arguments
        if 'user' in getfullargspec(f).kwonlyargs:
            kwargs['user'] = user
        if 'membership' in getfullargspec(f).kwonlyargs:
            kwargs['membership'] = membership

        return f(*args, **kwargs)

    return decorated_function


def not_frozen(f):
    """
    Decorator that checks that the project is not frozen. This decorator needs to be placed _below_ the in_project decorator
    Optionally passes project/user/membership as keyword only arguments.
    """
    @wraps(f)
    def decorated_function(*args, user, membership, **kwargs):
        # Get project that user is a member of
        project = membership.project
        # Checks that project exists
        # Note that this should never happen, since the membership has a foreign key dependency on project
        if not project:
            return make_response("Internal Server Error", 500)

        # Checks that the project is not frozen
        # The request should not be processed if the project is frozen
        if project.frozen:
            return make_response("Bad Request: Project Frozen", 400)

        # Check if function requires certain keyword only arguments
        if 'user' in getfullargspec(f).kwonlyargs:
            kwargs['user'] = user
        if 'membership' in getfullargspec(f).kwonlyargs:
            kwargs['membership'] = membership
        if 'project' in getfullargspec(f).kwonlyargs:
            kwargs['project'] = project

        return f(*args, **kwargs)
    return decorated_function

# Get time from seconds
def time_from_seconds(seconds):
    # Left over seconds
    seconds_leftover = int(seconds % 60)
    # Minutes
    minutes = int((seconds - seconds_leftover) / 60)
    # Left over minutes
    minutes_leftover = int(minutes % 60)
    # Hours
    hours = int((minutes - minutes_leftover) / 60)

    # Return the time
    return time(hours, minutes_leftover, seconds_leftover)

# Converts a environment variable to a boolean
def get_variable(name: str, default_value: bool | None = None) -> bool:
    true_ = ('true', '1', 't')  # Add more entries if you want, like: `y`, `yes`, `on`, ...
    false_ = ('false', '0', 'f')  # Add more entries if you want, like: `n`, `no`, `off`, ...
    value: str | None = environ.get(name, None)
    if value is None:
        if default_value is None:
            raise ValueError(f'Variable `{name}` not set!')
        else:
            value = str(default_value)
    if value.lower() not in true_ + false_:
        raise ValueError(f'Invalid value `{value}` for variable `{name}`')
    return value in true_