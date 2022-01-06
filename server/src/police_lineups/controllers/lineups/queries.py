from typing import List

from werkzeug.exceptions import Unauthorized

from swagger_server.models import Lineup, Person

from police_lineups.controllers.utils.responses import Responses
from police_lineups.db import DbLineup, DbLineupPerson, DbPerson, DbUser
from police_lineups.singletons import Context


def get_lineups():
    return [
        Lineup(
            lineup_id=db_lineup.lineup_id,
            name=db_lineup.name,
            last_edit_date_time=db_lineup.last_edit_date_time,
            owner_username=db_lineup.owner_id.username) for db_lineup in DbLineup.select().join(DbUser)]


def get_lineups_for_current_user():
    return [
        Lineup(
            lineup_id=db_lineup.lineup_id,
            name=db_lineup.name,
            last_edit_date_time=db_lineup.last_edit_date_time) for db_lineup in DbLineup.select().where(
            DbLineup.owner_id == Context().user.user_id)]


def get_lineup(lineup_id):
    db_lineup: DbLineup = DbLineup.get_or_none(lineup_id)
    if db_lineup is None:
        return Responses.NOT_FOUND

    if not Context().user.is_admin and db_lineup.owner_id != Context().user.user_id:
        raise Unauthorized

    lineup_people: List[Person] = [
        Person(
            person_id=db_lineup_person.person_id.person_id,
            photo_blob_name=db_lineup_person.person_id.photo_blob_name,
            full_name=db_lineup_person.person_id.full_name,
            birth_date=db_lineup_person.person_id.birth_date,
            nationality=db_lineup_person.person_id.nationality)
        for db_lineup_person in DbLineupPerson.select().join(DbPerson).where(
            DbLineupPerson.lineup_id == lineup_id)]

    return Lineup(
        lineup_id=db_lineup.lineup_id,
        name=db_lineup.name,
        last_edit_date_time=db_lineup.last_edit_date_time,
        people=lineup_people)
