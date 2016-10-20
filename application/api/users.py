from flask import request, jsonify, g
from ..models import User
from . import api
from .. import db
from sqlalchemy.exc import IntegrityError
from .auth import generate_token, requires_auth, verify_token
import uuid


@api.route("/user", methods=["GET"])
@requires_auth
def get_user():
    return jsonify(result=g.current_user)


@api.route("/create_user", methods=["POST"])
def create_user():
    incoming = request.get_json()
    user = User(
        id=str(uuid.uuid4()),
        email=incoming["email"],
        password=incoming["password"]
    )
    db.session.add(user)

    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="User with that email already exists"), 409

    new_user = db.session.query(User).filter_by(id=user.id).first()

    return jsonify(
        id=user.id,
        token=generate_token(new_user)
    )


@api.route("/get_token", methods=["POST"])
def get_token():
    incoming = request.get_json()
    user = User.get_user_with_email_and_password(incoming["email"],
                                                 incoming["password"])
    if user:
        return jsonify(token=generate_token(user))

    return jsonify(error=True), 403


@api.route("/is_token_valid", methods=["POST"])
def is_token_valid():
    incoming = request.get_json()
    is_valid = verify_token(incoming["token"])

    if is_valid:
        return jsonify(token_is_valid=True)
    else:
        return jsonify(token_is_valid=False), 403
