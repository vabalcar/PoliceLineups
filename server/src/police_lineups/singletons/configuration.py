from os import path

from police_lineups.configurations.db import DBConfiguration
from police_lineups.configurations.server import ServerConfiguration
from police_lineups.singletons.program_arguments import ProgramArguments
from police_lineups.utils.singleton import Singleton
from police_lineups.utils.json import parse_json_file


class Configuration(metaclass=Singleton):

    @property
    def db(self) -> DBConfiguration:
        return self._db_configuration

    @property
    def server(self) -> ServerConfiguration:
        return self._server_configuration

    def __init__(self) -> None:
        environment = 'debug' if ProgramArguments().is_debug_mode else 'production'
        config_dir = path.join('..', '..', 'config', environment)

        self._db_configuration = DBConfiguration(parse_json_file(config_dir, 'db.json'))
        self._server_configuration = ServerConfiguration(parse_json_file(config_dir, 'server.json'))
