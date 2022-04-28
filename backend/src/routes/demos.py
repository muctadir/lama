from src import app
from flask import jsonify, request

@app.route("/demo_request", methods=["POST", "GET"])
def demo_request():
    if request.method == "POST":
        # TODO: Implement example using MySQL db
        return
    else: # GET
        data = jsonify(foo="bar",
                ping="pong")
        return data

@app.route("/test")
def test():
    return "Hello, World!"