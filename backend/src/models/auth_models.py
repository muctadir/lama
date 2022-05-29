"""
Authors:
Eduardo Costa Martins

This module includes user related models.

Relevant info:
@declarative_mixin : decorates a class as a sort of "abstract" class for tables
@declared_attr : certain special attributes need to be declared as functions when using mixins,
                 these are accessed as attributes though (not as functions)
"""

from src.models import db, ma # need this in every model
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from flask_login import UserMixin
from enum import Enum
from marshmallow import fields

class UserStatus(Enum):
    """
    Pending, approved, denied relate to the approval upon account creation
    Deleted refers to a soft deleted user, a stronger status than denied
    """
    pending = 0
    approved = 1
    denied = -1
    deleted = -2

class User(UserMixin, db.Model):

    # TODO: Handle `status` using Flask-Principal?
    __tablename__ = 'user'
    # auto_increment=True is default for integer primary key
    id = Column(Integer, primary_key=True) 
    username = Column(String(32), unique=True)
    password = Column(String(128))
    email = Column(String(320), unique=True)
    # See UserStatus
    status = Column(db.Enum(UserStatus), default=UserStatus.pending)
    # Personal description
    description = Column(Text) 
    # List of projects the user is a part of
    projects = relationship('Membership', back_populates='user')
    # List of labellings the user has made
    labellings = relationship('Labelling', back_populates='user')

    # The discriminator column for the subtypes
    type = Column(String(32))
    # Enables polymorphic loading
    __mapper_args__ = {
        'polymorphic_identity':'user',
        'polymorphic_on':type
    }

class SuperAdmin(User):
    """
    All super admins are also included in the user table.
    """

    __tablename__ = 'super_admin'
    id = Column(Integer, ForeignKey('user.id'), primary_key=True)

    # Add more data to super admin class if ever needed:

    __mapper_args__ = {
        'polymorphic_identity':'super_admin',
    }

# Note: This is a circular import, but not a circular dependency so nothing breaks
# i.e., do not use this package at the top level
from src.models.project_models import Membership
from src.models.item_models import Labelling

class UserSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = User
        include_fk = True # Include foreign keys (not useful now, but maybe later)
        load_instance = True
    
    # Enum fields are not automatically serialized/deserialized
    status = fields.Method("get_approval", deserialize="load_approval")
    # The functions below describe how to serialize/deserialize enums
    def get_approval(self, obj):
        return obj.type
    
    def load_approval(self, value):
        return UserStatus[value]

class SuperAdminSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = SuperAdmin
        include_fk = True
        load_instance = True