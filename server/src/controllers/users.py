"""
Controller for working with users.
"""
from police_lineups.mysql_utils import query_db
from swagger_server.models.user import User

def parse_user_from_row(row):
    return User(id=row[0], name=row[1], email=row[2])


def get_users():  # noqa: E501
    """Returns a list of users.

     # noqa: E501


    :rtype: List[User]
    """
    return query_db("SELECT * FROM users", parse_user_from_row)

def get_user(person_id):  # noqa: E501
    """Returns a user.

     # noqa: E501

    :param id: ID of the user.
    :type id: int

    :rtype: User
    """
    return query_db('SELECT * FROM users WHERE id={}'.format(person_id), parse_user_from_row)[0]
