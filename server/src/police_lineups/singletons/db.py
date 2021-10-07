from peewee import Database
from playhouse.pool import PooledMySQLDatabase

from police_lineups.singletons.configuration import Configuration
from police_lineups.utils.singleton import Singleton


class DB(metaclass=Singleton):

    @property
    def current(self) -> Database:
        return self._db

    def __init__(self) -> None:
        self._db = PooledMySQLDatabase(host=Configuration().db.host,
                                       user=Configuration().db.user,
                                       password=Configuration().db.password,
                                       database=Configuration().db.database,
                                       port=Configuration().db.port,
                                       autoconnect=True,
                                       max_connections=32,
                                       stale_timeout=300)
