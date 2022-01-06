from datetime import datetime
import connexion

from swagger_server.models import Lineup

from police_lineups.controllers.utils import Responses
from police_lineups.db import DbLineup, DbLineupPerson
from police_lineups.singletons import Context


def add_lineup(body):
    if connexion.request.is_json:
        body = Lineup.from_dict(connexion.request.get_json())

    new_lineup = DbLineup.create(
        name=body.name,
        last_edit_date_time=datetime.now(),
        owner_id=Context().user.user_id)

    for person in body.people:
        DbLineupPerson.create(
            person_id=person.person_id,
            lineup_id=new_lineup.lineup_id)

    return Responses.SUCCESS


def update_lineup(body, lineup_id):
    if connexion.request.is_json:
        body = Lineup.from_dict(connexion.request.get_json())

    lineup: DbLineup = DbLineup.get_or_none(lineup_id)
    if lineup is None:
        return Responses.NOT_FOUND

    if body.name is not None:
        DbLineup.update({DbLineup.name: body.name}
                        ).where(DbLineup.lineup_id == lineup_id).execute()

    if body.people is not None:
        DbLineupPerson.delete().where(DbLineupPerson.lineup_id == lineup_id).execute()
        for person in body.people:
            DbLineupPerson.create(
                person_id=person.person_id,
                lineup_id=lineup_id)

    return Responses.SUCCESS


def remove_lineup(lineup_id):
    lineup: DbLineup = DbLineup.get_or_none(lineup_id)
    if lineup is None:
        return Responses.NOT_FOUND

    DbLineupPerson.delete().where(DbLineupPerson.lineup_id == lineup_id).execute()
    DbLineup.delete_by_id(lineup_id)

    return Responses.SUCCESS
