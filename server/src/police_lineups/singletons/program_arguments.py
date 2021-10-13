from argparse import ArgumentParser

from police_lineups.utils import Singleton


class ProgramArguments(metaclass=Singleton):

    @property
    def is_debug_mode(self) -> bool:
        return self._program_args.debug

    def __init__(self) -> None:
        argument_parser = ArgumentParser()
        argument_parser.add_argument('--debug', default=False, action='store_true')
        self._program_args = argument_parser.parse_args()
