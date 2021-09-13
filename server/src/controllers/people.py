"""
Controller for working with people.
"""
import connexion

from swagger_server.models.person import Person
from swagger_server.models.response import Response

from police_lineups.mysql.db import DB


def get_people():  # noqa: E501
    """
    Returns a list of people.

    :rtype: None
    """

    return DB().people.content()


def get_person(id):  # noqa: E501
    """
    Returns a person.

    :param person_id: ID of the person.
    :type person_id: int

    :rtype: Person
    """

    return DB().people.find_one(id=id)


def add_person(body):  # noqa: E501
    """Adds a person

     # noqa: E501

    :param body: a person to add
    :type body: dict | bytes

    :rtype: Response
    """
    if connexion.request.is_json:
        person = Person.from_dict(connexion.request.get_json())  # noqa: E501

    success = False

    if person is None:
        return Response(success)

    if not DB().people.contains(id=person.id):
        success = DB().people.insert_one(person)

    return Response(success)


def update_person(body, id):  # noqa: E501
    """Updates a person

     # noqa: E501

    :param body: a person to update
    :type body: dict | bytes
    :param id: ID of a person
    :type id: str

    :rtype: Response
    """
    if connexion.request.is_json:
        new_values = Person.from_dict(connexion.request.get_json())  # noqa: E501

    success = new_values is not None \
        and DB().people.update_one(new_values, id=id)
    return Response(success)


def remove_person(id):  # noqa: E501
    """Removes a person

     # noqa: E501

    :param id: ID of a person
    :type id: str

    :rtype: Response
    """
    success = DB().people.delete_one(id=id)
    return Response(success)
