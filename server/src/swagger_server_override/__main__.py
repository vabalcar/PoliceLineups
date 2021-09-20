import connexion
from flask_cors import CORS
from police_lineups.mysql.utils import MysqlDBConnector
from swagger_server import encoder
from police_lineups.json.utils import parse_json_file

DEFAULT_HOST = '127.0.0.1'
DEFAULT_PORT = 5000
DEFAULT_IS_DEV_MODE = False


def main():

    # parse configuration from configuration folder
    server_config = parse_json_file('..', '..', 'config', 'server.json')
    MysqlDBConnector().load_db_config('..', '..', 'config', 'db.json')

    host = server_config.get('host', DEFAULT_HOST)
    if len(host) == 0:
        host = DEFAULT_HOST

    port = server_config.get('port', DEFAULT_PORT)
    port = port if isinstance(port, int) else DEFAULT_PORT
    if port < 1 or port > 65535:
        port = DEFAULT_PORT

    is_dev_mode = server_config.get('dev', DEFAULT_IS_DEV_MODE)

    # connect to DB
    MysqlDBConnector().connect()

    # setup the server
    app = connexion.App(__name__, specification_dir='./swagger/')
    CORS(app.app)
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('swagger.yaml')

    # run the server - it's a blocking call
    app.run(port=port, host=host, debug=is_dev_mode)

    # cleanup on close
    MysqlDBConnector().disconnect()


if __name__ == '__main__':
    main()
