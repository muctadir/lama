from src.models import db, ma

class Project(db.Model):

    __tablename__ = 'project'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    description = db.Column(db.Text)
    # Criteria: Number of users that need to label an artifact for it to be considered completely labelled
    criteria = db.Column(db.Integer)
    # Frozen: Project can't be edited, but remains viewable
    frozen = db.Column(db.Boolean, default=False)
    # List of users in the project
    users = db.relationship('Membership', back_populates='project')
    
class Membership(db.Model):

    __tablename__ = 'membership'
    # id of project and user in relationship respectively
    pId = db.Column(db.ForeignKey('project.id'), primary_key=True)
    uId = db.Column(db.ForeignKey('user.id'), primary_key=True)
    # Admin: Whether or not the user is a project admin of the project
    admin = db.Column(db.Boolean, default=False)
    # Deleted: (Soft) deleted, the user is no longer part of a project
    #       but they remain in the system to view their changes
    deleted = db.Column(db.Boolean, default=False)
    # Project and user in the relationship
    project = db.relationship('Project', back_populates='users')
    user = db.relationship('User', back_populates='projects')

from src.models.auth_models import User

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