from src.conftest import RequestHandler

def test_health(app, client):
    """
        This test checks whether the health check works.
    """
    with app.app_context():
        request_handler = RequestHandler(app, client)
        response = request_handler.get('health', {}, False)
        assert response.status_code == 200
