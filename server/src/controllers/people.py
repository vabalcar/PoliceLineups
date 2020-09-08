"""
Controller for working with people.
"""
from police_lineups.mysql.utils import MysqlDBTable

def get_people():  # noqa: E501
    """
    Returns a list of people.

    :rtype: None
    """

    return MysqlDBTable('people').content()

def get_person(id):  # noqa: E501
    """
    Returns a person.

    :param person_id: ID of the person.
    :type person_id: int

    :rtype: Person
    """

    return MysqlDBTable('people').find(id=id)
