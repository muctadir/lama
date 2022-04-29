from src import db, ma

class User(db.Model): # Obviously needs to be fleshed out
    __tablename__ = "Users"
    id = db.Column(db.Integer, primary_key=True) # auto_increment=True is default for integer primary key
    username = db.Column(db.String(32))
    password = db.Column(db.String(64))

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_fk = True # Include foreign keys (not useful now, but maybe later)