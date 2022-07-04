"""
Authors: Eduardo Costa Martins

This file contains exceptions we use for the app
"""

# The parser for the changelogs tried to parse a change that was incorrectly formatted
class ChangeSyntaxError(Exception):
    # Pass
    pass

# Theme cycle class
class ThemeCycleDetected(Exception):

    # This number represents the error code for recursion limit in a MySQLdb database.
    MySQLdb = 3636
    # This number represents the error code for recursion limit in a MariaDB database.
    MariaDB = 1456

# The programmer tried testing a route that requires being authenticated, 
# without simulating authentication
class HandlerAuthenticationError(Exception):
    # Pass
    pass