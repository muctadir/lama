def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200

def test_register(client):
    response = client.post("/register", json={
        'username': "testuser",
        'email': "testuser@example.com",
        'password': "cakeisaL13",
        'description': "This user has been created for testing purposes."
    })
    assert response.status_code == 201
    response = client.get("/pending")
    assert not respose.data == "" # TODO: Do a better check here.