import connexion

from swagger_server.models import Lineup

from police_lineups.controllers.utils import Responses


def add_lineup(body):
    if connexion.request.is_json:
        body = Lineup.from_dict(connexion.request.get_json())

    return Responses.SUCCESS


def update_lineup(body, lineup_id):
    if connexion.request.is_json:
        body = Lineup.from_dict(connexion.request.get_json())

    return Responses.SUCCESS


def remove_lineup(lineup_id):
    return Responses.SUCCESS
