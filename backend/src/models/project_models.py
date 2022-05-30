"""
Authors:
Eduardo Costa Martins

This module includes project related models.

Relevant info:
@declarative_mixin : decorates a class as a sort of "abstract" class for tables
@declared_attr : certain special attributes need to be declared as functions when using mixins,
                 these are accessed as attributes though (not as functions)
"""

from src.models import db, ma
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy

class Project(db.Model):

    __tablename__ = 'project'
    id = Column(Integer, primary_key=True)
    name = Column(String(64))
    description = Column(Text)
    # Criteria: Number of users that need to label an artifact for it to be considered completely labelled
    criteria = Column(Integer)
    # Frozen: Project can't be edited, but remains viewable
    frozen = Column(Boolean, default=False)
    # List of memberships this project is associated with
    memberships = relationship('Membership', back_populates='project')
    # List of users in the project
    users = association_proxy('memberships', 'user',
            creator=lambda user: Membership(u_id=user["u_id"], admin=user["admin"]))
    
class Membership(db.Model):

    __tablename__ = 'membership'
    # id of project and user in relationship respectively
    p_id = Column(ForeignKey('project.id'), primary_key=True)
    u_id = Column(ForeignKey('user.id'), primary_key=True)
    # Admin: Whether or not the user is a project admin of the project
    admin = Column(Boolean, default=False)
    # Deleted: (Soft) deleted, the user is no longer part of a project
    #       but they remain in the system to view their changes
    deleted = Column(Boolean, default=False)
    # Project and user in the relationship
    project = relationship('Project', back_populates='memberships')
    user = relationship('User', back_populates='memberships')

from src.models.auth_models import User
from src.models.item_models import Labelling

class ProjectSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = Project
        include_fk = True
        load_instance = True

class MembershipSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = Membership
        include_fk = True
        load_instance = True