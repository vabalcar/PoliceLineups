from police_lineups.singleton import Singleton
from swagger_server.models import User, Person
from police_lineups.mysql.utils import MysqlDBTable


class DB(metaclass=Singleton):

    _users = MysqlDBTable(User, 'users')
    _people = MysqlDBTable(Person, 'people')

    @ property
    def users(self) -> MysqlDBTable[User]:
        return self._users

    @ property
    def people(self) -> MysqlDBTable[Person]:
        return self._people
