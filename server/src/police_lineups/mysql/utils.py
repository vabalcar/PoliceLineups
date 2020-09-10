import mysql.connector
import sqlparse

from police_lineups.singleton import Singleton
from police_lineups.json.utils import parse_json_file

class MysqlDBConnector(metaclass=Singleton):

    def __init__(self):
        self.db_config = None

    def load_db_config(self, db_config_path, *db_config_path_children):
        self.db_config = parse_json_file(db_config_path, *db_config_path_children)

    def connect(self):
        return mysql.connector.connect(
            host=self.db_config['host'],
            user=self.db_config['user'],
            passwd=self.db_config['password'],
            database=self.db_config['db'],
            port=self.db_config['port']
        ) if self.db_config is not None else None

class MysqlAnalyzer:

    _keyword_values = ['NULL', 'TRUE', 'FALSE']

    @staticmethod
    def parse_mysql_singleton(t: type, s):
        parsed = sqlparse.parse(f'{s}')
        return parsed[0][0] \
            if len(parsed) == 1 \
                and len(parsed[0].tokens) == 1 \
                and isinstance(parsed[0][0], t) \
            else None

    @staticmethod
    def is_mysql_value(s) -> bool:
        token = MysqlAnalyzer.parse_mysql_singleton(sqlparse.sql.Token, s)
        return token is not None \
                    and (token.ttype in sqlparse.tokens.Literal \
                        or (token.ttype in sqlparse.tokens.Keyword \
                            and f"{token}".upper() in MysqlAnalyzer._keyword_values))

    @staticmethod
    def assert_mysql_value(s):
        assert MysqlAnalyzer.is_mysql_value(s), f"{s} is not a MySQL value"

    @staticmethod
    def is_mysql_identifier(s) -> bool:
        return MysqlAnalyzer.parse_mysql_singleton(sqlparse.sql.Identifier, s) is not None

    @staticmethod
    def assert_mysql_identifier(s):
        assert MysqlAnalyzer.is_mysql_identifier(s), f"{s} is not a MySQL identifier"

class MysqlDBTable(metaclass=Singleton):

    def set_entity_type(self, entity_type: type):
        self.entity_type = entity_type

    def __init__(self, name: str):

        MysqlAnalyzer.assert_mysql_identifier(name)

        self.name = name
        self.entity_type = None
        self.header = None

        self.get_header()

    def assert_type(self, o: object):
        if self.entity_type is not None and not isinstance(o, self.entity_type):
            raise TypeError(f'Typed table {self.name} accepts only objects of type {self.entity_type}')

    def assert_header(self, **kwargs):
        for kwarg in kwargs:
            if kwarg not in self.header:
                raise TypeError(f"type {self.entity_type} does not contain property {kwarg}")

    def _to_mysql_value(self, value) -> str:
        if isinstance(value, str):
            mysql_value = f"'{value}'"
        elif value is None:
            mysql_value = 'null'
        else:
            mysql_value = f"{value}"

        MysqlAnalyzer.assert_mysql_value(mysql_value)

        return mysql_value

    def _to_mysql_columns(self, o: object) -> str:

        self.assert_type(o)

        columns = []
        for column in self.header:
            if hasattr(o, column) and getattr(o, column) is not None:
                columns.append(f'{column}')
            else:
                continue

        return f"({', '.join(columns)})"

    def _to_mysql_values(self, o: object) -> str:

        self.assert_type(o)

        str_values = []
        for column in self.header:
            if hasattr(o, column) and getattr(o, column) is not None:
                value = getattr(o, column)
                str_values.append(self._to_mysql_value(value))
            else:
                continue

        return f"({', '.join(str_values)})"

    def _filter_by_header(self, o: object) -> dict:

        self.assert_type(o)

        filtered = {}
        for column in self.header:
            if hasattr(o, column) and getattr(o, column) is not None:
                filtered[column] = getattr(o, column)
            else:
                continue

        return filtered

    def _to_assignments(self, **kwargs) -> list:

        self.assert_header(**kwargs)

        assignments = []
        for kwarg in kwargs:
            MysqlAnalyzer.assert_mysql_identifier(kwarg)
            value = self._to_mysql_value(kwargs[kwarg])
            assignments.append(f'{kwarg} = {value}')

        return assignments

    def _join_assignments_to_clause(self, kw: str, delimiter: str, delimited_clause: bool, **kwargs) -> str:

        clause_delimiter = ' ' if delimited_clause else ''
        assignments = delimiter.join(self._to_assignments(**kwargs))
        return f"{clause_delimiter}{kw} {assignments}" if len(assignments) > 0 else ''

    def _to_set_clause(self, delimited: bool, **kwargs) -> str:
        return self._join_assignments_to_clause('SET', ', ', delimited, **kwargs)

    def _to_where_clause(self, delimited: bool, **kwargs) -> str:
        return self._join_assignments_to_clause('WHERE', ' AND ', delimited, **kwargs)

    def _parse_from_mysql(self, row: tuple):

        entity_properties = {}

        for i, entity_property in enumerate(self.header):
            entity_properties[entity_property] = row[i] if i < len(row) else None

        return self.entity_type(**entity_properties)

    def get_header(self) -> list:

        if self.header is None:

            columns = query_db(f"""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = database() AND table_name = '{self.name}'
            ORDER BY ordinal_position
            """)

            self.header = []
            for column in columns:
                self.header.append(column[0])

        return self.header

    def insert(self, o: object) -> int:

        self.assert_type(o)
        return update_db(f"INSERT INTO {self.name} {self._to_mysql_columns(o)} VALUES {self._to_mysql_values(o)}")

    def find(self, **kwargs) -> list:

        where_clause = self._to_where_clause(delimited=True, **kwargs)
        return query_db(f"SELECT * FROM {self.name}{where_clause}", \
            self._parse_from_mysql if self.entity_type else None)

    def contains(self, **kwargs) -> bool:
        return len(self.find(**kwargs)) > 0

    def content(self) -> list:
        return self.find()

    def delete(self, **kwargs) -> int:

        where_clause = self._to_where_clause(delimited=True, **kwargs)
        return update_db(f"DELETE FROM {self.name}{where_clause}")

    def update(self, value: object, **kwargs) -> int:

        set_clause = self._to_set_clause(delimited=True, **self._filter_by_header(value))
        where_clause = self._to_where_clause(delimited=True, **kwargs)
        return update_db(f"UPDATE {self.name}{set_clause}{where_clause}")


def query_db(query, row_processor=None) -> list:

    db = MysqlDBConnector().connect()

    db_cursor = db.cursor()
    db_cursor.execute(query)
    rows = db_cursor.fetchall()
    results = []
    for row in rows:
        result = row_processor(row) if row_processor is not None else row
        results.append(result)

    db.close()

    return results

def update_db(query) -> int:

    db = MysqlDBConnector().connect()

    db_cursor = db.cursor()
    db_cursor.execute(query)
    db.commit()

    effects = db_cursor.rowcount

    db.close()

    return effects
