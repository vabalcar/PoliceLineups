# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from swagger_server.models.base_model_ import Model
from swagger_server import util


class User(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """
    def __init__(self, user_id: int=None, username: str=None, is_admin: bool=None, full_name: str=None):  # noqa: E501
        """User - a model defined in Swagger

        :param user_id: The user_id of this User.  # noqa: E501
        :type user_id: int
        :param username: The username of this User.  # noqa: E501
        :type username: str
        :param is_admin: The is_admin of this User.  # noqa: E501
        :type is_admin: bool
        :param full_name: The full_name of this User.  # noqa: E501
        :type full_name: str
        """
        self.swagger_types = {
            'user_id': int,
            'username': str,
            'is_admin': bool,
            'full_name': str
        }

        self.attribute_map = {
            'user_id': 'userId',
            'username': 'username',
            'is_admin': 'isAdmin',
            'full_name': 'fullName'
        }
        self._user_id = user_id
        self._username = username
        self._is_admin = is_admin
        self._full_name = full_name

    @classmethod
    def from_dict(cls, dikt) -> 'User':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The User of this User.  # noqa: E501
        :rtype: User
        """
        return util.deserialize_model(dikt, cls)

    @property
    def user_id(self) -> int:
        """Gets the user_id of this User.


        :return: The user_id of this User.
        :rtype: int
        """
        return self._user_id

    @user_id.setter
    def user_id(self, user_id: int):
        """Sets the user_id of this User.


        :param user_id: The user_id of this User.
        :type user_id: int
        """

        self._user_id = user_id

    @property
    def username(self) -> str:
        """Gets the username of this User.


        :return: The username of this User.
        :rtype: str
        """
        return self._username

    @username.setter
    def username(self, username: str):
        """Sets the username of this User.


        :param username: The username of this User.
        :type username: str
        """

        self._username = username

    @property
    def is_admin(self) -> bool:
        """Gets the is_admin of this User.


        :return: The is_admin of this User.
        :rtype: bool
        """
        return self._is_admin

    @is_admin.setter
    def is_admin(self, is_admin: bool):
        """Sets the is_admin of this User.


        :param is_admin: The is_admin of this User.
        :type is_admin: bool
        """

        self._is_admin = is_admin

    @property
    def full_name(self) -> str:
        """Gets the full_name of this User.


        :return: The full_name of this User.
        :rtype: str
        """
        return self._full_name

    @full_name.setter
    def full_name(self, full_name: str):
        """Sets the full_name of this User.


        :param full_name: The full_name of this User.
        :type full_name: str
        """

        self._full_name = full_name
