from . import auth as authController
from . import room as roomController
from . import connections as connectionController


def register_blueprints(app):
    app.register_blueprint(authController.auth_bp)
    app.register_blueprint(roomController.room_bp)
