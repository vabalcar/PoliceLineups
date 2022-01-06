from werkzeug.exceptions import Unauthorized

from police_lineups.db import DbLineup
from police_lineups.singletons import Context


def owner_auth_guard(db_lineup: DbLineup):
    if not Context().user.is_admin and db_lineup.owner_id.user_id != Context().user.user_id:
        raise Unauthorized
