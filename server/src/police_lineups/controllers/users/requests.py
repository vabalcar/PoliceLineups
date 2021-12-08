import connexion
from werkzeug.security import generate_password_hash

from swagger_server.models import UserWithPassword

from police_lineups.controllers.utils import Responses
from police_lineups.db import DbUser
from police_lineups.singletons import Configuration, Context
from police_lineups.utils import clear_model_update

from .errors import UserErrors
from .validations import validate_user_update_internally


def add_user(body):
    if connexion.request.is_json:
        body = UserWithPassword.from_dict(connexion.request.get_json())

    if DbUser.get_or_none(DbUser.user_id == body.user_id):
        return UserErrors.USER_ALREADY_EXITS

    body.password = generate_password_hash(body.password)
    DbUser.create(**body.to_dict())

    return Responses.SUCCESS


def update_user(body, user_id):
    if connexion.request.is_json:
        body = UserWithPassword.from_dict(connexion.request.get_json())

    error = validate_user_update_internally(body)
    if error:
        return error

    if user_id == Configuration().root_user.user_id and not body.is_admin:
        return UserErrors.ROOT_MUST_STAY_ADMIN

    if body.password:
        body.password = generate_password_hash(body.password)

    DbUser.update(**clear_model_update(body)).where(DbUser.user_id ==
                                                    user_id).execute()

    return Responses.SUCCESS


def update_current_user(body):
    return update_user(body, Context().user.user_id)


def remove_user(user_id):
    if user_id == Configuration().root_user.user_id:
        return UserErrors.ROOT_CANNOT_BE_REMOVED

    DbUser.delete_by_id(user_id)

    return Responses.SUCCESS


def remove_current_user():
    return remove_user(Context().user.user_id)
