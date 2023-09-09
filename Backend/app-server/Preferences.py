from Firebase.dbconn import *
from core import *
ROUTE = '/preferences/'

class Preferences:
    def setPreference(preference):
        res = create("Preferences", {
            "id":getcurr(),
            "preference":preference,
            "user":True
        })
        if not res[1]:
            raise Exception("firebase error")
    def setPreferences(request):
        try:
            if getcurr() is None:
                return str(Status(False, "User must be logged in."))
            preferences = request.form.get("preferences").split("|")
            for i in preferences:
                Preferences.setPreference(i)
            return str(Status(True, f'Successfully set preferences.'))
        except Exception as e:
            return str(Status(False, f'setting preferences failed. error: {e}'))