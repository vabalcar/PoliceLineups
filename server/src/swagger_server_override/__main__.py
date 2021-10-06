import connexion
from flask_cors import CORS

from swagger_server import encoder

from police_lineups.db.connector import DBConnector
from police_lineups.db.scheme import prepare_database
from police_lineups.utils.json import parse_json_file

DEFAULT_HOST = '127.0.0.1'
DEFAULT_PORT = 5000
DEFAULT_IS_DEV_MODE = False


def main():

    # parse configuration from configuration folder
    server_config = parse_json_file('..', '..', 'config', 'server.json')

    host = server_config.get('host', DEFAULT_HOST)
    if len(host) == 0:
        host = DEFAULT_HOST

    port = server_config.get('port', DEFAULT_PORT)
    port = port if isinstance(port, int) else DEFAULT_PORT
    if port < 1 or port > 65535:
        port = DEFAULT_PORT

    is_dev_mode = server_config.get('dev', DEFAULT_IS_DEV_MODE)

    prepare_database()

    # setup the server
    app = connexion.App(__name__, specification_dir='./swagger/')
    CORS(app.app)
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('swagger.yaml')

    @app.app.before_request
    def _db_connect():
        if not DBConnector().database.autoconnect:
            DBConnector().database.connect()

    @app.app.teardown_request
    def _db_close(exc):
        if not DBConnector().database.is_closed():
            DBConnector().database.close()

    # run the server - it's a blocking call
    app.run(port=port, host=host, debug=is_dev_mode)


if __name__ == '__main__':
    main()
