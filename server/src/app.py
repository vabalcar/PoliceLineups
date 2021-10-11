#!/usr/bin/env python3
from argparse import ArgumentParser

from police_lineups.db.scheme import prepare_database
from police_lineups.singletons.configuration import Configuration
from police_lineups.singletons.server import Server


def parse_command_line_arguments():
    argument_parser = ArgumentParser()
    argument_parser.add_argument('--dev', default=False, action='store_true')
    return argument_parser.parse_args()


def main():
    args = parse_command_line_arguments()

    prepare_database()

    Server().current.run(
        port=Configuration().server.port,
        host=Configuration().server.host,
        debug=args.dev)


if __name__ == '__main__':
    main()
