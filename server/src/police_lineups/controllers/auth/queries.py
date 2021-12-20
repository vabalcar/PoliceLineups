import connexion
from werkzeug.security import check_password_hash

from swagger_server.models import AuthRequest, AuthResponse, AuthTokenRenewalResponse

from police_lineups.db import DbUser
from police_lineups.singletons import Context

from .errors import AuthErrors
from .utils.auth_token import create_auth_token


def login(body):
    if connexion.request.is_json:
        body = AuthRequest.from_dict(connexion.request.get_json())

    db_user = DbUser.get_or_none(DbUser.username == body.username)
    if db_user is None or not check_password_hash(
            db_user.password, body.password):
        return AuthErrors.INVALID_CREDENTIALS

    (auth_token, auth_token_expiration_datetime) = create_auth_token(
        db_user.user_id, db_user.is_admin)

    return AuthResponse(
        user_id=db_user.user_id,
        username=db_user.username,
        is_admin=db_user.is_admin,
        email=db_user.email,
        full_name=db_user.full_name,
        auth_token=auth_token,
        token_expiration_datetime=auth_token_expiration_datetime)


def renew_auth_token():
    user_id = Context().user.user_id
    db_user = DbUser.get_by_id(user_id)
    if db_user is None:
        return AuthErrors.INVALID_USER

    (auth_token, auth_token_expiration_datetime) = create_auth_token(
        db_user.user_id, db_user.is_admin)

    return AuthTokenRenewalResponse(
        auth_token=auth_token,
        token_expiration_datetime=auth_token_expiration_datetime)
