from src import db, ma
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

    # TODO: Handle `approved` using Flask-Principal?
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True) # auto_increment=True is default for integer primary key
    username = db.Column(db.String(32), unique=True)
    password = db.Column(db.String(128))
    email = db.Column(db.String(320), unique=True)
    status = db.Column(db.Enum(UserStatus), default=UserStatus.pending) # See UserStatus
    description = db.Column(db.Text) # Personal description
    projects = db.relationship('Membership', back_populates='user')

    # The discriminator column for the subtypes
    type = db.Column(db.String(32))
    # Enables polymorphic loading
    __mapper_args__ = {
        'polymorphic_identity':'user',
        'polymorphic_on':type
    }

class SuperAdmin(User):

    __tablename__ = 'super_admin'
    id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    # Add more data to super admin class if ever needed:

    __mapper_args__ = {
        'polymorphic_identity':'super_admin',
    }

# Note: This is a circular import, but not a circular dependency so nothing breaks
# i.e., do not use this package at the top level
from src.models.project_models import Membership

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