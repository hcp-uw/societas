from Firebase.dbconn import *
from core import *
ROUTE = '/projects/'

class Projects:
    def deleteProject(request):
        try:
            if getcurr() is None:
                return str(Status(False, "User must be logged in."))
            if not delete("Projects", request.form.get("id"))[1]:
                raise Exception("firebase error")
            return str(Status(True, f'Successfully deleted project.'))
        except Exception as e:
            return str(Status(False, f'project deletion failed. error: {e}'))

    def createProject(request):
        try:
            if getcurr() is None:
                return str(Status(False, "User must be logged in."))
            description = request.form.get('description')
            location = request.form.get('location')
            try:
                maxMembers = int(request.form.get('maxMembers'))
            except Exception as e:
                return str(Status(False, f'maxMembers must be an int'))
            meetType = request.form.get("meetType")
            startDate = request.form.get("startDate")
            title = request.form.get("title")
            project = {
                "created": datetime.now(),
                "description": description,
                "host_id": getcurr(),
                "location": location,
                "maxMembers": maxMembers,
                "meetType": meetType,
                "startDate":startDate,
                "title":title
            }  
            id=create("Projects", project)
            if not id[1]:
                 raise Exception("firebase error")
            return str(Status(True, f'Successfully created project. id: {id[0]}'))
        except Exception as e:
            return str(Status(False, f'project creation failed. error: {e}'))
