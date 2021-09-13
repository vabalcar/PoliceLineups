import functools
import mysql.connector
import sqlparse

from typing import Any, Generic, Type, TypeVar

from police_lineups.singleton import Singleton
from police_lineups.json.utils import parse_json_file


def foldl(func, acc, xs):
    return functools.reduce(func, xs, acc)


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

    @staticmethod
    def parse_mysql_singleton(s: any, t: type, *tts):
        parsed = sqlparse.parse(f'{s}')
        return parsed[0][0] if len(parsed) == 1 and len(
            parsed[0].tokens) == 1 and isinstance(
            parsed[0][0],
            t) and (
            len(tts) == 0 or foldl(
                lambda acc,
                tt: acc or parsed[0][0].ttype in tt,
                False,
                tts)) else None

    @staticmethod
    def validate_mysql_singleton(s: any, t: type, *tts):
        return MysqlAnalyzer.parse_mysql_singleton(s, t, *tts) is not None

    @staticmethod
    def is_mysql_value(s: any) -> bool:
        return MysqlAnalyzer.validate_mysql_singleton(
            s, sqlparse.sql.Token, sqlparse.tokens.Literal, sqlparse.tokens.Keyword)

    @staticmethod
    def assert_mysql_value(s):
        assert MysqlAnalyzer.is_mysql_value(s), f"{s} is not a MySQL value"

    @staticmethod
    def is_mysql_identifier(s: any) -> bool:
        return MysqlAnalyzer.validate_mysql_singleton(
            s, sqlparse.sql.Identifier) or MysqlAnalyzer.validate_mysql_singleton(
            s, sqlparse.sql.Token, sqlparse.tokens.Keyword)

    @staticmethod
    def assert_mysql_identifier(s):
        assert MysqlAnalyzer.is_mysql_identifier(s), f"{s} is not a MySQL identifier"


T = TypeVar('T')


class MysqlDBTable(Generic[T], metaclass=Singleton):

    def __init__(self, member_type: Type[T], name: str) -> None:
        MysqlAnalyzer.assert_mysql_identifier(name)

        self.name = name
        self.header = None
        self.member_type = member_type

        self._get_header()

    def _assert_header(self, **kwargs):
        for kwarg in kwargs:
            if kwarg not in self.header:
                raise TypeError(f"type {T} does not contain property {kwarg}")

    def _to_mysql_value(self, value: Any) -> str:
        if isinstance(value, str):
            mysql_value = f"'{value}'"
        elif value is None:
            mysql_value = 'null'
        else:
            mysql_value = f"{value}"

        MysqlAnalyzer.assert_mysql_value(mysql_value)

        return mysql_value

    def _to_mysql_columns(self, o: T) -> str:
        columns = []
        for column in self.header:
            if hasattr(o, column) and getattr(o, column) is not None:
                columns.append(f'{column}')
            else:
                continue

        return f"({', '.join(columns)})"

    def _to_mysql_values(self, o: T) -> str:
        str_values = []
        for column in self.header:
            if hasattr(o, column) and getattr(o, column) is not None:
                value = getattr(o, column)
                str_values.append(self._to_mysql_value(value))
            else:
                continue

        return f"({', '.join(str_values)})"

    def _filter_by_header(self, o: T) -> dict:
        filtered = {}
        for column in self.header:
            if hasattr(o, column) and getattr(o, column) is not None:
                filtered[column] = getattr(o, column)
            else:
                continue

        return filtered

    def _to_assignments(self, **kwargs) -> list[str]:
        self._assert_header(**kwargs)

        assignments = []
        for kwarg in kwargs:
            MysqlAnalyzer.assert_mysql_identifier(kwarg)
            value = self._to_mysql_value(kwargs[kwarg])
            assignments.append(f'{kwarg} = {value}')

        return assignments

    def _join_assignments_to_clause(
            self,
            kw: str,
            delimiter: str,
            delimited_clause: bool,
            **kwargs) -> str:

        clause_delimiter = ' ' if delimited_clause else ''
        assignments = delimiter.join(self._to_assignments(**kwargs))
        return f"{clause_delimiter}{kw} {assignments}" if len(assignments) > 0 else ''

    def _to_set_clause(self, delimited: bool, **kwargs) -> str:
        return self._join_assignments_to_clause('SET', ', ', delimited, **kwargs)

    def _to_where_clause(self, delimited: bool, **kwargs) -> str:
        return self._join_assignments_to_clause('WHERE', ' AND ', delimited, **kwargs)

    def _parse_from_mysql(self, row: tuple) -> T:
        entity_properties = {}

        for i, entity_property in enumerate(self.header):
            entity_properties[entity_property] = row[i] if i < len(row) else None

        return self.member_type(**entity_properties)

    def _get_header(self) -> list:
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

    def insert(self, o: T) -> int:
        return update_db(
            f"INSERT INTO {self.name} {self._to_mysql_columns(o)} VALUES {self._to_mysql_values(o)}")

    def insert_one(self, o: T) -> bool:
        return self.insert(o) == 1

    def find(self, **kwargs) -> list[T]:
        where_clause = self._to_where_clause(delimited=True, **kwargs)
        return query_db(f"SELECT * FROM {self.name}{where_clause}",
                        self._parse_from_mysql)

    def find_one(self, **kwargs) -> T:
        results = self.find(**kwargs)
        if len(results) < 1:
            return None

        return results[0]

    def count(self, **kwargs) -> int:
        return len(self.find(**kwargs))

    def contains(self, **kwargs) -> bool:
        return self.count(**kwargs) > 0

    def content(self) -> list[T]:
        return self.find()

    def delete(self, **kwargs) -> int:
        where_clause = self._to_where_clause(delimited=True, **kwargs)
        return update_db(f"DELETE FROM {self.name}{where_clause}")

    def delete_one(self, **kwargs) -> bool:
        return self.delete(**kwargs) == 1

    def update(self, value: object, **kwargs) -> int:
        set_clause = self._to_set_clause(delimited=True, **self._filter_by_header(value))
        where_clause = self._to_where_clause(delimited=True, **kwargs)
        return update_db(f"UPDATE {self.name}{set_clause}{where_clause}")

    def update_one(self, value: object, **kwargs) -> bool:
        return self.update(value, **kwargs) == 1


def query_db(query: str, row_processor=None) -> list:
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
