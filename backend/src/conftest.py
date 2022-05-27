from pytest import fixture
from src import create_app
from src import db
from src.models.auth_models import User, UserStatus
from src.models.item_models import Artifact
from src.models.project_models import Project, Membership

@fixture
def app():
    app = create_app({'TESTING': True})

    # Make mock data for testing
    # Create some new users
    for i in range(3):
        user = User(username = "User" + str(i),
            password = "idkman",
            email = "someemail" + str(i) + "@gmail.com",
            status = UserStatus.approved,
            description = "something"
            )

        db.session.add(user)
        db.session.commit()

    # Make some projects
    for i in range(4):
        project = Project(name = "Project " + str(i),
            description = "something",
            criteria = 1,
            frozen = i % 2 == 0
            )

        db.session.add(project)
        db.session.commit()

    # Get lists of the ids of all users and projects
    user_ids = [id for id in db.session.query(User.id)]
    project_ids = [id for id in db.session.query(Project.id)]

    # Make relationships between the users and the projects
    for u in range(3):
        for p in range(4):
            # Get the user and the project that are part of this membership
            this_user = User.get(user_ids[u])
            this_project = Project.get(project_ids[p])

            # Create the membership
            membership = Membership(pId = this_project.id,
                uId = this_user.id,
                admin = (u == 0 and p < 2) or (u == 1 and p > 1),
                deleted = p == 3,
                project = [this_project],
                user = [this_user]
                )

            db.session.add(membership)
            db.session.commit()

            # Make artifacts for this project
            for a in range(2):
                artifact = Artifact(p_id = this_project.id,
                    name = "Artifact " + str(a),
                    project = this_project,
                    identifier = 'Something',
                    data = "blablahblahblah",
                    completed = a == 0)

                db.session.add(artifact)
                db.session.commit()

    yield app
    # Tear-down goes here.
    # TODO: Delete migrations folder

@fixture
def client(app):
    return app.test_client()

@fixture
def runner(app):
    return app.test_cli_runner()