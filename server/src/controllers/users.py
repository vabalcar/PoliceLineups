"""
Controller for working with users.
"""
import connexion

from werkzeug.security import generate_password_hash

from police_lineups.mysql.utils import MysqlDBTable
from swagger_server.models.user import User
from swagger_server.models.response import Response


def get_users():  # noqa: E501
    """Returns a list of users.

     # noqa: E501


    :rtype: List[User]
    """

    return MysqlDBTable('users').content()

def get_user(username):  # noqa: E501
    """Returns a user.

     # noqa: E501

    :param id: ID of the user.
    :type id: int

    :rtype: User
    """

    return MysqlDBTable('users').find(username=username)

def add_user(body):  # noqa: E501
    """Adds a user

     # noqa: E501

    :param body: a user to add
    :type body: dict | bytes

    :rtype: Response
    """

    if connexion.request.is_json:
        user = User.from_dict(connexion.request.get_json())  # noqa: E501

    success = False

    if user is None:
        return Response(success)

    user.password = generate_password_hash(user.password)

    if not MysqlDBTable('users').contains(username=user.username):
        success = MysqlDBTable('users').insert(user) == 1

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
        new_values = User.from_dict(connexion.request.get_json())  # noqa: E501

    success = new_values is not None \
        and MysqlDBTable('users').update(new_values, username=username) == 1
    return Response(success)

def remove_user(username):  # noqa: E501
    """Unregisters an user

     # noqa: E501

    :param user: an user to unregister
    :type user: 

    :rtype: object
    """

    success = MysqlDBTable('users').delete(username=username) == 1
    return Response(success)
