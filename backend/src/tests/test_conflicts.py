# Author: Linh Nguyen
from src.routes.conflict_routes import nr_project_conflicts, nr_user_conflicts, project_conflicts

def test_nr_project_conflicts(app):
    with app.app_context():
        #Testing projects with conflicts
        assert nr_project_conflicts(1) == 11
        assert nr_project_conflicts(2) == 4
        #Testing projects without conflicts
        assert nr_project_conflicts(3) == 0
        assert nr_project_conflicts(4) == 0

def test_nr_user_conflicts(app):
    with app.app_context():
        #Testing projects with conflicts
        user_conflicts_1 = {2: 11, 3: 5, 6: 4, 11: 2}
        assert nr_user_conflicts(1) == user_conflicts_1
        user_conflicts_2 = {1: 2, 4: 4, 5: 2}
        assert nr_user_conflicts(2) == user_conflicts_2
        #Testing projects without conflicts
        assert nr_user_conflicts(3) == {}
        assert nr_user_conflicts(4) == {}