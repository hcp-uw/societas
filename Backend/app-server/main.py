from endpoints import *

import os

from flask import Flask
from flask import requests
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

curr_user = None

getcurr = lambda: curr_user
def setcurr(new):
    curr_user = new

class Status:
    def __init__(self, success, message):
        self.success = success
        self.message = message
    
    def __str__(self):
        return str({'success':self.success,'message':self.message})

@app.route("/")
def hello_world():
    return "hello world"


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
