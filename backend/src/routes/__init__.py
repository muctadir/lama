"""
This package contains submodules for all routes used by the app (as well as Docker)
"""

# Declares the submodules of this package
__all__ = [
    # Authentication routes
    'auth_routes',
    # Docker (and other utility) routes
    'util_routes',
    'project_routes',
    'label_routes',
    'label_type_routes',
    'labelling_routes',
    'account_routes',
    'theme_routes',
    'artifact_routes',
    'conflict_routes',
    # Routes for getting the change history of items
    'change_routes'
]