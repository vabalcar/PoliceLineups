from typing import Mapping

import connexion
from jose import JWTError, jwt
from werkzeug.exceptions import Unauthorized

from police_lineups.singletons import Configuration


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
