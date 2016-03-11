from flask import Flask, g
from contextlib import closing
import sqlite3
import json
import random

app = Flask(__name__)

import Twidder.views
import Twidder.database_helper
