from swagger_server.models import User, Person
from police_lineups.mysql.utils import MysqlDBConnector, MysqlDBTable

_db_tables = {
    'users': User,
    'people': Person,
}


def setup_db():

    MysqlDBConnector().load_db_config('..', '..', 'config', 'db.json')

    for table in _db_tables:
        MysqlDBTable(table).set_entity_type(_db_tables[table])
