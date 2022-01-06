import connexion

from peewee import fn

from swagger_server.models import Person

from police_lineups.db import DbPerson


def get_lineup_recommendations(body):
    if connexion.request.is_json:
        body = [Person.from_dict(d) for d in connexion.request.get_json()]

    return [
        Person(person_id=db_person.person_id,
               photo_blob_name=db_person.photo_blob_name,
               full_name=db_person.full_name,
               birth_date=db_person.birth_date,
               nationality=db_person.nationality)
        for db_person in DbPerson.select().order_by(fn.Rand()).limit(5)]
