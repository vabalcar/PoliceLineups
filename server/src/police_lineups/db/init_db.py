from police_lineups.singletons import Configuration, DB

from .lineup_people import DbLineupPerson
from .lineups import DbLineup
from .people import DbPerson
from .users import DbUser


def init_current_db():
    with DB().current as database:
        database.create_tables([DbUser, DbPerson, DbLineup, DbLineupPerson])

    init_users()


def init_users():
    if len(DbUser) == 0:
        root_user = DbUser(
            is_admin=True,
            username=Configuration().root_user.username,
            email=Configuration().root_user.default_email,
            full_name=Configuration().root_user.default_full_name,
            password=Configuration().root_user.default_password
        )

        root_user.save()
