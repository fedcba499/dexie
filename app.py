"""
Simple Flask + Dataset Example
"""

from flask import Flask, render_template, jsonify, request
import dataset

app = Flask(__name__)

# SQLite Connection
db = dataset.connect("sqlite:///database.db")

# Table creation happens automatically
todos = db["todos"]

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/todos", methods=["POST"])
def add_todo():
    data = request.get_json()

    todos.insert({
        "title":data["title"]
    })

    return jsonify({
        "success" : True
    })

@app.route("/api/todos", methods=["GET"])
def get_todos():
    data = list(todos.all())
    

    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
