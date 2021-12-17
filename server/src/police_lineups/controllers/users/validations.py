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


def validate_new_user_internally(new_user: UserWithPassword, strictly: bool) -> Response:
    if strictly or new_user.username is not None:
        error = _validate_unique_username(new_user.username)
        if error:
            return error

    if strictly or new_user.password is not None:
        error = _validate_password(new_user.password)
        if error:
            return error

    if strictly or new_user.full_name is not None:
        error = _validate_user_full_name(new_user.full_name)
        if error:
            return error

    return None


def validate_user_update_internally(user_update: UserWithPassword) -> Response:
    if user_update.username is not None:
        return UserErrors.USERNAME_CANNOT_BE_CHANGED

    if user_update.password is not None:
        error = _validate_password(user_update.password)
        if error:
            return error

    if user_update.full_name is not None:
        error = _validate_user_full_name(user_update.full_name)
        if error:
            return error

    return None


def _validate_unique_username(username: str) -> Response:
    if len(username) == 0:
        return UserErrors.USERNAME_CANNOT_BE_EMPTY

    if DbUser.get_or_none(DbUser.username == username) is not None:
        return UserErrors.USERNAME_ALREADY_EXITS

    return None


def _validate_password(password: str) -> Response:
    password_len = len(password)

    if password_len == 0:
        return UserErrors.PASSWORD_IS_EMPTY

    if password_len > 16:
        return UserErrors.TOO_LONG_PASSWORD

    return None


def _validate_user_full_name(user_full_name: str) -> Response:
    if len(user_full_name) == 0:
        return UserErrors.FULL_NAME_IS_EMPTY

    return None
