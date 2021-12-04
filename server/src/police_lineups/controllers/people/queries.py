from swagger_server.models import Person

from police_lineups.db import DbPerson


def get_people():
    return [
        Person(id=db_person.id,
               pid=db_person.pid,
               name=db_person.name,
               born=db_person.born,
               nationality=db_person.nationality,
               features=db_person.features)
        for db_person in DbPerson.select()]


def get_person(id):
    db_person: DbPerson = DbPerson.get_by_id(id)
    return Person(
        id=db_person.id,
        pid=db_person.pid,
        name=db_person.name,
        born=db_person.born,
        nationality=db_person.nationality,
        features=db_person.features)
