from peewee import Database
from playhouse.pool import PooledMySQLDatabase

from police_lineups.utils.singleton import Singleton
from police_lineups.utils.json import parse_json_file


class DBConnector(metaclass=Singleton):

    @property
    def database(self) -> Database:
        if self._db is None:
            self._db = PooledMySQLDatabase(host=self.db_config['host'],
                                           user=self.db_config['user'],
                                           password=self.db_config['password'],
                                           database=self.db_config['db'],
                                           port=self.db_config['port'],
                                           autoconnect=True,
                                           max_connections=32,
                                           stale_timeout=300)

        return self._db

    def __init__(self) -> None:
        self.db_config = parse_json_file('..', '..', 'config', 'db.json')
        self._db = None
