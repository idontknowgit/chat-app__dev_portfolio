from flask_jwt_extended import jwt_required, get_current_user
from flask_socketio import disconnect
from flask import request
from extensions import socket
from models import connections, Connection
from controllers import roomController
import logging

logger = logging.getLogger(__name__)


@socket.on("connect")
@jwt_required()
def on_connect():
    username = get_current_user().username
    connection = Connection.create(request.sid, username)
    logger.debug(f"{connection.user['username']} connected")


@socket.on("disconnect")
@jwt_required()
def on_disconnect():
    connection = Connection.get(request.sid)
    if connection:
        rooms = list(connection.rooms.values())
        for room in rooms:
            roomController.handle_leave(room, connection)

        connection.delete()
        logger.debug(f"{connection.user['username']} disconnected")

