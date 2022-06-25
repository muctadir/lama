# This endpoint is found in routes/demos and may change soon.
def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200