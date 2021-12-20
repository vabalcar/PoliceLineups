import connexion

from swagger_server.models import Response, UserWithPassword

from police_lineups.controllers.utils import Responses
from police_lineups.db import DbUser

from .errors import UserErrors


def validate_new_user(body):
    if connexion.request.is_json:
        body = UserWithPassword.from_dict(connexion.request.get_json())

    error = validate_new_user_internally(body, strictly=False)
    return error if error else Responses.SUCCESS


def validate_new_user_internally(
        new_user: UserWithPassword,
        strictly: bool) -> Response:

    if strictly or new_user.username is not None:
        error = _validate_unique_username(new_user.username)
        if error:
            return error

    if not strictly:
        return None

    if new_user.password is None:
        return UserErrors.PASSWORD_IS_EMPTY

    if new_user.email is None:
        return UserErrors.EMAIL_IS_EMPTY

    if new_user.full_name is None:
        return UserErrors.FULL_NAME_IS_EMPTY

    return None


def _validate_unique_username(username: str) -> Response:
    if username is None:
        return UserErrors.USERNAME_IS_EMPTY

    if DbUser.get_or_none(DbUser.username == username) is not None:
        return UserErrors.USERNAME_ALREADY_EXITS

    return None
