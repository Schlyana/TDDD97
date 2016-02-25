from flask import Flask, g
import sqlite3

def connect_db():
    return sqlite3.connect("database.db")

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g.db = connect.db()
    return db

def init_db():
    connection = get_db()
    cur = connection.cursor()
    with open('database.schema') as schema:
        cur.executescript(schema.read())
    connection.commit()

def add_message(name,message):

def close():
    get_db().close()
