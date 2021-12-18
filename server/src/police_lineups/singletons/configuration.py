import os

from police_lineups.configurations import AuthTokenConfiguration, DBConfiguration, RootUserConfiguration
from police_lineups.utils import parse_json_file

from .utils import Singleton


class Configuration(metaclass=Singleton):

    @property
    def config_dir(self) -> str:
        return self._config_dir

    @property
    def db(self) -> DBConfiguration:
        return self._db_config

    @property
    def root_user(self) -> RootUserConfiguration:
        return self._root_user_config

    @property
    def auth_token(self) -> AuthTokenConfiguration:
        return self._auth_token_config

    def __init__(self) -> None:
        environment = 'debug' if os.environ.get(
            'FLASK_ENV') == 'development' else 'production'
        self._config_dir = os.path.join('..', '..', 'config', environment)

        self._db_config = DBConfiguration(
            parse_json_file(self._config_dir, 'db.json'))
        self._root_user_config = RootUserConfiguration(
            parse_json_file(self._config_dir, 'root.json'),
            parse_json_file(self._config_dir, 'rootForServer.json'))
        self._auth_token_config = AuthTokenConfiguration(
            parse_json_file(self._config_dir, 'auth.json'))
