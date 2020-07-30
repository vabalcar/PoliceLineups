import json
from os import path
import mysql.connector

def query_db(query, result_processor):

    wd = path.dirname(__file__)
    config_path = path.join(wd, '..', '..', '..', 'config', 'db.json')
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
    raw_result = db_cursor.fetchall()
    result = []
    for raw_row in raw_result:
        result.append(result_processor(raw_row))

    db.close()

    return result