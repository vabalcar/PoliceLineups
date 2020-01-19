import connexion
import six
import json
import mysql.connector
from os import path

from swagger_server import util
from swagger_server.models import User


def get_users():  # noqa: E501
     """Returns a list of users.

          # noqa: E501


     :rtype: None
     """

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
     db_cursor.execute('SELECT * FROM users')
     users_from_db = db_cursor.fetchall()
     users = []
     for user_from_db in users_from_db:
          users.append(User(id=user_from_db[0], name=user_from_db[1], email=user_from_db[2]))
     db.close()
     return users
