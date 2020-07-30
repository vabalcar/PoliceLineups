import json
from os import path
import mysql.connector

from swagger_server.models.user import User

def queryDB(query, resultProcessor):

    wd = path.dirname(__file__)
    config_path = path.join(wd, '..', '..', 'config', 'db.json')
    with open(config_path) as config_json:
        db_config = json.load(config_json)

    db = mysql.connector.connect(
        host=db_config['host'],
        user=db_config['user'],
        passwd=db_config['password'],
        database=db_config['db'],
        port=db_config['port']
    )

    db_cursor = db.cursor()
    db_cursor.execute(query)
    raw_result = db_cursor.fetchall()
    result = []
    for raw_row in raw_result:
        result.append(resultProcessor(raw_row))

    db.close()

    return result

def parse_user_from_row(row):
    return User(id=row[0], name=row[1], email=row[2])


def get_users():  # noqa: E501
    """Returns a list of users.

     # noqa: E501


    :rtype: List[User]
    """
    return queryDB("SELECT * FROM users", parse_user_from_row)

def get_user(person_id):  # noqa: E501
    """Returns a user.

     # noqa: E501

    :param id: ID of the user.
    :type id: int

    :rtype: User
    """
    return queryDB('SELECT * FROM users WHERE id={}'.format(person_id), parse_user_from_row)[0]
