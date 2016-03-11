from flask import Flask, g
from contextlib import closing
import sqlite3
import json
import random
from Twidder import app

def connect_db():
    return sqlite3.connect("database.db")

def get_db():
    db = getattr(g, 'db', None)
    if db is None:
        db = g.db = connect_db()
    return db

def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('database.schema', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

def generate_token():
    random.seed()
    letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    token = random.random()
    return str(token)

def response_builder(success, message, result):
    response = {
        "response": {
            "success": success,
            "message": message,
            "result": result
        }
    }
    return response

def get_user(email):
    c = connect_db()
    cursor = c.cursor()
    cursor.execute("select * from Users where email = '" + email + "'")
    user = [dict(email=row[0], password=row[1], firstname=row[2], familyname=row[3], gender=row[4], city = row[5], country = row[6])
    for row in cursor.fetchall()]
    c.close()
    if (bool(user) is False):
        json_response = response_builder(False, "User doesn't exist", "")
    else:
        user[0]["messages"] = get_message(user[0]["email"])
        json_response = response_builder(True, "User data retrevied", user)
    return json.dumps(json_response)

def check_user(email, password, firstname, familyname, gender, city, country):
    res = json.loads(get_user(email))
    if (res["response"]["success"] is False):
        add_user(email, password, firstname, familyname, gender, city, country)
        success = True;
        message = "Successfully added a new user"
        result = ""
    else:
        success = False;
        message = "User already exists"
        result = ""
    json_response = response_builder(success, message, result)
    json_response = json.dumps(json_response)
    return json_response

def get_token_by_email(email):
    c = connect_db()
    cursor = c.cursor()
    print "------get_token_by_email-------"
    cursor.execute("select token from Users where email = '" + email + "'")
    token = cursor.fetchone()
    print(token)
    if (token[0] is None):
        print "No token"
        json_response = response_builder(False, "User not signed in", "")
    else:
        print "Token retrevied"
        json_response = response_builder(True, "Token retrevied", token[0])
    c.commit()
    c.close()
    return json.dumps(json_response)

def get_token(token):
    c = connect_db()
    cursor = c.cursor()
    print "-------get_token---------"
    print(token)
    cursor.execute("select token from Users where token = '" + token + "'")
    user = cursor.fetchone()
    print "Token"
    print(user)
    if (user is None):
        print "User offline"
        json_response = response_builder(False, "User not signed in", "")
    else:
        print "User online"
        user = json.loads(user[0])
        json_response = response_builder(True, "Token retrevied", user)
    c.commit()
    c.close()
    return json.dumps(json_response)

def add_token(email,token):
    res = json.loads(get_token(token))
    c = connect_db()
    if (res["response"]["success"] is False):
        c.execute("update Users set token = '"+ token +"' where email = '"+ email +"'")
        json_response = response_builder(True, "User signed in", str(token))
    else:
        json_response = response_builder(False, "Token already taken", "")
    c.commit()
    c.close()
    return json.dumps(json_response)

def login(email, password):
    res = json.loads(get_user(email))
    user = res["response"]["result"]
    if (res["response"]["success"] is False):
        success = False
        message = "User does not exist"
        result = ""
    elif (user[0]["password"] == password):
        success = True
        message = "User successfully logged in"
        result = generate_token()
        add_token(email, result)
        print "Token added"
    else:
        success = False
        message = "Wrong password or username"
        result = ""
    json_response = response_builder(success, message, result)
    json_response = json.dumps(json_response)
    return json_response

def get_user_by_token(token):
    c = connect_db()
    cursor = c.cursor()
    cursor.execute("select * from Users where token = '" + token + "'")
    user = [dict(email=row[0], password=row[1], firstname=row[2], familyname=row[3], gender=row[4], city = row[5], country = row[6])
    for row in cursor.fetchall()]
    user[0]["messages"] = get_message(user[0]["email"])
    c.close
    json_response = response_builder(True, "User data retrevied", user)
    return json.dumps(json_response)

def delete_token(token):
    print "------delete_token------"
    c = connect_db()
    res = json.loads(get_token(token))
    if (res["response"]["success"] is False):
        json_response = response_builder(False, "No such user", "")
        print "No such user"
    else:
        user = json.loads(get_user_by_token(token))
        user = user["response"]["result"][0]["email"]
        c.execute("update Users set token = NULL where email = '"+ user +"'")
        json_response = response_builder(True, "User signed out", "")
        print "Token removed"
    c.commit()
    c.close()
    return json.dumps(json_response)

def add_user(email, password, firstname, familyname, gender, city, country):
    c = connect_db()
    c.execute("insert into Users (email, password, firstname, familyname, gender, city, country) values(?,?,?,?,?,?,?)",
    (email, password, firstname, familyname, gender, city, country))
    c.commit()
    c.close()

def add_message(token,email,message):
    user = json.loads(get_user_by_token(token))
    msg = {
        "writer" : user["response"]["result"][0]["email"],
        "content" : message
    }
    msg = json.dumps(msg)
    c = connect_db()
    c.execute("insert into Messages (message,user) values(?,?)", (msg,email))
    c.commit()
    c.close()
    json_response = response_builder(True, "Message added", "")
    return json.dumps(json_response)

def get_message(email):
    c = connect_db()
    cursor = c.cursor()
    cursor.execute("select message from Messages where user = '" + email + "'")
    messages = cursor.fetchall()
    c.close()
    return messages

def edit_password(token, old_password, new_password):
    res = json.loads(get_user_by_token(token))
    stored_password = res["response"]["result"][0]["password"]
    user = res["response"]["result"][0]["email"]
    if (old_password == stored_password):
        c = connect_db()
        c.execute("update Users set password = '"+ new_password +"' where email = '"+ user +"'")
        c.commit()
        c.close()
        json_response = response_builder(True, "Password changed", "")
    else:
        json_response = response_builder(False, "Wrong password", "")
    return json.dumps(json_response)

def close():
    get_db().close()

if __name__ == "__main__":
    app.run()
