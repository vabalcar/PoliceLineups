# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.auth_request import AuthRequest  # noqa: E501
from swagger_server.models.auth_response import AuthResponse  # noqa: E501
from swagger_server.models.auth_token_renewal_response import AuthTokenRenewalResponse  # noqa: E501
from swagger_server.models.empty_response import EmptyResponse  # noqa: E501
from swagger_server.models.lineup import Lineup  # noqa: E501
from swagger_server.models.lineup_overview import LineupOverview  # noqa: E501
from swagger_server.models.person import Person  # noqa: E501
from swagger_server.models.response import Response  # noqa: E501
from swagger_server.models.user import User  # noqa: E501
from swagger_server.models.user_with_password import UserWithPassword  # noqa: E501
from swagger_server.test import BaseTestCase


class TestDefaultController(BaseTestCase):
    """DefaultController integration test stubs"""

    def test_add_lineup(self):
        """Test case for add_lineup

        Adds a lineup
        """
        body = Lineup()
        response = self.client.open(
            '/lineups',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_add_person(self):
        """Test case for add_person

        Adds a person
        """
        data = dict(full_name='full_name_example',
                    birth_date='birth_date_example',
                    nationality='nationality_example',
                    photo_file='photo_file_example')
        response = self.client.open(
            '/people',
            method='POST',
            data=data,
            content_type='multipart/form-data')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_add_user(self):
        """Test case for add_user

        Adds a user
        """
        body = UserWithPassword()
        response = self.client.open(
            '/users',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_blob(self):
        """Test case for get_blob

        Serves a blob
        """
        response = self.client.open(
            '/blobs/{blob_name}'.format(blob_name='blob_name_example'),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_current_user(self):
        """Test case for get_current_user

        Returns a user
        """
        response = self.client.open(
            '/users/current',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_lineup(self):
        """Test case for get_lineup

        Returns a lineup
        """
        response = self.client.open(
            '/lineups/{lineup_id}'.format(lineup_id=789),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_lineup_recommendations(self):
        """Test case for get_lineup_recommendations

        Returns a list of recommended people based on list of people in lineup
        """
        body = [Person()]
        response = self.client.open(
            '/lineups/recommendations',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_lineups(self):
        """Test case for get_lineups

        Returns a list of lineups for all users
        """
        response = self.client.open(
            '/lineups',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_lineups_for_current_user(self):
        """Test case for get_lineups_for_current_user

        Returns a list of lineups for all users
        """
        response = self.client.open(
            '/user/current/lineups',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_people(self):
        """Test case for get_people

        Returns a list of people
        """
        query_string = [('full_name', 'full_name_example'),
                        ('min_age', 56),
                        ('max_age', 56),
                        ('nationality', 'nationality_example')]
        response = self.client.open(
            '/people',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_person(self):
        """Test case for get_person

        Returns a person
        """
        response = self.client.open(
            '/people/{person_id}'.format(person_id=789),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_user(self):
        """Test case for get_user

        Returns a user
        """
        response = self.client.open(
            '/users/{user_id}'.format(user_id=789),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_users(self):
        """Test case for get_users

        Returns all users
        """
        response = self.client.open(
            '/users',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_login(self):
        """Test case for login

        Logins registered userUser
        """
        body = AuthRequest()
        response = self.client.open(
            '/authorization',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_remove_current_user(self):
        """Test case for remove_current_user

        Removes a user
        """
        response = self.client.open(
            '/users/current',
            method='DELETE')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_remove_lineup(self):
        """Test case for remove_lineup

        Removes a lineup
        """
        response = self.client.open(
            '/lineups/{lineup_id}'.format(lineup_id=789),
            method='DELETE')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_remove_person(self):
        """Test case for remove_person

        Removes a person
        """
        response = self.client.open(
            '/people/{person_id}'.format(person_id=789),
            method='DELETE')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_remove_user(self):
        """Test case for remove_user

        Removes a user
        """
        response = self.client.open(
            '/users/{user_id}'.format(user_id=789),
            method='DELETE')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_renew_auth_token(self):
        """Test case for renew_auth_token

        Renews auth token
        """
        response = self.client.open(
            '/authorization',
            method='PATCH')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_blob(self):
        """Test case for update_blob

        Updates a blob
        """
        data = dict(blob='blob_example')
        response = self.client.open(
            '/blobs/{blob_name}'.format(blob_name='blob_name_example'),
            method='PATCH',
            data=data,
            content_type='multipart/form-data')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_current_user(self):
        """Test case for update_current_user

        Updates a user
        """
        body = UserWithPassword()
        response = self.client.open(
            '/users/current',
            method='PATCH',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_lineup(self):
        """Test case for update_lineup

        Updates a lineup
        """
        body = Lineup()
        response = self.client.open(
            '/lineups/{lineup_id}'.format(lineup_id=789),
            method='PATCH',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_person(self):
        """Test case for update_person

        Updates a person
        """
        body = Person()
        response = self.client.open(
            '/people/{person_id}'.format(person_id=789),
            method='PATCH',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_user(self):
        """Test case for update_user

        Updates a user
        """
        body = UserWithPassword()
        response = self.client.open(
            '/users/{user_id}'.format(user_id=789),
            method='PATCH',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_validate_new_user(self):
        """Test case for validate_new_user

        Validated properties of a new user
        """
        body = UserWithPassword()
        response = self.client.open(
            '/validation/users',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
