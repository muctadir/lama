"""
Authors:
Eduardo Costa Martins
"""

from src.models import db, ma
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship

class Project(db.Model):

    __tablename__ = 'project'
    id = Column(Integer, primary_key=True)
    name = Column(String(64))
    description = Column(Text)
    # Criteria: Number of users that need to label an artifact for it to be considered completely labelled
    criteria = Column(Integer)
    # Frozen: Project can't be edited, but remains viewable
    frozen = Column(Boolean, default=False)
    # List of users in the project
    users = relationship('Membership', back_populates='project')
    
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
    project = relationship('Project', back_populates='users')
    user = relationship('User', back_populates='projects')

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