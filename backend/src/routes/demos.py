from src import app, db
from src.models.model import TestModel
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

@app.route("/read")
def read():
    index = request.args.get("index")
    if index:
        result = TestModel.query.get(index)
        if result:
            return {"index":result.field1, "text":result.field2}
        return "Entry does not exist with this index"
    return "No index supplied"