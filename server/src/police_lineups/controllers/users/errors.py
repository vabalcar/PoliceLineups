from police_lineups.controllers.utils import Responses


class UserErrors:
    USERNAME_ALREADY_EXITS = Responses.error('Username already exists')
    USERNAME_CANNOT_BE_EMPTY = Responses.error('Username cannot be empty')
    USERNAME_CANNOT_BE_CHANGED = Responses.error('Username cannot be changed')
    ROOT_MUST_STAY_ADMIN = Responses.error('Root user must stay admin')
    ROOT_CANNOT_BE_REMOVED = Responses.error('Root user cannot be removed')
    PASSWORD_IS_EMPTY = Responses.error('Password is empty')
    TOO_LONG_PASSWORD = Responses.error('Password is too long')
    FULL_NAME_IS_EMPTY = Responses.error('Full name is empty')
