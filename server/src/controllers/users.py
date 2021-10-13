"""
Controller for working with users.
"""
import connexion
from werkzeug.security import generate_password_hash

from swagger_server.models import User, Response, ValidationResponse

from police_lineups.db_scheme import DbUser
from police_lineups.utils import clear_model_update

ROOT_USERNAME = 'root'
ROOT_DEFAULT_NAME = 'Root'
ROOT_DEFAULT_PASSWORD = '1234'


def init_root_user():
    root_user = User(
        username=ROOT_USERNAME,
        password=ROOT_DEFAULT_PASSWORD,
        name=ROOT_DEFAULT_NAME,
        is_admin=True
    )

    success = add_user(root_user).success

    return Response(success)


def get_users():  # noqa: E501
    """Returns a list of users.

     # noqa: E501


    :rtype: List[User]
    """

    return [
        User(username=db_user.username, name=db_user.name, is_admin=db_user.is_admin)
        for db_user in DbUser.select()]


def get_user(username):  # noqa: E501
    """Returns a user.

     # noqa: E501

    :param id: ID of the user.
    :type id: int

    :rtype: User
    """

    db_user: DbUser = DbUser.get_by_id(username)
    return User(
        username=db_user.username,
        name=db_user.name,
        is_admin=db_user.is_admin)


def get_current_user():  # noqa: E501
    """Returns a user

     # noqa: E501


    :rtype: User
    """

    return get_user(connexion.request.authorization.username)


def add_user(body):  # noqa: E501
    """Adds a user

     # noqa: E501

    :param body: a user to add
    :type body: dict | bytes

    :rtype: Response
    """

    if connexion.request.is_json:
        user = User.from_dict(connexion.request.get_json())  # noqa: E501
    elif isinstance(body, User):
        user = body

    success = False

    if user is None:
        return Response(success)

    user.password = generate_password_hash(user.password)

    if DbUser.get_or_none(DbUser.username == user.username) is None:
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
        body = User.from_dict(connexion.request.get_json())  # noqa: E501

    error = None

    if body.password is not None:
        error = validate_password(body.password)

    if body.name is not None:
        error = validate_user_full_name(body.name)

    return ValidationResponse(success=True, validation_error=error)


def update_user(body, username):  # noqa: E501
    """Updates a user

     # noqa: E501

    :param body: a user to update
    :type body: dict | bytes
    :param username: username of a user
    :type username: str

    :rtype: Response
    """
    if connexion.request.is_json:
        update = User.from_dict(connexion.request.get_json())  # noqa: E501
    elif isinstance(body, User):
        update = body

    if update is None:
        return Response(True)

    if update.password is not None:
        update.password = generate_password_hash(update.password)

    success = False

    if update.username is None \
            and (username is not ROOT_USERNAME or not update.is_admin):
        success = DbUser.update(**clear_model_update(update)).where(DbUser.username ==
                                                                    username).execute() == 1

    return Response(success)


def update_current_user(body):  # noqa: E501
    """Updates a user

     # noqa: E501

    :param body: update of user
    :type body: dict | bytes

    :rtype: Response
    """

    return update_user(body, connexion.request.authorization.username)


def remove_user(username):  # noqa: E501
    """Unregisters an user

     # noqa: E501

    :param user: an user to unregister
    :type user:

    :rtype: object
    """

    success = False

    if username != ROOT_USERNAME:
        success = DbUser.delete_by_id(username) == 1

    return Response(success)


def remove_current_user():  # noqa: E501
    """Removes a user

     # noqa: E501


    :rtype: Response
    """

    return remove_user(connexion.request.authorization.username)
