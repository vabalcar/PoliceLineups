#!/usr/bin/env python3
import os
import connexion
from flask_cors import CORS
from swagger_server import encoder
from swagger_server.models import User, Person
from police_lineups.mysql.utils import MysqlDBConnector, MysqlDBTable

DEFAULT_HOST = 'localhost'
DEFAULT_PORT = 5000

def main():

    MysqlDBConnector().load_db_config('..', '..', 'config', 'db.json')
    MysqlDBTable('users').set_entity_type(User)
    MysqlDBTable('people').set_entity_type(Person)

    run_host = os.environ.get('FLASK_RUN_HOST') if 'FLASK_RUN_HOST' in os.environ and os.environ.get('FLASK_RUN_HOST') else DEFAULT_HOST
    run_port = int(os.environ.get('FLASK_RUN_PORT')) if 'FLASK_RUN_PORT' in os.environ and os.environ.get('FLASK_RUN_PORT').isdigit() else DEFAULT_PORT
    if run_port < 1 or run_port > 65535:
        run_port = DEFAULT_PORT

    app = connexion.App(__name__, specification_dir='./swagger/')
    CORS(app.app)
    app.app.json_encoder = encoder.JSONEncoder
    app.app.secret_key = "my secret key jksdackjaui"
    app.add_api('swagger.yaml', arguments={'title': 'police lineups API'})
    app.run(port=run_port, host=run_host)


if __name__ == '__main__':
    main()
