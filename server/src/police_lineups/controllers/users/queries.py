import connexion
from police_lineups.controllers.users.validations import validate_user_update_internally

from swagger_server.models import User, UserWithPassword

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
    db_user: DbUser = DbUser.get_by_id(user_id)
    if db_user is None:
        return None

    return User(
        user_id=db_user.user_id,
        username=db_user.username,
        is_admin=db_user.is_admin,
        full_name=db_user.full_name)


def get_current_user():
    return get_user(Context().user.user_id)


def validate_user_update(body):
    if connexion.request.is_json:
        body = UserWithPassword.from_dict(connexion.request.get_json())

    error = validate_user_update_internally(body)
    return error if error else Responses.SUCCESS
