import time
from datetime import datetime
from typing import Mapping, Tuple

import connexion
from jose import JWTError, jwt
from werkzeug.security import check_password_hash
from werkzeug.exceptions import Unauthorized

from swagger_server.models import AuthRequest, AuthResponse, AuthTokenRenewalResponse

from police_lineups.db import DbUser
from police_lineups.singletons import Configuration


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
    user_id = 0
    is_admin = False
    user_full_name = None
    auth_token = None
    auth_token_expiration_datetime = None

    db_user = DbUser.get_or_none(DbUser.username == body.username)
    success = db_user is not None and check_password_hash(db_user.password, body.password)

    if success:
        user_id = db_user.user_id
        is_admin = db_user.is_admin
        user_full_name = db_user.full_name
        (auth_token, auth_token_expiration_datetime) = _generate_auth_token(user_id, is_admin)

    return AuthResponse(
        success=success,
        user_id=user_id,
        is_admin=is_admin,
        user_full_name=user_full_name,
        auth_token=auth_token,
        token_expiration_datetime=auth_token_expiration_datetime)


def renew_auth_token():  # noqa: E501
    """Renews auth token

     # noqa: E501


    :rtype: AuthTokenRenewalResponse
    """

    user_id = connexion.context['current_user_id']
    db_user = DbUser.get_by_id(user_id)
    if db_user is None:
        return AuthTokenRenewalResponse(success=False)
    is_admin = db_user.is_admin

    (auth_token, auth_token_expiration_datetime) = _generate_auth_token(user_id, is_admin)

    return AuthTokenRenewalResponse(
        success=True, auth_token=auth_token,
        token_expiration_datetime=auth_token_expiration_datetime)


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


def _decode_auth_token(token) -> Mapping:
    try:
        return jwt.decode(
            token, Configuration().auth_token.secret, algorithms=[
                Configuration().auth_token.algorithm])
    except JWTError as auth_error:
        raise Unauthorized from auth_error


def _authorize_user_by_token_payload(token_payload: Mapping) -> None:
    connexion.context['current_user_id'] = token_payload.get('user_id', None)
    connexion.context['is_admin'] = token_payload.get('is_admin', False)


def _current_timestamp() -> int:
    return int(time.time())
