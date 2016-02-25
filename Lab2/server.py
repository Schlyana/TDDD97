from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/sign_in")
#Authenticate the username by the provided password.
def sign_in(email, password):
    return token

@app.route("/sign_up")
#Register a user in the database.
def sign_up(email, password, firstname, familyname, gender, city, country):

@app.route("/sign_out")
#Signs out a user from the system.
def sign_out(token):

@app.route("/change_password")
#Change the password of the current user to a new one.
def change_password(token, old_password, new_password):

@app.route("/get_user_data_by_token")
#Retrieves the stored data for the user whom the passed token is issued for.
#The currently signed in user can use this method to retrieve all its own
#information from the server.
def get_user_data_by_token(token):
    return information

@app.route("/get_user_data_by_email")
#​Retrieves the stored data for the user specified by the passed email address.
def get_user_data_by_email(token, email):
    return information

@app.route("/post_message")
#​Tries to post a message to the wall of the user specified by the email address.
def post_message(token, message, email):

if __name__ == "__main__":
    app.run()
