from police_lineups.controllers.utils import Responses


class AuthErrors:
    INVALID_USER = Responses.error('Invalid user')
    INVALID_CREDENTIALS = Responses.error('Invalid credentials')
