import os
from config import config
from flask import Flask, url_for, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_jwt_extended import JWTManager
from constants import MODE
from helpers import api_error
from datetime import timedelta

app = Flask(__name__)


app.config["SQLALCHEMY_DATABASE_URI"] = config.DB_URI
app.config["JWT_SECRET_KEY"] = config.JWT_SECRET
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

db = SQLAlchemy(app)
jwt = JWTManager(app)


@app.errorhandler(Exception)
def server_error(err):
    app.logger.exception(err)
    return api_error(message="Oops. Something is broken.", status_code=500)


def unauthorized(*args, **kwargs):
    return api_error(message="Unauthorized. Please log in.", status_code=401)


jwt.expired_token_loader(unauthorized)
jwt.unauthorized_loader(unauthorized)
jwt.invalid_token_loader(unauthorized)

""" CORS(app)
socketio = SocketIO(app, cors_allowed_origins='http://localhost:5000/')

if MODE == 'PRODUCTION':
    url_for('/', filename='client/build/index.html')
 """
