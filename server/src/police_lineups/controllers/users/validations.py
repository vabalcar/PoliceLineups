from typing import Union

from swagger_server.models import User

from .errors import UserErrors


def validate_user_update_internally(user_update: User) -> Union[str, None]:
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


def _validate_password(password: str) -> Union[str, None]:
    password_len = len(password)

    if password_len == 0:
        return UserErrors.PASSWORD_IS_EMPTY

    if password_len > 16:
        return UserErrors.TOO_LONG_PASSWORD

    return None


def _validate_user_full_name(user_full_name: str) -> Union[str, None]:
    if len(user_full_name) == 0:
        return UserErrors.FULL_NAME_IS_EMPTY

    return None
