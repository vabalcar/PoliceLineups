import connexion

from police_lineups.controllers.utils import Responses
from police_lineups.singletons import BlobStorage


def update_blob(blob_name):
    file = connexion.request.files.get('blob')

    if file is not None:
        BlobStorage().update(blob_name, file)

    return Responses.SUCCESS
