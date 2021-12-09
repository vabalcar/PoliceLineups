import connexion

from swagger_server.models import Person

from police_lineups.controllers.utils import clear_model_update, Responses
from police_lineups.db import DbPerson

from .errors import PeopleErrors


def add_person(body):
    if connexion.request.is_json:
        body = Person.from_dict(connexion.request.get_json())

    if DbPerson.get_or_none(DbPerson.id == body.id) is not None:
        return PeopleErrors.PERSON_ALREADY_EXITS

    DbPerson.create(**body.to_dict())

    return Responses.SUCCESS


def update_person(body, person_id):
    if connexion.request.is_json:
        body = Person.from_dict(connexion.request.get_json())

    DbPerson.update(**clear_model_update(body)).where(DbPerson.id == person_id).execute()

    return Responses.SUCCESS


def remove_person(person_id):
    DbPerson.delete_by_id(person_id)
    return Responses.SUCCESS
