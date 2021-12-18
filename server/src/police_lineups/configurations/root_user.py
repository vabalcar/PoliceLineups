from typing import Mapping
from werkzeug.security import generate_password_hash


class RootUserConfiguration:

    @property
    def user_id(self) -> str:
        return self._user_id

    @property
    def username(self) -> str:
        return self._username

    @property
    def default_full_name(self) -> str:
        return self._default_full_name

    @property
    def default_password(self) -> str:
        return self._default_password

    def __init__(self, raw_root_user_config: Mapping,
                 raw_root_user_config_for_server: Mapping) -> None:
        self._user_id = 1
        self._username = raw_root_user_config.get('username')
        self._default_full_name = raw_root_user_config_for_server.get(
            'defaultFullName')
        self._default_password = generate_password_hash(
            raw_root_user_config_for_server.get('defaultPassword'))
