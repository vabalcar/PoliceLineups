import secrets
from typing import Mapping


class AuthTokenConfiguration:

    @property
    def issuer(self) -> str:
        return self._issuer

    @property
    def lifetime(self) -> int:
        return self._lifetime

    @property
    def secret(self) -> str:
        return self._secret

    @property
    def algorithm(self) -> str:
        return self._algorithm

    def __init__(self, raw_auth_config: Mapping) -> None:
        self._issuer = 'police_lineups'
        self._lifetime = raw_auth_config.get('lifetime')
        self._secret = raw_auth_config.get('secret', secrets.token_urlsafe(32))
        self._algorithm = 'HS256'  # https://en.wikipedia.org/wiki/HMAC
