import connexion

from police_lineups.context import UserContext

from .utils import Singleton


class Context(metaclass=Singleton):

    @property
    def user(self) -> UserContext:
        return connexion.context['police_lineups_user']

    @user.setter
    def user(self, user_context: UserContext) -> None:
        connexion.context['police_lineups_user'] = user_context
