from police_lineups.singletons import Configuration, DB

from .people import DbPerson
from .users import DbUser


def init_current_db():
    with DB().current as database:
        database.create_tables([DbPerson, DbUser])

    init_users()


def init_users():
    if len(DbUser) == 0:
        root_user = DbUser(
            username=Configuration().root_user.username,
            password=Configuration().root_user.default_password,
            is_admin=True,
            full_name=Configuration().root_user.default_full_name)

        root_user.save()
