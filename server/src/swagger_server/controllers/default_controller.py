import connexion
import six

from swagger_server.models.auth_request import AuthRequest  # noqa: E501
from swagger_server.models.auth_response import AuthResponse  # noqa: E501
from swagger_server.models.auth_token_renewal_response import AuthTokenRenewalResponse  # noqa: E501
from swagger_server.models.empty_response import EmptyResponse  # noqa: E501
from swagger_server.models.lineup import Lineup  # noqa: E501
from swagger_server.models.lineup_overview import LineupOverview  # noqa: E501
from swagger_server.models.person import Person  # noqa: E501
from swagger_server.models.response import Response  # noqa: E501
from swagger_server.models.user import User  # noqa: E501
from swagger_server.models.user_with_password import UserWithPassword  # noqa: E501
from swagger_server import util


def add_lineup(body):  # noqa: E501
    """Adds a lineup

     # noqa: E501

    :param body: a lineup to add
    :type body: dict | bytes

    :rtype: Response
    """
    if connexion.request.is_json:
        body = Lineup.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def add_person(full_name, birth_date, nationality, photo_file):  # noqa: E501
    """Adds a person

     # noqa: E501

    :param full_name: 
    :type full_name: str
    :param birth_date: 
    :type birth_date: str
    :param nationality: 
    :type nationality: str
    :param photo_file: 
    :type photo_file: strstr

    :rtype: Response
    """
    return 'do some magic!'


def add_user(body):  # noqa: E501
    """Adds a user

     # noqa: E501

    :param body: a user to add
    :type body: dict | bytes

    :rtype: Response
    """
    if connexion.request.is_json:
        body = UserWithPassword.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def get_blob(blob_name):  # noqa: E501
    """Serves a blob

     # noqa: E501

    :param blob_name: name of a blob to serve
    :type blob_name: str

    :rtype: str
    """
    return 'do some magic!'


def get_current_user():  # noqa: E501
    """Returns a user

     # noqa: E501


    :rtype: User
    """
    return 'do some magic!'


def get_lineup(lineup_id):  # noqa: E501
    """Returns a lineup

     # noqa: E501

    :param lineup_id: id of a lineup
    :type lineup_id: int

    :rtype: Lineup
    """
    return 'do some magic!'


def get_lineup_recommendations(body):  # noqa: E501
    """Returns a list of recommended people based on list of people in lineup

     # noqa: E501

    :param body: list of people in lineup
    :type body: list | bytes

    :rtype: List[Person]
    """
    if connexion.request.is_json:
        body = [Person.from_dict(d) for d in connexion.request.get_json()]  # noqa: E501
    return 'do some magic!'


def get_lineups():  # noqa: E501
    """Returns a list of lineups for all users

     # noqa: E501


    :rtype: List[LineupOverview]
    """
    return 'do some magic!'


def get_lineups_for_current_user():  # noqa: E501
    """Returns a list of lineups for all users

     # noqa: E501


    :rtype: List[LineupOverview]
    """
    return 'do some magic!'


def get_people(full_name=None, min_age=None, max_age=None, nationality=None):  # noqa: E501
    """Returns a list of people

     # noqa: E501

    :param full_name: 
    :type full_name: str
    :param min_age: 
    :type min_age: int
    :param max_age: 
    :type max_age: int
    :param nationality: 
    :type nationality: str

    :rtype: List[Person]
    """
    return 'do some magic!'


def get_person(person_id):  # noqa: E501
    """Returns a person

     # noqa: E501

    :param person_id: id of a person
    :type person_id: int

    :rtype: Person
    """
    return 'do some magic!'


def get_user(user_id):  # noqa: E501
    """Returns a user

     # noqa: E501

    :param user_id: id of a user
    :type user_id: int

    :rtype: User
    """
    return 'do some magic!'


def get_users():  # noqa: E501
    """Returns all users

     # noqa: E501


    :rtype: List[User]
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


def remove_lineup(lineup_id):  # noqa: E501
    """Removes a lineup

     # noqa: E501

    :param lineup_id: id of a lineup
    :type lineup_id: int

    :rtype: Response
    """
    return 'do some magic!'


def remove_person(person_id):  # noqa: E501
    """Removes a person

     # noqa: E501

    :param person_id: id of a person
    :type person_id: int

    :rtype: Response
    """
    return 'do some magic!'


def remove_user(user_id):  # noqa: E501
    """Removes a user

     # noqa: E501

    :param user_id: id of a user
    :type user_id: int

    :rtype: Response
    """
    return 'do some magic!'


def renew_auth_token():  # noqa: E501
    """Renews auth token

     # noqa: E501


    :rtype: AuthTokenRenewalResponse
    """
    return 'do some magic!'


def update_blob(blob, blob_name):  # noqa: E501
    """Updates a blob

     # noqa: E501

    :param blob: 
    :type blob: strstr
    :param blob_name: name of a blob
    :type blob_name: str

    :rtype: Response
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
        body = UserWithPassword.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def update_lineup(body, lineup_id):  # noqa: E501
    """Updates a lineup

     # noqa: E501

    :param body: a lineup to update
    :type body: dict | bytes
    :param lineup_id: id of a lineup
    :type lineup_id: int

    :rtype: Response
    """
    if connexion.request.is_json:
        body = Lineup.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def update_person(body, person_id):  # noqa: E501
    """Updates a person

     # noqa: E501

    :param body: a person to update
    :type body: dict | bytes
    :param person_id: id of a person
    :type person_id: int

    :rtype: Response
    """
    if connexion.request.is_json:
        body = Person.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def update_user(body, user_id):  # noqa: E501
    """Updates a user

     # noqa: E501

    :param body: update of user
    :type body: dict | bytes
    :param user_id: id of a user
    :type user_id: int

    :rtype: Response
    """
    if connexion.request.is_json:
        body = UserWithPassword.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def validate_new_user(body):  # noqa: E501
    """Validated properties of a new user

     # noqa: E501

    :param body: a user to add
    :type body: dict | bytes

    :rtype: Response
    """
    if connexion.request.is_json:
        body = UserWithPassword.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'
