"""
Controller for working with users.
"""
import connexion

from werkzeug.security import generate_password_hash

from swagger_server.models.user import User
from swagger_server.models.response import Response

from police_lineups.mysql.db import DB

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

    return DB().users.content()


def get_user(username):  # noqa: E501
    """Returns a user.

     # noqa: E501

    :param id: ID of the user.
    :type id: int

    :rtype: User
    """

    return DB().users.find_one(username=username)


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

    if not DB().users.contains(username=user.username):
        success = DB().users.insert_one(user)

    return Response(success)


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

    success = update.username is None \
        and (username is not ROOT_USERNAME or not update.is_admin) \
        and DB().users.update_one(update, username=username)

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

    success = username != ROOT_USERNAME and DB().users.delete_one(username=username)
    return Response(success)


def remove_current_user():  # noqa: E501
    """Removes a user

     # noqa: E501


    :rtype: Response
    """

    return remove_user(connexion.request.authorization.username)
