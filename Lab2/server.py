from flask import Flask, request, url_for
from database_helper import *
import json

app = Flask(__name__)

@app.route("/")
def hello():
    init_db()
    return "Hello World!"

@app.route("/login", methods=['GET', 'POST'])
#Authenticate the username by the provided password.
def sign_in():
    if (request.method == 'POST'):
        email = request.args.get('email', '')
        password = request.args.get('password', '')
        res = login(email, password)
        message = json.loads(res)
    return res

@app.route("/signup", methods=['GET', 'POST'])
#Register a user in the database.
def sign_up():
    if (request.method == 'POST'):
        email = request.args.get('email', '')
        password = request.args.get('password', '')
        firstname = request.args.get('firstname', '')
        familyname = request.args.get('familyname', '')
        gender = request.args.get('gender', '')
        city = request.args.get('city', '')
        country = request.args.get('country', '')
        res = check_user(email, password, firstname, familyname, gender, city, country)
        message = json.loads(res)
    return res

@app.route("/sign_out", methods=['GET', 'POST'])
#Signs out a user from the system.
def sign_out():
    if (request.method == 'POST'):
        token = request.args.get('token', '')
        res = delete_token(token)
        message = json.loads(res)
    return res

@app.route("/change_password", methods=['GET', 'POST'])
#Change the password of the current user to a new one.
def change_password():
    if (request.method == 'POST'):
        token = request.args.get('token', '')
        old_password = request.args.get('old_password', '')
        new_password = request.args.get('new_password', '')
        res = edit_password(token, old_password, new_password)
        message = json.loads(res)
    return res

@app.route("/get_user_data_by_token", methods=['GET', 'POST'])
#Retrieves the stored data for the user whom the passed token is issued for.
#The currently signed in user can use this method to retrieve all its own
#information from the server.
def get_user_data_by_token():
    if (request.method == 'GET'):
        token = request.args.get('token','')
        res = get_user_by_token(token)
        message = json.loads(res)
    return res

@app.route("/get_user_data_by_email", methods=['GET', 'POST'])
def get_user_data_by_email():
    if (request.method == 'GET'):
        email = request.args.get('email','')
        token = request.args.get('token','')
        res = get_user(email)
        message = json.loads(res)
    return res

@app.route("/post_message", methods=['GET', 'POST'])
def post_message():
    if (request.method == 'POST'):
        token = request.args.get('token', '')
        message = request.args.get('message' '')
        email = request.args.get('email', '')
        res = add_message(email, message)
        message = json.loads(res)
    return res

if __name__ == "__main__":
    app.run()
