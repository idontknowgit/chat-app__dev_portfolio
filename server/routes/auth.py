from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from wtforms import Form, StringField, PasswordField, validators
from models import User
from app import db
from helpers import api_error, api_form_from_json

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


class RegisterForm(Form):
    username = StringField(
        "username",
        validators=[validators.Length(min=3, max=15), validators.DataRequired(),],
    )
    password = PasswordField(
        "password",
        validators=[validators.Length(min=6, max=256), validators.DataRequired(),],
    )


class LoginForm(Form):
    username = StringField("username", validators=[validators.DataRequired(),],)
    password = PasswordField("password", validators=[validators.DataRequired(),],)


@auth_bp.route("/register", methods=("POST",))
def register():
    form = api_form_from_json(RegisterForm)
    username = form.username.data
    password = form.password.data

    if form.validate():
        if User.find_by_username(username):
            return api_error("Username already exists.", 403)
        else:
            user = User(username=username)
            user.set_password(password)
            user.save()

            return user.auth_info(True)

    return api_error("Validation failed.", 400)


@auth_bp.route("/login", methods=("POST",))
def login():
    form = api_form_from_json(LoginForm)
    username = form.username.data
    password = form.password.data

    if form.validate():
        user = User.find_by_username(username)
        if not user or not user.verify_password(password):
            return api_error("Invalid username or password.", 401)

        return user.auth_info(True)

    return api_error("Validation failed.", 400)


@auth_bp.route("/refresh")
@jwt_required(refresh=True)
def refresh():
    id = get_jwt_identity()
    return User.find_by_id(id).auth_info()
