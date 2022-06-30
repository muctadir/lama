# Author: Linh Nguyen
# Author: Ana-Maria Olteniceanu

from src.conftest import RequestHandler
from src.routes.conflict_routes import nr_project_conflicts, nr_user_conflicts, project_conflicts
from collections import Counter
from pytest import raises
from src.exc import TestAuthenticationError

def test_nr_project_conflicts(app):
    with app.app_context():
        # Testing projects with conflicts
        assert nr_project_conflicts(1) == 11
        assert nr_project_conflicts(2) == 4
        # Testing projects without conflicts
        assert nr_project_conflicts(3) == 0
        assert nr_project_conflicts(4) == 0


def test_nr_user_conflicts(app):
    with app.app_context():
        # Testing projects with conflicts
        user_conflicts_1 = {2: 11, 3: 5, 6: 4, 11: 2}
        assert nr_user_conflicts(1) == user_conflicts_1
        user_conflicts_2 = {1: 2, 4: 4, 5: 2}
        assert nr_user_conflicts(2) == user_conflicts_2
        # Testing projects without conflicts
        assert nr_user_conflicts(3) == {}
        assert nr_user_conflicts(4) == {}

# Tests if project_conflicts returns what it should return
# when the project has conflicts and the current user is admin
def test_project_conflicts_admin_conflicts(app):
    with app.app_context():
        # Testing project with conflicts as admin
        response = project_conflicts(2, True, 2) 

        # Check that the number of conflicts is correct
        assert len(response) == 4
        
        # Check that the right artifacts are being returned
        assert Counter([item["a_id"] for item in response]) == Counter([36, 52, 54, 56])
        # Check that the retured artifact data is correct
        assert Counter([item["a_data"] for item in response]) == Counter([
            'A tri-county bee, Barry Benson, intends to sue the human race for stealing our honey, packaging it and profiting from it illegally! Tomorrow night on Bee Larry King, we\'ll have three former queens here in our studio, discussing their new book, Classy Ladies, out this week on Hexagon. Tonight we\'re talking to Barry Benson. Did you ever think, \\"I\'m a kid from the hive. I can\'t do this\\"? Bees have never been afraid to change the world. What about Bee Columbus? Bee Gandhi? Bee Jesus? Where I\'m from, we\'d never sue humans. We were thinking of stickball or candy stores. How old are you? The bee community is supporting you in this case, which will be the trial of the bee century. You know, they have a Larry King in the human world too. It\'s a common name. Next week... He looks like you and has a show and suspenders and colored dots... Next week... Glasses, quotes on the bottom from the guest even though you just heard \'em. Bear Week next week! They\'re scary, hairy and here live. Always leans forward, pointy shoulders, squinty eyes, very Jewish.',
            'They\'ve moved it to this weekend because all the flowers are dying. It\'s the last chance I\'ll ever have to see it. Vanessa, I just wanna say I\'m sorry. I never meant it to turn out like this. I know. Me neither. Tournament of Roses. Roses can\'t do sports. Wait a minute. Roses. Roses? Roses! Vanessa! Roses?! Barry? - Roses are flowers! - Yes, they are. Flowers, bees, pollen! I know. That\'s why this is the last parade. Maybe not. Could you ask him to slow down? Could you slow down? Barry! OK, I made a huge mistake. This is a total disaster, all my fault. Yes, it kind of is. I\'ve ruined the planet. I wanted to help you with the flower shop. I\'ve made it worse. Actually, it\'s completely closed down. I thought maybe you were remodeling. But I have another idea, and it\'s greater than my previous ideas combined. I don\'t want to hear it! All right, they have the roses, the roses have the pollen. I know every bee, plant and flower bud in this park. All we gotta do is get what they\'ve got back here with what we\'ve got.',
            '- It\'s part of me. I know. Just having some fun. Enjoy your flight. Then if we\'re lucky, we\'ll have just enough pollen to do the job. Can you believe how lucky we are? We have just enough pollen to do the job! I think this is gonna work. It\'s got to work. Attention, passengers, this is Captain Scott. We have a bit of bad weather in New York. It looks like we\'ll experience a couple hours delay. Barry, these are cut flowers with no water. They\'ll never make it. I gotta get up there and talk to them. Be careful. Can I get help with the Sky Mall magazine? I\'d like to order the talking inflatable nose and ear hair trimmer. Captain, I\'m in a real situation. - What\'d you say, Hal? - Nothing. Bee! Don\'t freak out! My entire species... What are you doing? - Wait a minute! I\'m an attorney! - Who\'s an attorney? Don\'t move. Oh, Barry. Good afternoon, passengers. This is your captain. Would a Miss Vanessa Bloome in 24B please report to the cockpit? And please hurry! What happened here? There was a DustBuster, a toupee, a life raft exploded.',
            'Just a minute. There\'s a bee on that plane. I\'m quite familiar with Mr. Benson and his no-account compadres. They\'ve done enough damage. But isn\'t he your only hope? Technically, a bee shouldn\'t be able to fly at all. Their wings are too small... Haven\'t we heard this a million times? \\"The surface area of the wings and body mass make no sense.\\" - Get this on the air! - Got it. - Stand by. - We\'re going live. The way we work may be a mystery to you. Making honey takes a lot of bees doing a lot of small jobs. But let me tell you about a small job. If you do it well, it makes a big difference. More than we realized. To us, to everyone. That\'s why I want to get bees back to working together. That\'s the bee way! We\'re not made of Jell-O. We get behind a fellow. - Black and yellow! - Hello! Left, right, down, hover. - Hover? - Forget hover. This isn\'t so hard. Beep-beep! Beep-beep! Barry, what happened?! Wait, I think we were on autopilot the whole time. - That may have been helping me. - And now we\'re not!'
        ])
        # Check that the retured label type id is correct
        assert Counter([item["lt_id"] for item in response]) == Counter([3, 3, 3, 3])
        # Check that the retured label type id is correct
        assert Counter([item["lt_name"] for item in response]) == Counter(['Ideas', 'Ideas', 'Ideas', 'Ideas'])
        # Check that the returned users lists are correct
        for i in range(4):
            # Get the expected list of users
            if i == 0 or i == 3:
                expected = [
                    {
                        'super_admin': True,
                        'description': 'Auto-generated super admin',
                        'id': 1,
                        'username': 'admin',
                        'status': 'approved',
                        'email': ''
                    },
                    {
                        'super_admin': False,
                        'description': 'test',
                        'id': 4,
                        'username': 'user3',
                        'status': 'approved',
                        'email': 'user3@test.com'
                    }]
            else:
                expected = [
                    {
                        'super_admin': False,
                        'description': 'test',
                        'id': 5,
                        'username': 'user4',
                        'status': 'approved',
                        'email': 'user4@test.com'
                    },
                    {
                        'super_admin': False,
                        'description': 'test',
                        'id': 4,
                        'username': 'user3',
                        'status': 'approved',
                        'email': 'user3@test.com'
                    }]

            # Check that the list of users has the same elements as the expected list
            assert [item for item in response[i]["users"] if item not in expected] == []
            assert [item for item in expected if item not in response[i]["users"]] == []

# Tests if project_conflicts returns what it should return
# when the project does not have conflicts and the current user is admin
def test_project_conflicts_admin_noConflicts(app):
    with app.app_context():
        # Testing project without conflicts as admin
        response = project_conflicts(3, True, 11)
        assert response == []

# Tests if project_conflicts returns what it should return
# when the project has conflicts and the current user is  not admin
def test_project_conflicts_notAdmin_conflicts(app):
    with app.app_context():
        # Testing project with conflicts as not admin, where user has conflicts
        response = project_conflicts(2, False, 5)

        # Check that the number of conflicts is correct
        assert len(response) == 2

        # Check that the right artifacts are being returned
        assert Counter([item["a_id"] for item in response]) == Counter([52, 54])
        # Check that the retured artifact data is correct
        assert Counter([item["a_data"] for item in response]) == Counter([
            'They\'ve moved it to this weekend because all the flowers are dying. It\'s the last chance I\'ll ever have to see it. Vanessa, I just wanna say I\'m sorry. I never meant it to turn out like this. I know. Me neither. Tournament of Roses. Roses can\'t do sports. Wait a minute. Roses. Roses? Roses! Vanessa! Roses?! Barry? - Roses are flowers! - Yes, they are. Flowers, bees, pollen! I know. That\'s why this is the last parade. Maybe not. Could you ask him to slow down? Could you slow down? Barry! OK, I made a huge mistake. This is a total disaster, all my fault. Yes, it kind of is. I\'ve ruined the planet. I wanted to help you with the flower shop. I\'ve made it worse. Actually, it\'s completely closed down. I thought maybe you were remodeling. But I have another idea, and it\'s greater than my previous ideas combined. I don\'t want to hear it! All right, they have the roses, the roses have the pollen. I know every bee, plant and flower bud in this park. All we gotta do is get what they\'ve got back here with what we\'ve got.',
            '- It\'s part of me. I know. Just having some fun. Enjoy your flight. Then if we\'re lucky, we\'ll have just enough pollen to do the job. Can you believe how lucky we are? We have just enough pollen to do the job! I think this is gonna work. It\'s got to work. Attention, passengers, this is Captain Scott. We have a bit of bad weather in New York. It looks like we\'ll experience a couple hours delay. Barry, these are cut flowers with no water. They\'ll never make it. I gotta get up there and talk to them. Be careful. Can I get help with the Sky Mall magazine? I\'d like to order the talking inflatable nose and ear hair trimmer. Captain, I\'m in a real situation. - What\'d you say, Hal? - Nothing. Bee! Don\'t freak out! My entire species... What are you doing? - Wait a minute! I\'m an attorney! - Who\'s an attorney? Don\'t move. Oh, Barry. Good afternoon, passengers. This is your captain. Would a Miss Vanessa Bloome in 24B please report to the cockpit? And please hurry! What happened here? There was a DustBuster, a toupee, a life raft exploded.',
            ])
        # Check that the retured label type id is correct
        assert Counter([item["lt_id"] for item in response]) == Counter([3, 3])
        # Check that the retured label type id is correct
        assert Counter([item["lt_name"] for item in response]) == Counter(['Ideas', 'Ideas'])
        # Check that the returned users lists are correct
        for i in range(2):
            # Get the expected list of users
            expected = [
                {
                    'super_admin': False,
                    'description': 'test',
                    'id': 5,
                    'username': 'user4',
                    'status': 'approved',
                    'email': 'user4@test.com'
                },
                {
                    'super_admin': False,
                    'description': 'test',
                    'id': 4,
                    'username': 'user3',
                    'status': 'approved',
                    'email': 'user3@test.com'
                }]

            # Check that the list of users has the same elements as the expected list
            assert [item for item in response[i]["users"] if item not in expected] == []
            assert [item for item in expected if item not in response[i]["users"]] == []
        
        # Testing project with conflicts as not admin, where user does not have conflicts
        response = project_conflicts(2, False, 3)
        assert response == []

# Tests if project_conflicts returns what it should return
# when the project does not have conflicts and the current user is not admin
def test_project_conflicts_notAdmin_noConflicts(app):
    with app.app_context():
        # Testing project with no conflicts as non-admin
        response = project_conflicts(3, False, 2)
        assert response == []

# Tests if the route /conflict/conflictmanagement throws an error
# id the user is not logged in
def test_conflict_management_page_noLogin(app, client):
    # Request handler
    request_handler = RequestHandler(app, client)

    # Make a request and check if the right error is thrown
    with raises(TestAuthenticationError):
        request_handler.get('/conflict/conflictmanagement', {'p_id': 1}, True)

# Tests if the route /conflict/conflictmanagement throws an error
# id the user does not have access to the project
def test_conflict_management_page_noProjectAccess(app, client):
    # Request handler
    request_handler = RequestHandler(app, client, 2)

    # Make a request to the database
    response = request_handler.get('/conflict/conflictmanagement', {'p_id': 4}, True)

    # Check that the right status code is returned
    assert response.status_code == 401

# Tests if the route conflict/conflictmanagement throws an error if not
# all params are given in request
def test_artifactmanagement_not_all_params(app, client):
    # Request handler
    request_handler = RequestHandler(app, client, 2)

    # Make request to the database without any args
    result = request_handler.get('/conflict/conflictmanagement', {}, True)
    # Checks if the right status code is returned
    assert result.status_code == 400

# Tests if the route /conflict/conflictmanagement returns the right information
# if the user is admin
def test_conflict_management_page_admin(app, client):
    with app.app_context():
        # Test if the function works on a project with conflicts
        conflictmanagement_help(app, client, 2, 1, project_conflicts(1, True, 2))

        # Test if the function works on a project without conflicts
        conflictmanagement_help(app, client, 11, 3, project_conflicts(3, True, 11))

# Tests if the route /conflict/conflictmanagement returns the right information
# if the user is not admin
def test_conflict_management_page_notAdmin(app, client):
    with app.app_context():
        # Test if the function works on a project with conflicts, when the user has conflicts
        conflictmanagement_help(app, client, 6, 1, project_conflicts(1, False, 6))

        # Test if the function works on a project with conflicts, when the user has no conflicts
        conflictmanagement_help(app, client, 7, 1, project_conflicts(1, False, 7))

        # Test if the function works on a project without conflicts
        conflictmanagement_help(app, client, 2, 3, project_conflicts(3, False, 2))

# Tests if the route /conflict/LabelPerUser throws an error
# id the user is not logged in
def test_single_label_per_user_noLogin(app, client):
    # Request handler
    request_handler = RequestHandler(app, client)

    # Make a request and check if the right error is thrown
    with raises(TestAuthenticationError):
        request_handler.get('/conflict/LabelPerUser', {'p_id': 1}, True)

# Tests if the route /conflict/LabelPerUser throws an error
# id the user does not have access to the project
def test_single_label_per_user_noProjectAccess(app, client):
    # Request handler
    request_handler = RequestHandler(app, client, 2)

    # Make a request to the database
    response = request_handler.get('/conflict/LabelPerUser', {'p_id': 4}, True)

    # Check that the right status code is returned
    assert response.status_code == 401

# Tests if the route conflict/LabelPerUser throws an error if not
# all params are given in request
def test_single_label_per_user_not_all_params(app, client):
    # Request handler
    request_handler = RequestHandler(app, client, 2)

    # Make request to the database without any args
    result = request_handler.get('/conflict/LabelPerUser', {}, True)
    # Checks if the right status code is returned
    assert result.status_code == 400

    # Make request to the database without p_id
    result = request_handler.get('/conflict/LabelPerUser', {'a_id': 1, 'lt_id': 1}, True)
    # Checks if the right status code is returned
    assert result.status_code == 400

    # Make request to the database without a_id
    result = request_handler.get('/conflict/LabelPerUser', {'p_id': 1, 'lt_id': 1}, True)
    # Checks if the right status code is returned
    assert result.status_code == 400

    # Make request to the database without lt_id
    result = request_handler.get('/conflict/LabelPerUser', {'p_id': 1, 'a_id': 1}, True)
    # Checks if the right status code is returned
    assert result.status_code == 400

# Tests if the route conflict/LabelPerUser returns the right information
# if the user is admin
def test_single_label_per_user_admin(app, client):
    # Test if the function works on an artifact with conflicts
    LabelPerUser_help(app, client, 2, 2, 36, 3, {
        "admin" : {
            "u_id": 1,
            "id": 23,
            "name": 'Fun idea',
            "description": 'fun idea',
            "lt_id": '3',
        },
        "user3" : {
            "u_id": 4,
            "id": 24,
            "name": 'Boring idea',
            "description": 'boring',
            "lt_id": '3',
        }})

    # Test if the function works on an artifact without conflicts
    LabelPerUser_help(app, client, 2, 2, 15, 3, {
        "user4": {
            "u_id": 5,
            "id": 24,
            "name": 'Boring idea',
            "description": 'boring',
            "lt_id": '3'
        }
    })

# Tests if the route conflict/LabelPerUser returns the right information
# if the user is not admin
def test_single_label_per_user_notAdmin(app, client):
    # Test if the function works on an artifact with conflicts
    LabelPerUser_help(app, client, 4, 2, 36, 3, {
        "admin" : {
            "u_id": 1,
            "id": 23,
            "name": 'Fun idea',
            "description": 'fun idea',
            "lt_id": '3',
        },
        "user3" : {
            "u_id": 4,
            "id": 24,
            "name": 'Boring idea',
            "description": 'boring',
            "lt_id": '3',
        }})

    # Test if the function works on an artifact without conflicts
    LabelPerUser_help(app, client, 5, 2, 15, 3, {
        "user4": {
            "u_id": 5,
            "id": 24,
            "name": 'Boring idea',
            "description": 'boring',
            "lt_id": '3'
        }
    })

"""
Helper function to perform tests for /conflictmanagement
@param app: app for the test
@param client: client for the test
@param u_id: id of the current user
@param p_id: id of the current project
@param expected: the expected response from calling the route
"""
def conflictmanagement_help(app, client, u_id, p_id, expected):
    # Request handler
    request_handler = RequestHandler(app, client, u_id)

    with app.app_context():
        # Make the request to the database
        response = request_handler.get('/conflict/conflictmanagement', {'p_id': p_id}, True)

        # Check that the response is the same as expected
        assert response.json == expected

"""
Helper function to perform tests for /LabelPerUser
@param app: app for the test
@param client: client for the test
@param u_id: id of the current user
@param p_id: id of the current project
@param a_id: id of the current artifact
@param lt_id: id of the current label type
@param expected: the expected response from calling the route
"""
def LabelPerUser_help(app, client, u_id, p_id, a_id, lt_id, expected):
    # Request handler
    request_handler = RequestHandler(app, client, u_id)

    with app.app_context():
        # Make the request to the database
        response = request_handler.get('/conflict/LabelPerUser', {
            'p_id': p_id,
            'a_id': a_id,
            'lt_id': lt_id}, True)

        # Check that the response is the same as expected
        assert response.json.keys() == expected.keys()
        for entry in response.json:
            
            assert response.json[entry] == expected[entry]
