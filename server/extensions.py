from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO

db = SQLAlchemy()
jwt = JWTManager()
socket = SocketIO(cors_allowed_origins="http://localhost:5000/")
