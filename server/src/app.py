#!/usr/bin/env python3
from police_lineups.db.scheme import prepare_database
from police_lineups.singletons.configuration import Configuration
from police_lineups.singletons.server import Server


def main():
    prepare_database()

    Server().current.run(
        port=Configuration().server.port,
        host=Configuration().server.host,
        debug=Configuration().server.is_debug_mode)


if __name__ == '__main__':
    main()
