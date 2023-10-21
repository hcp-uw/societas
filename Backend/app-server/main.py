import os
import User, Projects, Preferences
from flask import Flask, request, session
from flask_cors import CORS


app = Flask(__name__)
app.secret_key = 'l'

CORS(app)

@app.route("/", methods = ['GET'])
def hello_world():
    return f"hello world: {session.get('curr')}"

#user
@app.route(User.ROUTE + 'login', methods = ['POST'])
def login():
    return User.Auth.newLogin(request)

@app.route(User.ROUTE + 'logout', methods = ['POST'])
def logout():
    return User.Auth.logout()

@app.route(User.ROUTE + 'register', methods = ['POST'])
def register():
    return User.Auth.newRegister(request)

@app.route(User.ROUTE + 'getAllProjects', methods = ['POST'])
def getAllProjects():
    return User.User.getAllProjects(request)

@app.route(Projects.ROUTE + 'joinProject', methods = ['POST'])
def joinProject():
    return Projects.Projects.joinProject(request)

#project
@app.route(Projects.ROUTE + 'createProject', methods = ['POST'])
def createProject():
    return Projects.Projects.createProject(request)

@app.route(Projects.ROUTE + 'deleteProject', methods = ['POST'])
def deleteProject():
    return Projects.Projects.deleteProject(request)

@app.route(Projects.ROUTE + 'getProjectInfo', methods = ['POST'])
def getProjectInfo():
    return Projects.Projects.getProjectInfo(request)

@app.route(Projects.ROUTE + 'getAllProjects', methods = ['POST'])
def getAllProjects2():
    return Projects.Projects.getAllProjects(request)

@app.route(Projects.ROUTE + 'sendAnnouncement', methods = ['POST'])
def sendAnnouncement():
    return Projects.Projects.sendAnnouncement(request)

@app.route(Projects.ROUTE + 'getAnnouncements', methods = ['POST'])
def getAnnouncements():
    return Projects.Projects.getAnnouncements(request)

@app.route(Projects.ROUTE + 'getStatus', methods = ['POST'])
def getStatus():
    return Projects.Projects.getStatus(request)

@app.route(Projects.ROUTE + 'acceptUser', methods = ['POST'])
def acceptUser():
    return Projects.Projects.acceptUser(request)

#preferences
@app.route(Preferences.ROUTE + 'setPreferences', methods = ['POST'])
def setPreferences():
    return Preferences.Preferences.setPreferences(request)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
