import connexion
import six
import json
import mysql.connector
from os import path

from swagger_server import util
from swagger_server.models import Person

def queryDB(query, resultProcessor):

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
     db_cursor.execute(query)
     rawResult = db_cursor.fetchall()
     result = []
     for rawRow in rawResult:
          result.append(resultProcessor(rawRow))
     
     db.close()
     
     return result

def get_people():  # noqa: E501
     """Returns a list of people.

     # noqa: E501


     :rtype: None
     """

     return queryDB("SELECT * FROM users", lambda p : Person(id=p[0], name=p[1], email=p[2]))

def get_person(id):  # noqa: E501
    """Returns a person.

     # noqa: E501

    :param id: ID of the person.
    :type id: int

    :rtype: Person
    """
    return queryDB('SELECT * FROM users WHERE id={}'.format(id), lambda p : Person(id=p[0], name=p[1], email=p[2]))[0]