from uuid import uuid4

from .utils import Singleton


class IdAllocator(metaclass=Singleton):

    def next_id(self) -> str:
        return uuid4().hex
