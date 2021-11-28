"""
Controller for working with people.
"""
import connexion

from swagger_server.models import Person, Response

from police_lineups.db import DbPerson
from police_lineups.utils import clear_model_update


def get_people():  # noqa: E501
    """
    Returns a list of people.

    :rtype: None
    """

    return [
        Person(id=db_person.id,
               pid=db_person.pid,
               name=db_person.name,
               born=db_person.born,
               nationality=db_person.nationality,
               features=db_person.features)
        for db_person in DbPerson.select()]


def get_person(id):  # noqa: E501
    """
    Returns a person.

    :param person_id: ID of the person.
    :type person_id: int

    :rtype: Person
    """

    db_person: DbPerson = DbPerson.get_by_id(id)
    return Person(
        id=db_person.id,
        pid=db_person.pid,
        name=db_person.name,
        born=db_person.born,
        nationality=db_person.nationality,
        features=db_person.features)


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

    if DbPerson.get_or_none(DbPerson.id == person.id) is None:
        DbPerson.create(**person.to_dict())
        success = True

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
        update = Person.from_dict(connexion.request.get_json())  # noqa: E501

    success = False

    if update is not None:
        success = DbPerson.update(**clear_model_update(update)
                                  ).where(DbPerson.id == id).execute() == 1

    return Response(success)


def remove_person(id):  # noqa: E501
    """Removes a person

     # noqa: E501

    :param id: ID of a person
    :type id: str

    :rtype: Response
    """
    success = DbPerson.delete_by_id(id) == 1
    return Response(success)
