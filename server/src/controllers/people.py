"""
Controller for working with people.
"""
import json
from os import path
import mysql.connector

from swagger_server.models import Person

def query_db(query, result_processor):

    wd = path.dirname(__file__)
    config_path = path.join(wd, '..', '..', '..', 'config', 'db.json')
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
        result.append(result_processor(raw_row))

    db.close()

    return result

def parse_person_from_row(row):
    """
    Returns a person.
    :rtype: Person
    """

    if len(row) == 6:
        fs = row[5]
    else:
        fs = ""
    return Person(id=row[0], pid=row[1], name=row[2], born=row[3], nationality=row[4], features=fs)

def get_people():  # noqa: E501
    """
    Returns a list of people.

    :rtype: None
    """

    return query_db("SELECT * FROM people", parse_person_from_row)

def get_person(person_id):  # noqa: E501
    """
    Returns a person.

    :param person_id: ID of the person.
    :type person_id: int

    :rtype: Person
    """
    return query_db('SELECT * FROM people WHERE id={}'.format(person_id), parse_person_from_row)[0]
