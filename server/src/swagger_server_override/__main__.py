import connexion
from flask_cors import CORS
from swagger_server import encoder
from police_lineups.mysql.db import setup_db
from police_lineups.json.utils import parse_json_file

DEFAULT_HOST = 'localhost'
DEFAULT_PORT = 5000

def main():

    # parse configuration from configuration
    config = parse_json_file('..', '..', 'config', 'server.json')

    host = config.get('host', DEFAULT_HOST)
    if len(host) == 0:
        host = DEFAULT_HOST

    port = config.get('port', DEFAULT_PORT)
    port = port if isinstance(port, int) else DEFAULT_PORT
    if port < 1 or port > 65535:
        port = DEFAULT_PORT

    # setup the server
    app = connexion.App(__name__, specification_dir='./swagger/')
    CORS(app.app)
    app.app.json_encoder = encoder.JSONEncoder
    # app.app.secret_key = secrets.token_urlsafe(20)
    app.add_api('swagger.yaml')

    setup_db()

    # run the server
    app.run(port=port, host=host)

if __name__ == '__main__':
    main()
