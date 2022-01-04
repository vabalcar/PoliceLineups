from swagger_server.models import Person

from police_lineups.controllers.utils import Responses
from police_lineups.db import DbPerson


def get_people(full_name=None, min_age=None, max_age=None, nationality=None):
    return [
        Person(person_id=db_person.person_id,
               photo_blob_name=db_person.photo_blob_name,
               full_name=db_person.full_name,
               birth_date=db_person.birth_date,
               nationality=db_person.nationality)
        for db_person in DbPerson.select()]


def get_person(person_id):
    db_person: DbPerson = DbPerson.get_or_none(person_id)
    return Person(
        person_id=db_person.person_id,
        photo_blob_name=db_person.photo_blob_name,
        full_name=db_person.full_name,
        birth_date=db_person.birth_date,
        nationality=db_person.nationality) if db_person else Responses.NOT_FOUND
