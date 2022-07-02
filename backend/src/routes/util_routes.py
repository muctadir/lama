from flask import request, Blueprint

util_routes = Blueprint("util_routes", __name__)

# Route for getting health
@util_routes.route("/health", methods=["GET"])
def health():
    if request.method == "GET":
        return "200 OK"