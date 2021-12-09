from peewee import Database
from playhouse.pool import PooledMySQLDatabase

from .configuration import Configuration
from .utils import Singleton


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
                                       max_connections=Configuration().db.max_connections,
                                       stale_timeout=Configuration().db.stale_timeout)
