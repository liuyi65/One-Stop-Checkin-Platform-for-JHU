class APIModelException(Exception):
    def __init__(self, message, status_code=400):
        self.message = message
        self.status_code = status_code

    def __str__(self):
        return self.message
    
def return_error(e):
    if type(e) == APIModelException:
        return e.message, e.status_code
    else:
        return str(e), 500