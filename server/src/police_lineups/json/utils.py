import json
import os

def parse_json_file(path, *path_children):
    if not os.path.isabs(path):
        cur_dir = os.getcwd()
        path = os.path.join(cur_dir, path)

    if path_children:
        path = os.path.join(path, *path_children)

    with open(path) as db_config_file:
        return json.load(db_config_file)
