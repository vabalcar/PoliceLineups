from typing import Mapping


class DBConfiguration:

    @property
    def host(self) -> str:
        return self._host

    @property
    def user(self) -> str:
        return self._user

    @property
    def password(self) -> str:
        return self._password

    @property
    def database(self) -> str:
        return self._db

    @property
    def port(self) -> int:
        return self._port

    @property
    def max_connections(self) -> int:
        return self._max_connections

    @property
    def stale_timeout(self) -> int:
        return self._stale_timeout

    def __init__(self, raw_db_config: Mapping) -> None:
        self._host = raw_db_config.get('host')
        self._user = raw_db_config.get('user')
        self._password = raw_db_config.get('password')
        self._db = raw_db_config.get('db')
        self._port = raw_db_config.get('port')
        self._max_connections = raw_db_config.get('maxConnections')
        self._stale_timeout = raw_db_config.get('staleTimeout')
