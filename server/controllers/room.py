from extensions import socket
from models import Room
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_current_user
from flask_socketio import emit, join_room, leave_room
from wtforms import Form, StringField, BooleanField, validators
from models import Room, connections, Connection
from helpers import api_error, api_form_from_json

room_bp = Blueprint("room", __name__, url_prefix="/api/room")


@room_bp.route("", methods=("POST",))
@jwt_required()
def create_room():
    user = get_current_user()
    room = Room.create(admin=user.username)
    return room.id


def room_action(fn):
    def wrapper(data):
        connection = Connection.get(request.sid)
        room = Room.find_by_id(data["room_id"])

        if room:
            room.keep_alive()
            return fn(room, connection, data)
        else:
            emit("room_not_found", to=connection.sid)

    return wrapper


@socket.on("join")
@jwt_required()
@room_action
def on_join(room, connection, data):
    join_room(room.id)
    user = room.append_user(connection.user)
    if user:
        connection.append_room(room)
        emit("joined_room", user, broadcast=True, to=room.id)

    emit("room", room.info, to=connection.sid)


@socket.on("message")
@jwt_required()
@room_action
def on_message(room, connection, data):
    emit(
        "message",
        room.append_message(user=connection.user, message=data["message"]),
        to=room.id,
    )


def handle_leave(room, connection, data=None):
    leave_room(room.id)
    removed_user = room.remove_user(connection.user)
    connection.remove_room(room.id)

    if removed_user:
        emit("left_room", removed_user, broadcast=True, to=room.id)


on_leave = socket.on("leave")(jwt_required()(room_action(handle_leave)))
