from police_lineups.singletons import DB

from .db_person import DbPerson
from .db_user import DbUser


def prepare_db():
    with DB().current as database:
        database.create_tables([DbPerson, DbUser])
