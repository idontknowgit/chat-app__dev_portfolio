from app import create_app
from extensions import socket
from constants import MODE
import logging

logging.basicConfig(level=logging.DEBUG)

app = create_app()
socket.run(app)
