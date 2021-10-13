from os import path

from police_lineups.configurations import DBConfiguration, ServerConfiguration
from police_lineups.utils import parse_json_file, Singleton

from .program_arguments import ProgramArguments


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
        self._server_configuration = ServerConfiguration(
            parse_json_file(config_dir, 'server.json'),
            ProgramArguments().is_debug_mode)
