from helpers import create_id, timestamp
from collections import deque
from datetime import datetime

MESSAGE_CACHE_SIZE = 100

rooms = {}


class Room:
    def __init__(self, admin):
        self.id = create_id()
        self.admin = admin
        self.users = {}
        self.messages = deque([], maxlen=MESSAGE_CACHE_SIZE)
        self.keep_alive()

    @classmethod
    def create(cls, admin):
        room = cls(admin)
        rooms[room.id] = room
        return room

    def delete(self):
        rooms.pop(self.id)

    @staticmethod
    def find_by_id(id):
        return rooms.get(id)

    def append_user(self, user):
        username = user["username"]
        if username not in self.users:
            user = self.users[username] = user
            return user

    def remove_user(self, user):
        return self.users.pop(user["username"], None)

    def append_message(self, user, message):
        data = dict(
            id=create_id(), messenger=user, message=message, timestamp=timestamp(),
        )
        self.messages.append(data)
        return data

    def keep_alive(self):
        self.active_timestamp = timestamp()

    @property
    def info(self):
        return dict(admin=self.admin, users=self.users, messages=list(self.messages,))

