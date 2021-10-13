from typing import Mapping

from police_lineups.singletons.program_arguments import ProgramArguments


class ServerConfiguration:

    @property
    def host(self) -> str:
        return self._host

    @property
    def port(self) -> int:
        return self._port

    @property
    def is_debug_mode(self) -> bool:
        return self._is_debug_mode

    def __init__(self, raw_server_config: Mapping) -> None:
        self._host = raw_server_config.get('host')
        self._port = raw_server_config.get('port')
        self._is_debug_mode = ProgramArguments().is_debug_mode
