from swagger_server.models import User

from police_lineups.controllers.utils import Responses
from police_lineups.db import DbUser
from police_lineups.singletons import Context


def get_users():
    return [
        User(
            user_id=db_user.user_id,
            username=db_user.username,
            is_admin=db_user.is_admin,
            full_name=db_user.full_name)
        for db_user in DbUser.select()]


def get_user(user_id):
    db_user: DbUser = DbUser.get_or_none(user_id)
    return User(
        user_id=db_user.user_id,
        username=db_user.username,
        is_admin=db_user.is_admin,
        full_name=db_user.full_name) if db_user else Responses.NOT_FOUND


def get_current_user():
    return get_user(Context().user.user_id)
