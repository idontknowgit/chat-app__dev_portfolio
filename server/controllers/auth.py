from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required,
    get_current_user,
    set_access_cookies,
    unset_access_cookies,
)
from wtforms import Form, StringField, PasswordField, validators
from models import User
from extensions import db, jwt
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


def user_to_response(user):
    response = jsonify(user.info)
    set_access_cookies(response, user.create_jwt())
    return response


@jwt.user_lookup_loader
def user_lookup_callback(header, data):
    user = User.find_by_id(data["sub"])
    print(user)
    return User.find_by_id(data["sub"])


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
            return user_to_response(user)

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

        return user_to_response(user)

    return api_error("Validation failed.", 400)


@auth_bp.route("/refresh")
@jwt_required()
def refresh():
    user = get_current_user()
    return user_to_response(user)


@auth_bp.route("/logout")
def logout():
    response = jsonify({"success": True})
    unset_access_cookies(response)
    return response


def unauthorized(*args, **kwargs):
    return api_error(message="Unauthorized. Please log in.", status_code=401)


# jwt callbacks
jwt.expired_token_loader(unauthorized)
jwt.unauthorized_loader(unauthorized)
jwt.invalid_token_loader(unauthorized)
