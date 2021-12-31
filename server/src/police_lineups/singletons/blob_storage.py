import os

from flask import send_from_directory
from flask.wrappers import Response
from werkzeug.datastructures import FileStorage

from .id_allocator import IdAllocator
from .utils import Singleton


class BlobStorage(metaclass=Singleton):

    def __init__(self) -> None:
        self._blobs_root_dir = os.path.abspath(os.path.join('..', 'blobs'))

    def store(self, file: FileStorage) -> str:
        blob_name = self._get_blob_name(file.filename)

        file.save(
            self._get_blob_location(blob_name))
        file.close()

        return blob_name

    def remove(self, blob_name: str) -> None:
        blob_location = self._get_blob_location(blob_name)

        if os.path.exists(blob_location):
            os.remove(blob_location)

    def serve(self, blob_name: str) -> Response:
        return send_from_directory(self._blobs_root_dir, blob_name)

    def _get_blob_name(self, filename: str) -> str:
        file_extension = os.path.splitext(filename)[-1]
        return f"{IdAllocator().next_id()}{file_extension}"

    def _get_blob_location(self, blob_name: str) -> str:
        return os.path.join(self._blobs_root_dir, blob_name)
