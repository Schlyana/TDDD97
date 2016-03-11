from flask import Flask, request, url_for
from Twidder import app
from database_helper import *
import json
from flask_sockets import Sockets
from gevent.pywsgi import WSGIServer

sockets = Sockets(app)

@app.route("/")
def hello():
    return app.send_static_file("client.html")

@app.route("/init_db", methods=['GET', 'POST'])
def init():
    init_db()
    return "Database initiated"

@app.route("/check_session")
def check_session():
    try:
        users
    except:
        users = {}
    if (request.environ.get('wsgi.websocket')):
        ws = request.environ['wsgi.websocket']
        message = ""
    while not ws.closed:
        message = ws.receive()
        if (ws != ""):
            message = json.loads(message)
            result = get_token_by_email(message["email"])
            result = json.loads(result)
            if (result["response"]["success"] == True):
                delete_token(result["response"]["result"])
                result = response_builder(False, "logout", result["response"]["result"])
                users[message["email"]].send(json.dumps(result))
                users[message["email"]].close()
                result = response_builder(True, "login","")
                ws.send(json.dumps(result))
                users[message["email"]] = ws
            else:
                users[message["email"]] = ws
                result = response_builder(True, "login","")
                ws.send(json.dumps(result))

@app.route("/login", methods=['POST'])
#Authenticate the username by the provided password.
def sign_in():
    if (request.method == 'POST'):
        email = request.form["email"]
        password = request.form["password"]
        res = login(email, password)
        message = json.loads(res)
        return res

@app.route("/signup", methods=['GET', 'POST'])
#Register a user in the database.
def sign_up():
    if (request.method == 'POST'):
        email = request.form["email"]
        password = request.form["password"]
        firstname = request.form["firstname"]
        familyname = request.form["familyname"]
        gender = request.form["gender"]
        city = request.form["city"]
        country = request.form["country"]
        res = check_user(email, password, firstname, familyname, gender, city, country)
        message = json.loads(res)
    return res

@app.route("/sign_out", methods=['GET', 'POST'])
#Signs out a user from the system.
def sign_out():
    if (request.method == 'POST'):
        token = request.form["token"]
        res = delete_token(token)
        message = json.loads(res)
    return res

@app.route("/change_password", methods=['GET', 'POST'])
#Change the password of the current user to a new one.
def change_password():
    if (request.method == 'POST'):
        token = request.form["token"]
        old_password = request.form["old_password"]
        new_password = request.form["new_password"]
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
        token = request.form["token"]
        message = request.form["message"]
        email = request.form["email"]
        res = add_message(token, email, message)
        message = json.loads(res)
    return res

if __name__ == "__main__":
    app.run()
