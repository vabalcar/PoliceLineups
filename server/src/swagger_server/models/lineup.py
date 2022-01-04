# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from swagger_server.models.base_model_ import Model
from swagger_server.models.lineup_overview import LineupOverview  # noqa: F401,E501
from swagger_server.models.person import Person  # noqa: F401,E501
from swagger_server import util


class Lineup(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """
    def __init__(self, name: str=None, last_edit_date_time: datetime=None, owner_username: str=None, people: List[Person]=None):  # noqa: E501
        """Lineup - a model defined in Swagger

        :param name: The name of this Lineup.  # noqa: E501
        :type name: str
        :param last_edit_date_time: The last_edit_date_time of this Lineup.  # noqa: E501
        :type last_edit_date_time: datetime
        :param owner_username: The owner_username of this Lineup.  # noqa: E501
        :type owner_username: str
        :param people: The people of this Lineup.  # noqa: E501
        :type people: List[Person]
        """
        self.swagger_types = {
            'name': str,
            'last_edit_date_time': datetime,
            'owner_username': str,
            'people': List[Person]
        }

        self.attribute_map = {
            'name': 'name',
            'last_edit_date_time': 'lastEditDateTime',
            'owner_username': 'ownerUsername',
            'people': 'people'
        }
        self._name = name
        self._last_edit_date_time = last_edit_date_time
        self._owner_username = owner_username
        self._people = people

    @classmethod
    def from_dict(cls, dikt) -> 'Lineup':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The Lineup of this Lineup.  # noqa: E501
        :rtype: Lineup
        """
        return util.deserialize_model(dikt, cls)

    @property
    def name(self) -> str:
        """Gets the name of this Lineup.


        :return: The name of this Lineup.
        :rtype: str
        """
        return self._name

    @name.setter
    def name(self, name: str):
        """Sets the name of this Lineup.


        :param name: The name of this Lineup.
        :type name: str
        """

        self._name = name

    @property
    def last_edit_date_time(self) -> datetime:
        """Gets the last_edit_date_time of this Lineup.


        :return: The last_edit_date_time of this Lineup.
        :rtype: datetime
        """
        return self._last_edit_date_time

    @last_edit_date_time.setter
    def last_edit_date_time(self, last_edit_date_time: datetime):
        """Sets the last_edit_date_time of this Lineup.


        :param last_edit_date_time: The last_edit_date_time of this Lineup.
        :type last_edit_date_time: datetime
        """

        self._last_edit_date_time = last_edit_date_time

    @property
    def owner_username(self) -> str:
        """Gets the owner_username of this Lineup.


        :return: The owner_username of this Lineup.
        :rtype: str
        """
        return self._owner_username

    @owner_username.setter
    def owner_username(self, owner_username: str):
        """Sets the owner_username of this Lineup.


        :param owner_username: The owner_username of this Lineup.
        :type owner_username: str
        """

        self._owner_username = owner_username

    @property
    def people(self) -> List[Person]:
        """Gets the people of this Lineup.


        :return: The people of this Lineup.
        :rtype: List[Person]
        """
        return self._people

    @people.setter
    def people(self, people: List[Person]):
        """Sets the people of this Lineup.


        :param people: The people of this Lineup.
        :type people: List[Person]
        """

        self._people = people