"""
Controller for working with users.
"""
import connexion
from werkzeug.security import generate_password_hash

from swagger_server.models import User, Response, ValidationResponse

from police_lineups.db import DbUser
from police_lineups.singletons import Configuration
from police_lineups.utils import clear_model_update
from swagger_server.models.user_with_password import UserWithPassword


def get_users():  # noqa: E501
    """Returns a list of users.

     # noqa: E501

    :rtype: List[User]
    """

    return [
        User(
            user_id=db_user.user_id,
            username=db_user.username,
            is_admin=db_user.is_admin,
            full_name=db_user.full_name)
        for db_user in DbUser.select()]


def get_user(user_id):  # noqa: E501
    """Returns a user.

     # noqa: E501

    :rtype: User
    """

    db_user: DbUser = DbUser.get_by_id(user_id)
    return User(
        user_id=db_user.user_id,
        username=db_user.username,
        is_admin=db_user.is_admin,
        full_name=db_user.full_name)


def get_current_user():  # noqa: E501
    """Returns a user

     # noqa: E501

    :rtype: User
    """

    return get_user(connexion.context['current_user_id'])


def add_user(body):  # noqa: E501
    """Adds a user

     # noqa: E501

    :param body: a user to add
    :type body: dict | bytes

    :rtype: Response
    """

    if connexion.request.is_json:
        user = UserWithPassword.from_dict(connexion.request.get_json())  # noqa: E501
    elif isinstance(body, UserWithPassword):
        user = body

    success = False

    if user is None:
        return Response(success)

    user.password = generate_password_hash(user.password)

    if DbUser.get_or_none(DbUser.user_id == user.user_id) is None:
        DbUser.create(**user.to_dict())
        success = True

    return Response(success)


def validate_password(password: str):
    password_len = len(password)

    if password_len == 0:
        return "Password is empty"

    if password_len > 16:
        return "Password is too long"

    return None


def validate_user_full_name(user_full_name: str):
    user_full_name_len = len(user_full_name)

    if user_full_name_len == 0:
        return "Full name is empty"

    return None


def validate_user_update(body):  # noqa: E501
    """Validated an update of a user

     # noqa: E501

    :param body: update of a user
    :type body: dict | bytes

    :rtype: Response
    """
    if connexion.request.is_json:
        body = UserWithPassword.from_dict(connexion.request.get_json())  # noqa: E501

    error = None

    if body.password is not None:
        error = validate_password(body.password)

    if body.full_name is not None:
        error = validate_user_full_name(body.full_name)

    return ValidationResponse(success=True, validation_error=error)


def update_user(body, user_id):  # noqa: E501
    """Updates a user

     # noqa: E501

    :rtype: Response
    """
    if connexion.request.is_json:
        body = UserWithPassword.from_dict(connexion.request.get_json())  # noqa: E501

    if body is None:
        return Response(True)

    if body.password is not None:
        body.password = generate_password_hash(body.password)

    success = False

    if body.username is None \
            and (user_id is not Configuration().root_user.user_id or not body.is_admin):
        success = DbUser.update(**clear_model_update(body)).where(DbUser.user_id ==
                                                                  user_id).execute() == 1

    return Response(success)


def update_current_user(body):  # noqa: E501
    """Updates a user

     # noqa: E501

    :param body: update of user
    :type body: dict | bytes

    :rtype: Response
    """

    return update_user(body, connexion.context['current_user_id'])


def remove_user(user_id):  # noqa: E501
    """Unregisters an user

     # noqa: E501

    """

    success = False

    if user_id != Configuration().root_user.user_id:
        success = DbUser.delete_by_id(user_id) == 1

    return Response(success)


def remove_current_user():  # noqa: E501
    """Removes a user

     # noqa: E501


    :rtype: Response
    """

    return remove_user(connexion.context['current_user_id'])
