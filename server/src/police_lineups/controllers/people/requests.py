import connexion

from swagger_server.models import Person

from police_lineups.controllers.utils import clear_model_update, Responses
from police_lineups.db import DbPerson
from police_lineups.singletons import BlobStorage


def add_person():
    person = Person.from_dict(connexion.request.form.to_dict())
    photo_file = connexion.request.files.get('photoFile')

    if photo_file is not None:
        person.photo_blob_name = BlobStorage().store(photo_file)

    DbPerson.create(**person.to_dict())

    return Responses.SUCCESS


def update_person(body, person_id):
    if connexion.request.is_json:
        body = Person.from_dict(connexion.request.get_json())

    person: DbPerson = DbPerson.get_or_none(person_id)
    if person is None:
        return Responses.NOT_FOUND

    DbPerson.update(**clear_model_update(body)
                    ).where(DbPerson.person_id == person_id).execute()

    return Responses.SUCCESS


def remove_person(person_id):
    person: DbPerson = DbPerson.get_or_none(person_id)
    if person is None:
        return Responses.NOT_FOUND

    BlobStorage().remove(person.photo_blob_name)
    DbPerson.delete_by_id(person_id)

    return Responses.SUCCESS
