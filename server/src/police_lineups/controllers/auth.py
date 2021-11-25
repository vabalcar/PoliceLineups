import time
import secrets
from datetime import datetime
from typing import Mapping, Tuple

import connexion
from jose import JWTError, jwt
from werkzeug.security import check_password_hash
from werkzeug.exceptions import Unauthorized

from swagger_server.models import AuthRequest, AuthResponse, AuthTokenRenewalResponse

from police_lineups.db_scheme import DbUser

JWT_ISSUER = 'police_lineups'
JWT_SECRET = secrets.token_urlsafe(32)
JWT_LIFETIME_SECONDS = 30
JWT_ALGORITHM = 'HS256'  # https://en.wikipedia.org/wiki/HMAC


def _current_timestamp() -> int:
    return int(time.time())


def _generate_auth_token(username: str, is_admin: bool) -> Tuple[str, datetime]:
    issued_timestamp = _current_timestamp()
    expiration_timestamp = issued_timestamp + JWT_LIFETIME_SECONDS
    auth_payload = {
        "iss": JWT_ISSUER,
        "iat": int(issued_timestamp),
        "exp": int(expiration_timestamp),
        "username": username,
        "is_admin": is_admin
    }

    token = jwt.encode(auth_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    expiration_datetime = datetime.utcfromtimestamp(expiration_timestamp)

    return (token, expiration_datetime)


def _decode_auth_token(token) -> Mapping:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError as auth_error:
        raise Unauthorized from auth_error


def _authorize_user_by_token_payload(token_payload: Mapping) -> None:
    connexion.context['username'] = token_payload.get('username', None)
    connexion.context['is_admin'] = token_payload.get('is_admin', False)


def authorize_user_by_token(token) -> Mapping:
    token_payload = _decode_auth_token(token)
    _authorize_user_by_token_payload(token_payload)

    return token_payload


def authorize_admin_by_token(token) -> Mapping:
    token_payload = _decode_auth_token(token)

    _authorize_user_by_token_payload(token_payload)
    if not connexion.context['is_admin']:
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
    auth_token_expiration_datetime = None
    is_admin = False
    user_full_name = None

    username = body.username
    password = body.password

    db_user = DbUser.get_or_none(DbUser.username == username)
    success = db_user is not None and check_password_hash(db_user.password, password)

    if success:
        is_admin = db_user.is_admin
        (auth_token, auth_token_expiration_datetime) = _generate_auth_token(username, is_admin)
        user_full_name = db_user.name

    return AuthResponse(
        success=success,
        auth_token=auth_token,
        token_expiration_datetime=auth_token_expiration_datetime,
        is_admin=is_admin,
        user_full_name=user_full_name)


def renew_auth_token():  # noqa: E501
    """Renews auth token

     # noqa: E501


    :rtype: AuthTokenRenewalResponse
    """

    username = connexion.context['username']
    db_user = DbUser.get_by_id(username)
    if db_user is None:
        return AuthTokenRenewalResponse(success=False)
    is_admin = db_user.is_admin

    (auth_token, auth_token_expiration_datetime) = _generate_auth_token(username, is_admin)

    return AuthTokenRenewalResponse(
        success=True, auth_token=auth_token,
        token_expiration_datetime=auth_token_expiration_datetime)
