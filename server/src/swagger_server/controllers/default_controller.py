import connexion
import six

from swagger_server.models.auth_request import AuthRequest  # noqa: E501
from swagger_server.models.auth_response import AuthResponse  # noqa: E501
from swagger_server.models.auth_token_renewal_response import AuthTokenRenewalResponse  # noqa: E501
from swagger_server.models.person import Person  # noqa: E501
from swagger_server.models.response import Response  # noqa: E501
from swagger_server.models.user import User  # noqa: E501
from swagger_server.models.validation_response import ValidationResponse  # noqa: E501
from swagger_server import util


def add_person(body):  # noqa: E501
    """Adds a person

     # noqa: E501

    :param body: a person to add
    :type body: dict | bytes

    :rtype: Response
    """
    if connexion.request.is_json:
        body = Person.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def add_user(body):  # noqa: E501
    """Adds a user

     # noqa: E501

    :param body: a user to add
    :type body: dict | bytes

    :rtype: Response
    """
    if connexion.request.is_json:
        body = User.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def get_current_user():  # noqa: E501
    """Returns a user

     # noqa: E501


    :rtype: User
    """
    return 'do some magic!'


def get_people():  # noqa: E501
    """Returns a list of people

     # noqa: E501


    :rtype: List[Person]
    """
    return 'do some magic!'


def get_person(id):  # noqa: E501
    """Returns a person

     # noqa: E501

    :param id: ID of the person
    :type id: int

    :rtype: Person
    """
    return 'do some magic!'


def get_user(username):  # noqa: E501
    """Returns a user

     # noqa: E501

    :param username: username of a userUser
    :type username: str

    :rtype: User
    """
    return 'do some magic!'


def get_users():  # noqa: E501
    """Returns all users

     # noqa: E501


    :rtype: List[User]
    """
    return 'do some magic!'


def init_root_user():  # noqa: E501
    """Inits root user

     # noqa: E501


    :rtype: Response
    """
    return 'do some magic!'


def login(body):  # noqa: E501
    """Logins registered userUser

     # noqa: E501

    :param body: AuthRequest
    :type body: dict | bytes

    :rtype: AuthResponse
    """
    if connexion.request.is_json:
        body = AuthRequest.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def remove_current_user():  # noqa: E501
    """Removes a user

     # noqa: E501


    :rtype: Response
    """
    return 'do some magic!'


def remove_person(id):  # noqa: E501
    """Removes a person

     # noqa: E501

    :param id: ID of a person
    :type id: str

    :rtype: Response
    """
    return 'do some magic!'


def remove_user(username):  # noqa: E501
    """Removes a user

     # noqa: E501

    :param username: a username of a user
    :type username: str

    :rtype: Response
    """
    return 'do some magic!'


def renew_auth_token():  # noqa: E501
    """Renews auth token

     # noqa: E501


    :rtype: AuthTokenRenewalResponse
    """
    return 'do some magic!'


def update_current_user(body):  # noqa: E501
    """Updates a user

     # noqa: E501

    :param body: update of user
    :type body: dict | bytes

    :rtype: Response
    """
    if connexion.request.is_json:
        body = User.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def update_person(body, id):  # noqa: E501
    """Updates a person

     # noqa: E501

    :param body: a person to update
    :type body: dict | bytes
    :param id: name of a person
    :type id: str

    :rtype: Response
    """
    if connexion.request.is_json:
        body = Person.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def update_user(body, username):  # noqa: E501
    """Updates a user

     # noqa: E501

    :param body: update of user
    :type body: dict | bytes
    :param username: username of a user
    :type username: str

    :rtype: Response
    """
    if connexion.request.is_json:
        body = User.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def validate_user_update(body):  # noqa: E501
    """Validated an update of a user

     # noqa: E501

    :param body: update of a user
    :type body: dict | bytes

    :rtype: ValidationResponse
    """
    if connexion.request.is_json:
        body = User.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'
