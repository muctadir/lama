"""
Authors:
Eduardo Costa Martins

This module includes changelogs for all the items (or rather, all the code to generate them).
Example on how to use Change classes:

# This gets the Change class for the item (in case you want to query)
# Note this is not an instance of the class
artifact_change = Artifact.__change__
# This gets the schema class for that change and instantiates it
artifact_change_schema = artifact_change.__marshmallow__()
# Now to use it you could for example do:
changes = artifact_change.query.all()
json = jsonify(artifact_change_schema.dump(changes, many=True))

Relevant info:
@declarative_mixin : decorates a class as a sort of "abstract" class for tables
@declared_attr : certain special attributes need to be declared as functions when using mixins,
                 these are accessed as attributes though (not as functions)
"""

from src.models import db
from sqlalchemy import Column, Integer, DateTime, Text, ForeignKey, func
from sqlalchemy.orm import declarative_mixin, declared_attr, relationship
from src.app_util import get_all_subclasses
from enum import Enum

def create_change_table(cls):
    """
    For a ChangingItem with name 'Item' and table name 'item', this function is a class factory.
    It returns a concrete Change class with name 'ItemChange' and table name 'item_change'.
    This allows us to automatically create all the changelog tables for the items,
    since all classes inheriting db.Model create a table.
    """
    # type function can create classes
    change_class = type(
        cls.__name__ + 'Change',  # Class name
        (Change, db.Model),  # Base classes
        {'__tablename__': cls.__tablename__ + '_change',
         '__item_class__': cls}  # Added attributes/methods
    )
    setattr(cls, "__change__", change_class)
    return change_class

def create_change_tables():
    """
    Creates a change_table for each type of item that should have a change table
    """

    from src.models.item_models import ChangingItem
    
    # Go through all changing items
    for changing_item in get_all_subclasses(ChangingItem):
        
        # Having the `__tablename__` attribute is an easy way to check if a model is concrete (not abstract)
        if hasattr(changing_item, '__tablename__'):
            create_change_table(changing_item)

class ChangeType(Enum):
    """
    An enum describing the type of change that was made.
    Note that we use the same enum for all subclasses, despite the fact that not all changes can
    be done to all item types (e.g., you cannot split a label).
    We use an enum to allow the tool to filter on the type of change
    The description attribute of a Change class should be parsed based on its change type
    """
    # Creation
    create = 0
    # Editting a name
    name = 1
    # Editting the description
    description = 2
    # Splitting an artifact
    split = 3
    # Merging a label
    merge = 4
    # Changing subthemes or labels of a theme
    theme_children = 5
    # Labelled
    labelled = 6
    # Soft deleted
    deleted = 7


# For project-wide history, consider changing this to an Abstract Concrete Class
# See: https://docs.sqlalchemy.org/en/14/orm/inheritance.html#abstract-concrete-classes
# This way one can query this class and receive all changes, instead of changes linked to a specific item
@declarative_mixin
class Change():
    """
    The Changelog base class. We call this class change because an instance represents
    a single change, not a log of changes.
    A table is created by the declaration of a class. All changelogs are the same, but
    require different tables. Thus we dynamically create subclasses of this class,
    only changing the __tablename__ attribute, and inheriting from db.Model (which
    is required for the table to be created).
    End result: each ChangingItem automatically has a changelog table/class created.
    """

    # Removes 'Change' part from class name
    @declared_attr
    def item_class_name(cls):
        return cls.__name__[:-6]

    # Removes '_change' part from table name
    @declared_attr
    def item_table_name(cls):
        return cls.__tablename__[:-7]

    # u_id : user id that made the change
    @declared_attr
    def u_id(cls):
        return Column(Integer, ForeignKey('user.id'), nullable=False)

    # user : User object corresponding to user that made the change
    @declared_attr
    def user(cls):
        # backref creates <item>.changes attribute in user containing list of changes the user made
        # for this type of item
        return relationship('User', backref=cls.__tablename__ + 's')

    # p_id : project id that the item belongs to
    @declared_attr
    def p_id(cls):
        return Column(Integer, ForeignKey('project.id'), nullable=False)
    # i_id : item id that was changed

    @declared_attr
    def i_id(cls):
        return Column(Integer,
                      ForeignKey(cls.item_table_name + '.id'),
                      nullable=False)

    # item : Item object corresponding to item that was changed
    @declared_attr
    def item(cls):
        # Somehow SQLAlchemy does not understand how to join two pairs of foreign keys
        # So we have to spell it out for it in primary join
        return relationship(cls.item_class_name,
                            back_populates='changes',
                            primaryjoin='and_({0}.id=={1}.i_id, {0}.p_id=={1}.p_id)'.format(cls.item_class_name, cls.__name__))

    id = Column(Integer, primary_key=True)

    # What kind of change is made? This exists for filtering and parsing
    change_type = Column(db.Enum(ChangeType), nullable=False)
    # A description of the change that was made. This should be parsed based on change_type
    description = Column(Text)
    # The name used for the item that was changed (before the change)
    name = Column(Text, nullable=False)

    # Date and time when change was made
    timestamp = Column(DateTime, default=func.now())

create_change_tables()