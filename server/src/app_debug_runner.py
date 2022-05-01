#!/usr/bin/env python3.10
from werkzeug.serving import WSGIRequestHandler

from police_lineups.singletons import Configuration, Server
from police_lineups.utils import parse_json_file

server_configuration = parse_json_file(
    Configuration().config_dir, 'server.json')

WSGIRequestHandler.protocol_version = "HTTP/1.1"

try:
    Server().current.run(
        host=server_configuration.get('host'),
        port=server_configuration.get('port'),
        debug=True)

except BaseException as err:  # pylint: disable=broad-except
    print(f"App crashed: {err}")
