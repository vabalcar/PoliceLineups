from swagger_server.models.lineup import Lineup

from police_lineups.db import DbLineup, DbUser
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
    return None
