"""
Authors:
Eduardo Costa Martins

This module includes user related models.

Relevant info:
@declarative_mixin : decorates a class as a sort of "abstract" class for tables
@declared_attr : certain special attributes need to be declared as functions when using mixins,
                 these are accessed as attributes though (not as functions)
"""

from src.models import db
from sqlalchemy import Column, Integer, String, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy
from enum import Enum

class UserStatus(Enum):
    """
    Pending, approved, denied relate to the approval upon account creation
    Deleted refers to a soft deleted user, a stronger status than denied
    """
    pending = 0
    approved = 1
    denied = -1
    deleted = -2


class User(db.Model):

    __tablename__ = 'user'
    # auto_increment=True is default for integer primary key
    id = Column(Integer, primary_key=True)
    username = Column(String(32), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    email = Column(String(320), unique=True, nullable=False)
    # See UserStatus currently initializing to approved
    status = Column(db.Enum(UserStatus),
                    default=UserStatus.approved, nullable=False)
    # Personal description
    description = Column(Text, default="")
    # If the user is a super admin
    super_admin = Column(Boolean, default=False)

    # List of memberships the user is involved in
    memberships = relationship('Membership', back_populates='user')
    # List of projects the user is a part of
    projects = association_proxy('memberships', 'project')
    # List of labellings the user has made
    labellings = relationship('Labelling', back_populates='user')
    # List of labels the user has labelled an artifact with (for other changes, use label_changes)
    labels = association_proxy('labellings', 'label')
    # List of artifacts the user has labelled (for other changes, use artifact_changes)
    artifacts = association_proxy('labellings', 'artifact')
    # List of highlights the user has made
    highlights = relationship('Highlight', back_populates='user')