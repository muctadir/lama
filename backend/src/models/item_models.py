from src.models import db, ma
from sqlalchemy.orm import declarative_mixin, declared_attr
from src.app_util import AppUtil
# Abstract Base Class, inheriting this makes a class abstract
from abc import ABC
# TODO: Enforce ProjectItem, ChangingItem and Change to be abstract

"""
This module includes project items, as well as relationships between those items.
This includes changelogs as well.
Note: the above is subject to change, if this file gets too large

Relevant info:
@declarative_mixin : decorates a class as a sort of "abstract" class for tables
@declared_attr : certain special attributes need to be declared as functions when using mixins
"""

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
class ProjectItem():
    """
    Abstract class for all entities belonging to a project
    i.e. an item uniquely identified by the project id and its own id
    """

    # Declares existence of p_id : foreign key for project
    @declared_attr
    def p_id(cls):
        return db.Column(db.Integer, db.ForeignKey('project.id'), primary_key=True)

    # id within project
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))

    # Project that item belongs to
    @declared_attr
    def project(cls):
        return db.relationship('Project')

@declarative_mixin
class ChangingItem(ProjectItem):
    """
    Abstract class ChangingItem is a ProjectItem that maintains a changelog.
    The changelog classes are automatically constructed with a name based on the name
    of the concrete ChangingItem subclass. See create_change_table() for this.
    Thus, we can automatically create a relationship with a ChangingItem and its
    changelog (since we know the changelog class name ahead of time)
    """

    @declared_attr
    def change_class_name(cls):
        return cls.__name__ + 'Change'
    
    @declared_attr
    def change_table_name(cls):
        return cls.__tablename__ + '_change'

    @declared_attr
    def changes(cls):
        # Somehow SQLAlchemy does not understand how to join two pairs of foreign keys
        # So we have to spell it out for it in primary join
        return db.relationship(cls.change_class_name, 
                back_populates='item',
                primaryjoin='and_({0}.id=={1}.i_id, {0}.p_id=={1}.p_id)'.format(cls.__name__, cls.change_class_name))

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
    # TODO: Use __table__args__ and ForeignKeyConstraint to specify join condition instead of primaryjoin

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
        return db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    
    # user : User object corresponding to user that made the change
    @declared_attr
    def user(cls):
        # backref creates <item>.changes attribute in user containing list of changes the user made
        # for this type of item
        return db.relationship('User', backref=cls.__tablename__ + 's')
    
    # p_id : project id that the item belongs to
    @declared_attr
    def p_id(cls):
        return db.Column(db.Integer, 
                db.ForeignKey(cls.item_table_name + '.p_id'), 
                primary_key=True)
    # i_id : item id that was changed
    @declared_attr
    def i_id(cls):
        return db.Column(db.Integer,
                db.ForeignKey(cls.item_table_name + '.id'),
                primary_key=True)
    
    # item : Item object corresponding to item that was changed
    @declared_attr
    def item(cls):
        # Somehow SQLAlchemy does not understand how to join two pairs of foreign keys
        # So we have to spell it out for it in primary join
        return db.relationship(cls.item_class_name, 
                back_populates='changes',
                primaryjoin='and_({0}.id=={1}.i_id, {0}.p_id=={1}.p_id)'.format(cls.item_class_name, cls.__name__))
    
    # id : the nth change made to this item
    id = db.Column(db.Integer, primary_key=True)

    # TODO: Enum for ChangeType
    # Date and time when change was made
    timestamp = db.Column(db.DateTime)

class LabelType(ProjectItem, db.Model):

    __tablename__ = 'label_type'
    # A list of labels that are of this type
    labels = db.relationship('Label', back_populates='label_type')

class Artifact(ChangingItem, db.Model):

    __tablename__ = 'artifact'
    # The name (or some other identifier) of the file the artifact originated from
    identifier = db.Column(db.String(64))
    # The qualitative data that the artifact carries
    # TODO: Consider using LargeBinary as data type
    data = db.Column(db.Text)
    # TODO: Enum DataType (I don't want to deal with this now)
    completed = db.Column(db.Boolean, default=False)
    # TODO: Relationship with User and Label
    # The id of the split source (null if this artifact did not originate from a split)
    parent_id = db.Column(db.Integer, db.ForeignKey('artifact.id'))
    # Children is list of artifacts created from split
    # backref creates a parent attribute which is the split source (as an Artifact object)
    children = db.relationship('Artifact', 
            backref=db.backref('parent', remote_side='[Artifact.p_id, Artifact.id]'))
    # start and end position of split TODO: Use association table?
    # also, how will this work with other kinds of data?
    start = db.Column(db.Integer)
    end = db.Column(db.Integer)

class Label(ChangingItem, db.Model):

    __tablename__ = 'label'
    # The id of the label type this label corresponds to
    lt_id = db.Column(db.Integer, db.ForeignKey('label_type.id'))
    # The actual label type object this label corresponds to
    label_type = db.relationship('LabelType', back_populates='labels')
    # Description of meaning of label
    desc = db.Column(db.Text)
    # Boolean for if the label was (soft) deleted (can be seen in history, but not used)
    deleted = db.Column(db.Boolean, default=False)
    # TODO: Relationship with User and Artifact
    # Parents is a list of labels merged into this one
    # backref creates a child attribute which is the label that this label was merged into
    parents = db.relationship('Label',
            backref=db.backref('child', remote_side='[Label.p_id, Label.id]'))

class Theme(ChangingItem, db.Model):

    __tablename__ = 'theme'
    # Description of meaning of theme
    desc = db.Column(db.Text)
    # Boolean for if the theme was (soft) deleted (can be seen in history, but not used)
    deleted = db.Column(db.Boolean, default=False)

# TODO: Should make sure subclasses are not abstract before creating changelog for them
#       or alternatively, make sure they inherit db.Model
Changes = [create_change_table(changing_item) for changing_item in AppUtil.get_all_subclasses(ChangingItem)]

# Note: This is a circular import, but not a circular dependency so nothing breaks
# i.e., do not use this package at the top level
from src.models.auth_models import User

class LabelTypeSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = LabelType
        include_fk = True
        load_instance = True

class ArtifactSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = Artifact
        include_fk = True
        load_instance = True

class LabelSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = Label
        include_fk = True
        load_instance = True

# TODO: Find a way to make a schema for the changes.
# Problem: Using Change as model gives error since it does not have mapper,
#       since it does not inherit db.Model
# Idea: Use Abstract Concrete Class for Change so that it does inherit db.Model.
# Problem with this idea is that it is hard