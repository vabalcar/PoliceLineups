"""
Controller for working with users.
"""
from police_lineups.mysql.utils import MysqlDBTable


def get_users():  # noqa: E501
    """Returns a list of users.

     # noqa: E501


    :rtype: List[User]
    """

    return MysqlDBTable('users').content()

def get_user(id):  # noqa: E501
    """Returns a user.

     # noqa: E501

    :param id: ID of the user.
    :type id: int

    :rtype: User
    """

    return MysqlDBTable('users').find(id=id)
