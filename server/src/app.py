#!/usr/bin/env python3
from police_lineups.db_scheme import prepare_db
from police_lineups.singletons import Configuration, Server


def main():
    prepare_db()

    Server().current.run(
        port=Configuration().server.port,
        host=Configuration().server.host,
        debug=Configuration().server.is_debug_mode)


if __name__ == '__main__':
    main()
