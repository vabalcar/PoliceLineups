"""
Controller for working with users.
"""
import connexion

from werkzeug.security import generate_password_hash

from police_lineups.mysql.utils import MysqlDBTable
from swagger_server.models.user import User
from swagger_server.models.user_role import UserRole
from swagger_server.models.response import Response

ROOT_USERNAME = 'root'
ROOT_DEFAULT_NAME = 'root'
ROOT_DEFAULT_PASSWORD = '1234'
ROOT_DEFAULT_ROLE = 'admin'

def init_root_user():
    root_user = User(
        username=ROOT_USERNAME, \
        password=ROOT_DEFAULT_PASSWORD, \
        name=ROOT_DEFAULT_NAME
    )
    success = add_user(root_user).success
    success = success and add_user_role([ROOT_DEFAULT_ROLE], ROOT_USERNAME).success
    return Response(success)

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

    results = MysqlDBTable('users').find(username=username)
    if len(results) == 1:
        return results[0]
    else:
        return None

def add_user(body):  # noqa: E501
    """Adds a user

     # noqa: E501

    :param body: a user to add
    :type body: dict | bytes

    :rtype: Response
    """

    if connexion.request.is_json:
        user = User.from_dict(connexion.request.get_json())  # noqa: E501

    if isinstance(body, User):
        user = body

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
        and new_values.get(username) != ROOT_USERNAME \
        and (username != ROOT_USERNAME or new_values.get(username) == ROOT_USERNAME) \
        and MysqlDBTable('users').update(new_values, username=username) == 1
    return Response(success)

def remove_user(username):  # noqa: E501
    """Unregisters an user

     # noqa: E501

    :param user: an user to unregister
    :type user: 

    :rtype: object
    """

    success = username != ROOT_USERNAME and MysqlDBTable('users').delete(username=username) == 1
    return Response(success)

def get_user_roles(username):  # noqa: E501
    """Returns roles of the user

     # noqa: E501

    :param username: username of a user
    :type username: str

    :rtype: List[str]
    """
    return list(map(lambda role: role.role, MysqlDBTable('user_roles').find(username=username)))

def has_user_role(username, role):  # noqa: E501
    """Determines if a user has a role

     # noqa: E501

    :param username: a username of a user
    :type username: str
    :param role: a role of a user
    :type role: str

    :rtype: Response
    """
    success = role in get_user_roles(username)
    return Response(success)

def add_user_role(body, username):  # noqa: E501
    """Extends user roles

     # noqa: E501

    :param body: a user to update
    :type body: List[]
    :param username: username of a user
    :type username: str

    :rtype: Response
    """

    success = False

    for role in body:
        if len(MysqlDBTable('user_roles').find(username=username, role=role)) == 0:
            success = MysqlDBTable('user_roles').insert(UserRole(username, role)) == 1

    return Response(success)

def remove_user_role(username, role):  # noqa: E501
    """Removes a user role

     # noqa: E501

    :param username: a username of a user
    :type username: str
    :param role: a role of a user
    :type role: str

    :rtype: Response
    """

    success = (username != ROOT_USERNAME or role != ROOT_DEFAULT_ROLE) \
        and MysqlDBTable('user_roles').delete(username=username, role=role) == 1
    return Response(success)
