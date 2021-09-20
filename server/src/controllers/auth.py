import secrets
import time
from typing import Mapping
import connexion

from werkzeug.security import check_password_hash
from werkzeug.datastructures import Authorization
from werkzeug.exceptions import Unauthorized
from jose import JWTError, jwt

from swagger_server.models import AuthRequest, AuthResponse

from police_lineups.mysql.db import DB

JWT_ISSUER = 'police_lineups'
JWT_SECRET = secrets.token_urlsafe(32)
JWT_LIFETIME_SECONDS = 600
JWT_ALGORITHM = 'HS256'  # https://en.wikipedia.org/wiki/HMAC


def _current_timestamp() -> int:
    return int(time.time())


def _generate_auth_token(username: str, is_admin: bool) -> str:
    timestamp = _current_timestamp()
    auth_payload = {
        "iss": JWT_ISSUER,
        "iat": int(timestamp),
        "exp": int(timestamp + JWT_LIFETIME_SECONDS),
        "username": username,
        "is_admin": is_admin
    }

    return jwt.encode(auth_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def _decode_auth_token(token) -> Mapping:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError as auth_error:
        raise Unauthorized from auth_error


def _authorize_user_by_token_payload(token_payload: Mapping) -> None:
    authorized_user_name = token_payload.get("username", None)

    connexion.request.authorization = Authorization(
        "bearer", dict(username=authorized_user_name))


def authorize_user_by_token(token) -> Mapping:
    token_payload = _decode_auth_token(token)
    _authorize_user_by_token_payload(token_payload)

    return token_payload


def authorize_admin_by_token(token) -> Mapping:
    token_payload = _decode_auth_token(token)

    _authorize_user_by_token_payload(token_payload)
    if not token_payload.get("is_admin", False):
        raise Unauthorized

    return token_payload


def login(body):  # noqa: E501
    """Logins registered user

     # noqa: E501

    :param body: AuthRequest
    :type body: dict | bytes

    :rtype: object
    """
    if connexion.request.is_json:
        body = AuthRequest.from_dict(connexion.request.get_json())  # noqa: E501

    success = False
    auth_token = None
    is_admin = False
    user_full_name = None

    username = body.username
    password = body.password

    user = DB().users.find_one(username=username)
    success = user is not None and check_password_hash(user.password, password)

    if success:
        is_admin = user.is_admin
        auth_token = _generate_auth_token(username, is_admin)
        user_full_name = user.name

    return AuthResponse(success, auth_token, is_admin, user_full_name)
