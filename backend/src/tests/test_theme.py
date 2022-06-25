import json
from sqlalchemy import null, select
from src import db
from src.conftest import RequestHandler
from src.app_util import check_args

def test_theme_management_info(app, client):

    # Tests are for user 1
    request_handler = RequestHandler(app, client, 1)

    # Using db requires app context
    with app.app_context():
        # When p_id is not given
        response = request_handler.get("/theme/theme-management-info", { "": "" }, True)
        assert response.status_code == 400

        # All themes for project 1
        theme_info = [{
                "id": 1,
                "name": "Positive emotions",
                "description": "These are positive emotions",
                "deleted": False,
                "super_theme_id": None,
                "p_id": 1
            }, {
                "id": 2,
                "name": "Negative emotions",
                "description": "These are negative emotions",
                "deleted": False,
                "super_theme_id": None,
                "p_id": 1
            }, {
                "id": 3,
                "name": "Backend technology",
                "description": "These are backend technologies",
                "deleted": False,
                "super_theme_id": None,
                "p_id": 1
            }, {
                "id": 4,
                "name": "Frontend technologies",
                "description": "These are frontend technologies",
                "deleted": False,
                "super_theme_id": None,
                "p_id": 1
            }, {
                "id": 5,
                "name": "Technology",
                "description": "This is technology",
                "deleted": False,
                "super_theme_id": None,
                "p_id": 1
            }, {
                "id": 6,
                "name": "Neutral emotions",
                "description": "These are neurtal emotions",
                "deleted": False,
                "super_theme_id": None,
                "p_id": 1
            }, {
                "id": 7,
                "name": "Databse technology",
                "description": "These are database technologies",
                "deleted": False,
                "super_theme_id": 3,
                "p_id": 1
            }]
        print(theme_info[2])
        response = request_handler.get("/theme/theme-management-info", { "p_id": "1" }, True)
        print(response.json[0]['theme'])
        print(response.json[0] == theme_info[2])
        assert response.status_code == 200
        for single_response in response.json:
            assert single_response['theme'] in theme_info