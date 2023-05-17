import os
import User
from flask import Flask, request
from flask_cors import CORS


app = Flask(__name__)

CORS(app)



@app.route("/", methods = ['GET'])
def hello_world():
    return "hello world"


@app.route(User.ROUTE + 'login', methods = ['POST'])
def login():
    return User.Auth.login(request)

@app.route(User.ROUTE + 'logout', methods = ['POST'])
def logout():
    return User.Auth.logout()

@app.route(User.ROUTE + 'register', methods = ['POST'])
def register():
    return User.Auth.register(request)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
