from Flask import session

class Status:
    def __init__(self, success, message):
        self.success = success
        self.message = message
    
    def __str__(self):
        return str({'success':self.success,'message':self.message})
    
curr_user = None

getcurr = lambda: curr_user
def setcurr(new):
    session['curr'] = new
    curr_user = new