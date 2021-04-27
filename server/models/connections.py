connections = {}


class Connection:
    def __init__(self, sid, username):
        self.sid = sid
        self.rooms = {}
        self.user = dict(sid=sid, username=username)

    @staticmethod
    def get(sid):
        return connections.get(sid)

    @classmethod
    def create(cls, sid, username):
        connection = connections[sid] = cls(sid, username,)
        return connection

    def delete(self):
        return connections.pop(self.sid)

    def append_room(self, room):
        self.rooms[room.id] = room
        return room

    def remove_room(self, room_id):
        return self.rooms.pop(room_id)

