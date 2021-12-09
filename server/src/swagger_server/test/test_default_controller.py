# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.auth_request import AuthRequest  # noqa: E501
from swagger_server.models.auth_response import AuthResponse  # noqa: E501
from swagger_server.models.auth_token_renewal_response import AuthTokenRenewalResponse  # noqa: E501
from swagger_server.models.empty_response import EmptyResponse  # noqa: E501
from swagger_server.models.person import Person  # noqa: E501
from swagger_server.models.response import Response  # noqa: E501
from swagger_server.models.user import User  # noqa: E501
from swagger_server.models.user_with_password import UserWithPassword  # noqa: E501
from swagger_server.test import BaseTestCase


class TestDefaultController(BaseTestCase):
    """DefaultController integration test stubs"""

    def test_add_person(self):
        """Test case for add_person

        Adds a person
        """
        body = Person()
        response = self.client.open(
            '/people',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
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

    def test_get_current_user(self):
        """Test case for get_current_user

        Returns a user
        """
        response = self.client.open(
            '/user/current',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_people(self):
        """Test case for get_people

        Returns a list of people
        """
        response = self.client.open(
            '/people',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_person(self):
        """Test case for get_person

        Returns a person
        """
        response = self.client.open(
            '/person/{person_id}'.format(person_id=789),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_user(self):
        """Test case for get_user

        Returns a user
        """
        response = self.client.open(
            '/user/{user_id}'.format(user_id=789),
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
            '/user/current',
            method='DELETE')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_remove_person(self):
        """Test case for remove_person

        Removes a person
        """
        response = self.client.open(
            '/person/{person_id}'.format(person_id=789),
            method='DELETE')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_remove_user(self):
        """Test case for remove_user

        Removes a user
        """
        response = self.client.open(
            '/user/{user_id}'.format(user_id=789),
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

    def test_update_current_user(self):
        """Test case for update_current_user

        Updates a user
        """
        body = UserWithPassword()
        response = self.client.open(
            '/user/current',
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
            '/person/{person_id}'.format(person_id=789),
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
            '/user/{user_id}'.format(user_id=789),
            method='PATCH',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_validate_user_update(self):
        """Test case for validate_user_update

        Validated an update of a user
        """
        body = User()
        response = self.client.open(
            '/validation/user',
            method='PATCH',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
