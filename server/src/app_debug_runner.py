#!/usr/bin/env python3.9
from police_lineups.singletons import Configuration, Server
from police_lineups.utils import parse_json_file

server_configuration = parse_json_file(Configuration().config_dir, 'server.json')

Server().current.run(host=server_configuration.get('host'),
                     port=server_configuration.get('port'), debug=True)