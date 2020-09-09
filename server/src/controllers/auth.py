import connexion

from flask import session
from werkzeug.security import generate_password_hash, check_password_hash

from swagger_server.models import Response, AuthRequest, AuthResponse, User
from police_lineups.mysql.utils import MysqlDBTable

def login(request=None):  # noqa: E501
    """Logins registered user

     # noqa: E501

    :param request: AuthRequest
    :type request: dict | bytes

    :rtype: object
    """
    if connexion.request.is_json:
        request = AuthRequest.from_dict(connexion.request.get_json())  # noqa: E501

    success = False
    path = '/'

    username = request.username
    password = request.password

    result = MysqlDBTable('users').find(username=username)
    success = len(result) == 1 and  check_password_hash(result[0].password, password)

    if success:
        session['username'] = username
        path = request.path

    return AuthResponse(success, path)

def is_logged_in():  # noqa: E501
    """Checks if an user is logged-in

     # noqa: E501


    :rtype: object
    """

    success = 'username' in session
    return Response(success)

def logout():  # noqa: E501
    """Logouts logged-in user

     # noqa: E501


    :rtype: object
    """

    success = False

    if len(session) > 0:
        session.clear()
        success = True

    return Response(success)

def register(user):  # noqa: E501
    """Logins registered user

     # noqa: E501

    :param request: an user to register
    :type request:

    :rtype: object
    """

    if connexion.request.is_json:
        user = User.from_dict(connexion.request.get_json())  # noqa: E501

    user.password = generate_password_hash(user.password)

    success = False

    if not MysqlDBTable('users').contains(username=user.username):
        success = MysqlDBTable('users').insert(user) == 1

    return Response(success)

def unregister(user):  # noqa: E501
    """Unregisters an user

     # noqa: E501

    :param user: an user to unregister
    :type user: 

    :rtype: object
    """

    if connexion.request.is_json:
        user = User.from_dict(connexion.request.get_json())  # noqa: E501

    success = False

    if session.get('username') == user.username:
        success = logout().success and MysqlDBTable('users').delete(username=user.username) == 1

    return Response(success)
