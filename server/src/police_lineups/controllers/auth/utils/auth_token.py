from datetime import datetime
from time import time
from typing import Mapping, Tuple

from jose import JWTError, jwt
from werkzeug.exceptions import Unauthorized

from police_lineups.context import UserContext
from police_lineups.singletons import Configuration, Context


def create_auth_token(user_id: int, is_admin: bool) -> Tuple[str, datetime]:
    issued_timestamp = _create_current_timestamp()
    expiration_timestamp = issued_timestamp + Configuration().auth_token.lifetime
    auth_token_payload = {
        'iss': Configuration().auth_token.issuer,
        'iat': int(issued_timestamp),
        'exp': int(expiration_timestamp),
        'user_id': user_id,
        'is_admin': is_admin
    }

    auth_token = jwt.encode(auth_token_payload, Configuration().auth_token.secret,
                            algorithm=Configuration().auth_token.algorithm)
    expiration_datetime = datetime.utcfromtimestamp(expiration_timestamp)

    return (auth_token, expiration_datetime)


def parse_auth_token_payload(auth_token) -> Mapping:
    try:
        return jwt.decode(
            auth_token, Configuration().auth_token.secret, algorithms=[
                Configuration().auth_token.algorithm])
    except JWTError as auth_error:
        raise Unauthorized from auth_error


def set_user_context(auth_token_payload: Mapping) -> None:
    user_id = auth_token_payload.get('user_id', None)
    if user_id is None:
        return

    Context().user = UserContext(user_id, auth_token_payload.get('is_admin', False))


def _create_current_timestamp() -> int:
    return int(time())
