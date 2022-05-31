# This endpoint is found in routes/demos and may change soon.
def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200

# This test isn't very sturdy but serves as an example for now.
# def test_register(client):
#     response = client.post("/register", json={
#         'username': "testuser",
#         'email': "testuser@example.com",
#         'password': "cakeisaL13",
#         'description': "This user has been created for testing purposes."
#     })
#     assert response.status_code == 201
#     response = client.get("/pending")
#     assert not response.data == "" # TODO: Do a better check here.