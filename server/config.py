import constants
import os


class ProductionConfig:
    DB_URI = "sqlite:///prod.db"
    JWT_SECRET = os.getenv("JWT_SECRET")


class DevelopmentConfig:
    DB_URI = "sqlite:///dev.db"
    JWT_SECRET = "fake_secret"


config = ProductionConfig if constants.MODE == "PRODUCTION" else DevelopmentConfig
