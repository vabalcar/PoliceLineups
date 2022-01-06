from datetime import datetime
import connexion
from dateutil.relativedelta import relativedelta

from swagger_server.models import Person

from police_lineups.controllers.utils import Responses
from police_lineups.db import DbPerson


def get_people(full_name=None, min_age=None, max_age=None, nationality=None):

    full_name = connexion.request.args.get('fullName', None)
    min_age = connexion.request.args.get('minAge', None)
    max_age = connexion.request.args.get('maxAge', None)
    nationality = connexion.request.args.get('nationality', None)

    where_clauses = []

    if full_name is not None:
        where_clauses.append(DbPerson.full_name.contains(full_name))

    if min_age is not None:
        min_age_date = datetime.now() - relativedelta(years=int(min_age))
        where_clauses.append(DbPerson.birth_date > min_age_date)

    if max_age is not None:
        max_age_date = datetime.now() - relativedelta(years=int(max_age))
        where_clauses.append(DbPerson.birth_date < max_age_date)

    if nationality is not None:
        where_clauses.append(DbPerson.nationality == nationality)

    query = DbPerson.select().where(
        *where_clauses) if len(where_clauses) > 0 else DbPerson.select()

    return [
        Person(person_id=db_person.person_id,
               photo_blob_name=db_person.photo_blob_name,
               full_name=db_person.full_name,
               birth_date=db_person.birth_date,
               nationality=db_person.nationality)
        for db_person in query]


def get_person(person_id):
    db_person: DbPerson = DbPerson.get_or_none(person_id)
    return Person(
        person_id=db_person.person_id,
        photo_blob_name=db_person.photo_blob_name,
        full_name=db_person.full_name,
        birth_date=db_person.birth_date,
        nationality=db_person.nationality) if db_person else Responses.NOT_FOUND
