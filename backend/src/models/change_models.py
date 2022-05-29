"""
Authors:
Eduardo Costa Martins
"""

from src.models import db, ma
from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import declarative_mixin, declared_attr, relationship
from src.app_util import AppUtil

# TODO: Enforce Change to be abstract

def create_change_table(cls):
    """
    For a ChangingItem with name 'Item' and table name 'item', this function is a class factory.
    It returns a concrete Change class with name 'ItemChange' and table name 'item_change'.
    This allows us to automatically create all the changelog tables for the items,
    since all classes inheriting db.Model create a table.
    """

    # type function can create classes
    return type(cls.__name__ + 'Change',  # class name
            (Change, db.Model),  # base classes
            {'__tablename__': cls.__tablename__ + '_change'})  # added attributes/methods

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
        return Column(Integer, ForeignKey('user.id'), primary_key=True)
    
    # user : User object corresponding to user that made the change
    @declared_attr
    def user(cls):
        # backref creates <item>.changes attribute in user containing list of changes the user made
        # for this type of item
        return relationship('User', backref=cls.__tablename__ + 's')
    
    # p_id : project id that the item belongs to
    @declared_attr
    def p_id(cls):
        return Column(Integer, ForeignKey('project.id'), primary_key=True)
    # i_id : item id that was changed
    @declared_attr
    def i_id(cls):
        return Column(Integer,
                ForeignKey(cls.item_table_name + '.id'),
                primary_key=True)
    
    # item : Item object corresponding to item that was changed
    @declared_attr
    def item(cls):
        # Somehow SQLAlchemy does not understand how to join two pairs of foreign keys
        # So we have to spell it out for it in primary join
        return relationship(cls.item_class_name, 
                back_populates='changes',
                primaryjoin='and_({0}.id=={1}.i_id, {0}.p_id=={1}.p_id)'.format(cls.item_class_name, cls.__name__))
    
    # id : the nth change made to this item
    id = Column(Integer, primary_key=True)

    # TODO: Enum for ChangeType
    # Date and time when change was made
    timestamp = Column(DateTime)
    
from src.models.item_models import ChangingItem

# TODO: Should make sure subclasses are not abstract before creating changelog for them
#       or alternatively, make sure they inherit db.Model
Changes = [create_change_table(changing_item) for changing_item in AppUtil.get_all_subclasses(ChangingItem)]

# TODO: Find a way to make a schema for the changes.
# Problem: Using Change as model gives error since it does not have mapper,
#       since it does not inherit db.Model
# Idea: Use Abstract Concrete Class for Change so that it does inherit db.Model.
# Problem with this idea is that it is hard