from src import db, ma # need this in every model
from flask_login import UserMixin

class User(UserMixin, db.Model):
    # TODO: Handle `approved` using Flask-Principal?
    __tablename__ = "Users"
    id = db.Column(db.Integer, primary_key=True) # auto_increment=True is default for integer primary key
    username = db.Column(db.String(32), unique=True)
    password = db.Column(db.String(128))
    email = db.Column(db.String(320), unique=True)
    approved = db.Column(db.Integer) # Approved by super-admin -1 => denied, 0 => pending, 1 => approved
    description = db.Column(db.Text) # Personal description

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_fk = True # Include foreign keys (not useful now, but maybe later)