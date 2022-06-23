"""
Authors: Eduardo Costa Martins

This file contains exceptions we use for the app
"""

class ChangeSyntaxError(Exception):
    pass

class ThemeCycleDetected(Exception):

    # This number represents the error code for recursion limit in a MySQLdb database.
    MySQLdb = 3636
    # This number represents the error code for recursion limit in a MariaDB database.
    MariaDB = 1456
