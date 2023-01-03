"""
Authors:
Eduardo Costa Martins

This module includes project items, as well as relationships between those items.

Relevant info:
@declarative_mixin : decorates a class as a sort of "abstract" class for tables
@declared_attr : certain special attributes need to be declared as functions when using mixins,
                 these are accessed as attributes though (not as functions)
"""

from src.models import db
from sqlalchemy import Column, Integer, String, Text, Boolean, Time, ForeignKey, Table, UniqueConstraint, DateTime, func
from sqlalchemy.orm import declarative_mixin, declared_attr, relationship, backref
from sqlalchemy.ext.associationproxy import association_proxy


@declarative_mixin
class ProjectItem():
    """
    Abstract class for all entities belonging to a project
    i.e. an item uniquely identified by the project id and its own id
    """

    # Declares existence of p_id : foreign key for project
    @declared_attr
    def p_id(cls):
        return Column(Integer, ForeignKey('project.id'), nullable=False)

    id = Column(Integer, primary_key=True)

    # Project that item belongs to
    # Backref automatically creates an attribute in project to access the items of this type
    @declared_attr
    def project(cls):
        return relationship('Project', backref=cls.__tablename__ + 's')


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
        return relationship(cls.change_class_name,
                            back_populates='item',
                            primaryjoin='and_({0}.id=={1}.i_id, {0}.p_id=={1}.p_id)'.format(cls.__name__,
                                                                                            cls.change_class_name))


class LabelType(ProjectItem, db.Model):
    __tablename__ = 'label_type'
    __table_args__ = (UniqueConstraint(
        'p_id', 'name', name='project_uniqueness'),)

    name = Column(String(64), nullable=False)

    # A list of labels that are of this type
    labels = relationship('Label', back_populates='label_type', lazy='dynamic')


class Artifact(ChangingItem, db.Model):
    __tablename__ = 'artifact'

    # The name (or some other identifier) of the file the artifact originated from
    identifier = Column(String(64), nullable=False)

    # The text data that the artifact carries
    data = Column(Text, nullable=False)

    # start and end characters of split (in the parent's data)
    # Null if this artifact was not split from anything
    start = Column(Integer)
    end = Column(Integer)

    # Attributes for splitting relationship
    # The id of the split source (null if this artifact did not originate from a split)
    parent_id = Column(Integer, ForeignKey('artifact.id'))
    # Children is list of artifacts created from split
    # backref creates a parent attribute which is the split source (as an Artifact object)
    children = relationship('Artifact',
                            backref=backref('parent', remote_side='[Artifact.p_id, Artifact.id]'))

    # Attributes for labelling relationship
    labellings = relationship('Labelling', back_populates='artifact')
    # The below attributes are to reduce intermediary access to labellings
    # Do NOT use them to query labellings
    # List of labels this artifact has
    labels = association_proxy('labellings', 'label')
    # List of users that have labelled this artifact
    users = association_proxy('labellings', 'user')

    # All highlights on this artifact
    highlights = relationship('Highlight', back_populates='artifact')


class Label(ChangingItem, db.Model):
    __tablename__ = 'label'
    __table_args__ = (UniqueConstraint(
        'p_id', 'name', name='project_uniqueness'),)

    name = Column(String(64), nullable=False)

    # The id of the label type this label corresponds to
    lt_id = Column(Integer, ForeignKey('label_type.id'), nullable=False)
    # The actual label type object this label corresponds to
    label_type = relationship('LabelType',
                              primaryjoin='and_(LabelType.p_id==Label.p_id, LabelType.id==Label.lt_id)',
                              back_populates='labels')
    # Description of meaning of label
    description = Column(Text, nullable=False)
    # Boolean for if the label was (soft) deleted (can be seen in history, but not used)
    deleted = Column(Boolean, default=False)

    # Attributes for merging relationship
    # The id of the label that this label was merged into (null if this label was not merged)
    child_id = Column(Integer, ForeignKey('label.id'))
    # Parents is a list of labels merged into this one
    # backref creates a child attribute which is the label that this label was merged into
    parents = relationship('Label',
                           backref=backref('child', remote_side='[Label.p_id, Label.id]'))

    # Attributes for labelling relationship
    labellings = relationship('Labelling', back_populates='label')
    # The below attributes are to reduce intermediary access to labellings
    # Do NOT use them to query labellings
    # Artifacts labelled with this label
    artifacts = association_proxy('labellings', 'artifact')
    # User that have used this label
    users = association_proxy('labellings', 'user')

    # Themes this label is assigned to
    themes = relationship('Theme',
                          secondary='label_to_theme',
                          primaryjoin='and_(Label.id==label_to_theme.c.l_id, Label.p_id==label_to_theme.c.p_id)',
                          back_populates='labels'
                          )


class Theme(ChangingItem, db.Model):
    __tablename__ = 'theme'
    __table_args__ = (UniqueConstraint(
        'p_id', 'name', name='project_uniqueness'),)

    name = Column(String(64), nullable=False)

    # Description of meaning of theme
    description = Column(Text)
    # Boolean for if the theme was (soft) deleted (can be seen in history, but not used)
    deleted = Column(Boolean, default=False)

    # Attributes for merging relationship
    # The id of the label that this label was merged into (null if this label was not merged)
    super_theme_id = Column(Integer, ForeignKey('theme.id'))
    # All sub themes
    # backref creates a super_theme attribute
    sub_themes = relationship('Theme',
                              backref=backref('super_theme', remote_side='[Theme.p_id, Theme.id]'),
                              lazy='dynamic')

    # Labels assigned to this theme
    labels = relationship('Label',
                          secondary='label_to_theme',
                          primaryjoin='and_(Theme.id==label_to_theme.c.t_id, Theme.p_id==label_to_theme.c.p_id)',
                          back_populates='themes',
                          lazy='dynamic')


class Labelling(db.Model):
    # Using this model requires a fair bit of input processing which (to my knowledge) cannot
    # be done so easily on the database side of things. See comments for necessary processing
    __tablename__ = 'labelling'

    # The id of the user that labelled the artifact
    # Input processing: you should check that the user is actually in this project
    u_id = Column(Integer, ForeignKey('user.id'), primary_key=True)
    # The id of the artifact that was labelled
    a_id = Column(Integer, ForeignKey('artifact.id'), primary_key=True)
    # The id of the label_type that the label belongs to
    # This was chosen as a primary key to enforce that the labels are all of different types
    # Input processing: you should check that every label type is used when adding labelling objects
    lt_id = Column(Integer, ForeignKey('label_type.id'), primary_key=True)
    # The id of the label that the artifact was labelled with
    # Input processing: you should check that lt_id of the label is the same as the lt_id in the labelling
    l_id = Column(Integer, ForeignKey('label.id'), nullable=False)
    # The id of the project that the label/artifact belong to
    # Input processing: you should check that label type, label, and artifact, are all from the same project
    p_id = Column(Integer, ForeignKey('project.id'), nullable=False)
    # Remark on why this label was chosen for this artifact
    remark = Column(Text)
    # How long it took the user to label this artifact
    time = Column(Time)

    # The user, artifact, label, and label_type objects corresponding to this relationship
    user = relationship('User', back_populates='labellings')
    artifact = relationship('Artifact',
                            primaryjoin='and_(Artifact.p_id==Labelling.p_id, Artifact.id==Labelling.a_id)',
                            back_populates='labellings')
    label = relationship('Label',
                         primaryjoin='and_(Label.p_id==Labelling.p_id, Label.id==Labelling.l_id)',
                         back_populates='labellings')
    # I may add a back_populates later, as it could be useful for statistics about a label type
    # No association proxies for this one as that would just be equivalent to project.label_types
    label_type = relationship('LabelType',
                              primaryjoin='and_(LabelType.p_id==Labelling.p_id, LabelType.id==Labelling.lt_id)')


class Highlight(db.Model):
    __tablename__ = 'highlight'

    # The id of the user that made the highlight
    u_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    # The id of the artifact that was highlighted
    a_id = Column(Integer, ForeignKey('artifact.id'), nullable=False)
    # The id of the project the artifact is in
    p_id = Column(Integer, ForeignKey('project.id'), nullable=False)

    id = Column(Integer, primary_key=True)
    # The start and end characters of this highlight
    start = Column(Integer, nullable=False)
    end = Column(Integer, nullable=False)

    # The user and artifact objects corresponding to this highlight
    user = relationship('User', back_populates='highlights')
    artifact = relationship('Artifact',
                            primaryjoin='and_(Highlight.p_id==Artifact.p_id, Highlight.a_id==Artifact.id)',
                            back_populates='highlights')


# Table to manage label to theme relationship
# A many to many theme to theme hierarchy would work a similar way
# If you wish to add other attributes, an association class should be used instead
label_to_theme = Table('label_to_theme', db.Model.metadata,
                       Column('p_id', Integer, ForeignKey('project.id')),
                       Column('t_id', Integer, ForeignKey(
                           'theme.id'), primary_key=True),
                       Column('l_id', Integer, ForeignKey(
                           'label.id'), primary_key=True)
                       )
