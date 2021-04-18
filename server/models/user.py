from app import db
from passlib.hash import pbkdf2_sha256 as sha256
from flask_jwt_extended import create_access_token, create_refresh_token
from datetime import timedelta


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def find_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

    def save(self):
        db.session.add(self)
        db.session.commit()

    def set_password(self, password):
        self.password = sha256.hash(password)

    def verify_password(self, password):
        return sha256.verify(password, self.password)

    def auth_info(self, with_refresh_token=False):
        info = dict(
            id=self.id,
            username=self.username,
            access_token=create_access_token(identity=self.id),
        )

        if with_refresh_token:
            info["refresh_token"] = create_refresh_token(identity=self.id)

        return info
