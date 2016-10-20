from flask import Blueprint

api = Blueprint('api', __name__)

from . import users, auth, files # noqa
