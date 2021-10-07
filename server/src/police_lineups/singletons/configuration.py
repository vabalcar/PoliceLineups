import os
from police_lineups.configurations.db import DBConfiguration
from police_lineups.configurations.server import ServerConfiguration

from police_lineups.utils.singleton import Singleton
from police_lineups.utils.json import parse_json_file

CONFIG_DIR = os.path.join('..', '..', 'config')


class Configuration(metaclass=Singleton):

    @property
    def db(self) -> DBConfiguration:
        return self._db_configuration

    @property
    def server(self) -> ServerConfiguration:
        return self._server_configuration

    def __init__(self) -> None:
        self._db_configuration = DBConfiguration(parse_json_file(CONFIG_DIR, 'db.json'))
        self._server_configuration = ServerConfiguration(parse_json_file(CONFIG_DIR, 'server.json'))
