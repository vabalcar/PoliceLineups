from typing import Mapping

from werkzeug.exceptions import Unauthorized

from police_lineups.singletons import Context

from .utils.auth_token import parse_auth_token_payload, set_user_context


def authorize_user_by_token(token) -> Mapping:
    token_payload = parse_auth_token_payload(token)
    set_user_context(token_payload)

    return token_payload


def authorize_admin_by_token(token) -> Mapping:
    token_payload = parse_auth_token_payload(token)
    set_user_context(token_payload)

    if not Context().user.is_admin:
        raise Unauthorized

    return token_payload
