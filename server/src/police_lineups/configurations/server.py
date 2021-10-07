from typing import Mapping


class ServerConfiguration:

    @property
    def host(self) -> str:
        return self._host

    @property
    def port(self) -> int:
        return self._port

    @property
    def is_dev_mode(self) -> bool:
        return self._is_dev_mode

    def __init__(self, raw_server_config: Mapping) -> None:
        self._host = raw_server_config.get('host')
        self._port = raw_server_config.get('port')
        self._is_dev_mode = raw_server_config.get('dev')
