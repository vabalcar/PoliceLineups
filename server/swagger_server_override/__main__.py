#!/usr/bin/env python3

import connexion
import os

from swagger_server import encoder

DEFAULT_HOST = 'localhost'
DEFAULT_PORT = 5000

def main():
    run_host = os.environ.get('FLASK_RUN_HOST') if 'FLASK_RUN_HOST' in os.environ and os.environ.get('FLASK_RUN_HOST') else DEFAULT_HOST
    run_port = int(os.environ.get('FLASK_RUN_PORT')) if 'FLASK_RUN_PORT' in os.environ and os.environ.get('FLASK_RUN_PORT').isdigit() else DEFAULT_PORT
    if run_port < 1 or run_port > 65535:
        run_port = DEFAULT_PORT

    app = connexion.App(__name__, specification_dir='./swagger/')
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('swagger.yaml', arguments={'title': 'police lineups API'})
    app.run(port=run_port, host=run_host)


if __name__ == '__main__':
    main()
