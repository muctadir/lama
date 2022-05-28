from src.models import db, ma
from sqlalchemy.orm import declarative_mixin, declared_attr
# Abstract Base Class, inheriting this makes a class abstract
from abc import ABC
# TODO: Enforce ProjectItem, ChangingItem to be abstract

"""
This module includes project items, as well as relationships between those items.
This includes changelogs as well.
Note: the above is subject to change, if this file gets too large

Relevant info:
@declarative_mixin : decorates a class as a sort of "abstract" class for tables
@declared_attr : certain special attributes need to be declared as functions when using mixins
"""

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
    # The id of the label that this label was merged into (null if this label was not merged)
    child_id = db.Column(db.Integer, db.ForeignKey('label.id'))
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

class Labelling(db.Model):

    __tablename__ = 'labelling'
    # The id of the user that labelled the artifact
    u_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    # The id of the artifact that was labelled
    a_id = db.Column(db.Integer, db.ForeignKey('artifact.id'), primary_key=True)
    # The id of the label that the artifact was labelled with
    l_id = db.Column(db.Integer, db.ForeignKey('label.id'), primary_key=True)
    # The id of the project that the label/artifact belong to
    p_id = db.Column(db.Integer, db.ForeignKey('project.id'), primary_key=True)
    # Remark on why this label was chosen for this artifact
    remark = db.Column(db.Text)
    # When this artifact was labelled
    timestamp = db.Column(db.DateTime)
    # TODO: Add relationships, and consider backref

# Note: This is a circular import, but not a circular dependency so nothing breaks
# i.e., do not use this package at the top level
from src.models.auth_models import User
# Changes is a list with all the Change classes
from src.models.change_models import Changes

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

class ThemeSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = Theme
        include_fk = True
        load_instance = True

class LabellingSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = Labelling
        include_fk = True
        load_instance = True