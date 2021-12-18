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
    def default_password(self) -> str:
        return self._default_password

    @property
    def default_full_name(self) -> str:
        return self._default_full_name

    def __init__(self, raw_root_user_config: Mapping) -> None:
        self._user_id = 1
        self._username = raw_root_user_config.get('username')
        self._default_password = generate_password_hash(
            raw_root_user_config.get('defaultPassword'))
        self._default_full_name = raw_root_user_config.get('defaultFullName')
