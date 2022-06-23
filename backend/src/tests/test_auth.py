from sqlalchemy import select
from src import db
from src.models.auth_models import User, UserStatus
from src.routes.auth_routes import check_format, taken
from werkzeug.security import check_password_hash
from jwt import decode

# TODO: Test check_format() seperately

def test_register(client, app):

    return

    with app.app_context():
        
        entry = db.session.scalar(select(User).where(User.username == "Eduardo"))
        assert not entry

        response = client.post('/auth/register', json={
            'username': "Eduardo",
            'email': "god_level@programmer.com",
            'password' : "secure-password",
            'passwordR' : "secure-password",
            'description' : "Help, how do I get out of here?"
        })

        assert response.status_code == 201

        entry = db.session.scalar(select(User).where(User.username == "Eduardo"))

        assert entry.username == "Eduardo"
        assert check_password_hash(entry.password, "secure-password")
        assert entry.email == "god_level@programmer.com"
        assert entry.description == "Help, how do I get out of here?"
        assert entry.status == UserStatus.pending

def test_login(client, app):
    
    u_id = 2
    login_details = {
        'username': "user1",
        'password': "TESTUSER123"
    }
    response = client.post('/auth/login', json=login_details)
    print(response.text)
    assert response.status_code == 200
    assert response.text == "Success"
    assert response.headers.get('Access-Control-Expose-Headers') == 'Content-Encoding, u_id_token'
    u_id_token = response.headers.get('u_id_token')
    assert u_id_token
    assert decode(u_id_token, app.secret_key, algorithms=['HS256'])['u_id_token'] == u_id

def test_taken(app):

    with app.app_context():
        assert taken('user1', 'email@not.taken')
        # assert taken('name_not_taken', 'user1@test.com')
        # assert taken('ùser1', 'user1@test.com')
        # assert not taken('name_not_taken', 'email@not.taken')

def login_helper(app, client, status, expected_code, expected_text, token_present):

    u_id = status.value + 3
    login_details = {
        'username': f"Test{u_id}",
        'password': "1234"
    }
    response = client.post('/auth/login', json=login_details)
    assert response.status_code == expected_code
    assert response.text == expected_text
    if token_present:
        assert response.headers.get('Access-Control-Expose-Headers') == 'Content-Encoding, u_id_token'
        u_id_token = response.headers.get('u_id_token')
        assert u_id_token
        assert decode(u_id_token, app.secret_key, algorithms=['HS256'])['u_id_token'] == u_id
    else:
        assert not response.headers.get('u_id_token')
        assert not response.headers.get('Access-Control-Expose-Headers')