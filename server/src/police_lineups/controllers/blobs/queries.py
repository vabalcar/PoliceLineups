from police_lineups.singletons import BlobStorage


def get_blob(blob_name: str):
    return BlobStorage().serve(blob_name)
