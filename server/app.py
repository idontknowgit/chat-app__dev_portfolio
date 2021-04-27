import os
from config import config
from flask import Flask, url_for, request
from constants import MODE
from helpers import api_error
from datetime import timedelta


def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = config.DB_URI
    app.config["JWT_SECRET_KEY"] = config.JWT_SECRET
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_COOKIE_SECURE"] = MODE == "PRODUCTION"

    from extensions import jwt, db, socket
    from controllers import register_blueprints

    jwt.init_app(app)
    db.init_app(app)
    socket.init_app(app)
    register_blueprints(app)

    @app.errorhandler(Exception)
    def server_error(err):
        app.logger.exception(err)
        return api_error(message="Oops. Something is broken.", status_code=500)

    if MODE == "PRODUCTION":
        url_for("/", filename="client/build/index.html")

    return app
