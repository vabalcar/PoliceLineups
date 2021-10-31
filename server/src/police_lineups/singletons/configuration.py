import os

from police_lineups.configurations import DBConfiguration
from police_lineups.utils import parse_json_file, Singleton


class Configuration(metaclass=Singleton):

    @property
    def db(self) -> DBConfiguration:
        return self._db_configuration

    @property
    def config_dir(self) -> str:
        return self._config_dir

    def __init__(self) -> None:
        environment = 'debug' if os.environ.get('FLASK_ENV') == 'development' else 'production'
        self._config_dir = os.path.join('..', '..', 'config', environment)

        self._db_configuration = DBConfiguration(parse_json_file(self._config_dir, 'db.json'))
