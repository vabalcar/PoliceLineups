"""
Controller for working with people.
"""
from police_lineups.mysql_utils import query_db
from swagger_server.models import Person

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

def get_person(id):  # noqa: E501
    """
    Returns a person.

    :param person_id: ID of the person.
    :type person_id: int

    :rtype: Person
    """
    return query_db('SELECT * FROM people WHERE id={}'.format(id), parse_person_from_row)[0]
