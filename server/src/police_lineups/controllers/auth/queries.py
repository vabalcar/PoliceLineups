import time
from datetime import datetime
from typing import Tuple

import connexion
from jose import jwt
from werkzeug.security import check_password_hash

from swagger_server.models import AuthRequest, AuthResponse, AuthTokenRenewalResponse, Response

from police_lineups.db import DbUser
from police_lineups.singletons import Configuration

from .errors import AuthErrors


def login(body):
    if connexion.request.is_json:
        body = AuthRequest.from_dict(connexion.request.get_json())

    db_user = DbUser.get_or_none(DbUser.username == body.username)
    if db_user is None or not check_password_hash(db_user.password, body.password):
        return Response(AuthErrors.INVALID_CREDENTIALS)

    (auth_token, auth_token_expiration_datetime) = _generate_auth_token(db_user.user_id, db_user.is_admin)

    return AuthResponse(
        user_id=db_user.user_id,
        is_admin=db_user.is_admin,
        full_name=db_user.full_name,
        auth_token=auth_token,
        token_expiration_datetime=auth_token_expiration_datetime)


def renew_auth_token():
    user_id = connexion.context['current_user_id']
    db_user = DbUser.get_by_id(user_id)
    if db_user is None:
        return AuthTokenRenewalResponse(error=AuthErrors.INVALID_USER)

    (auth_token, auth_token_expiration_datetime) = _generate_auth_token(db_user.user_id, db_user.is_admin)

    return AuthTokenRenewalResponse(
        auth_token=auth_token,
        token_expiration_datetime=auth_token_expiration_datetime)


def _generate_auth_token(user_id: int, is_admin: bool) -> Tuple[str, datetime]:
    issued_timestamp = _current_timestamp()
    expiration_timestamp = issued_timestamp + Configuration().auth_token.lifetime
    auth_payload = {
        "iss": Configuration().auth_token.issuer,
        "iat": int(issued_timestamp),
        "exp": int(expiration_timestamp),
        "user_id": user_id,
        "is_admin": is_admin
    }

    token = jwt.encode(auth_payload, Configuration().auth_token.secret,
                       algorithm=Configuration().auth_token.algorithm)
    expiration_datetime = datetime.utcfromtimestamp(expiration_timestamp)

    return (token, expiration_datetime)


def _current_timestamp() -> int:
    return int(time.time())
