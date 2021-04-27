from flask import request
from werkzeug.datastructures import ImmutableMultiDict
from uuid import uuid4
import time


def api_error(message="There was a problem processing request.", status_code=400):
    return dict(message=message, status_code=status_code), status_code


def api_form_from_json(form_cls):
    return form_cls(ImmutableMultiDict(request.json))


def create_id():
    return str(uuid4())


def timestamp():
    return time.time() // 1
