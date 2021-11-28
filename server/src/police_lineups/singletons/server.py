import connexion
from connexion.apps.flask_app import FlaskApp
from flask_cors import CORS

from swagger_server.encoder import JSONEncoder

from police_lineups.db import init_current_db
from police_lineups.utils import Singleton

from .db import DB


class Server(metaclass=Singleton):

    @property
    def current(self) -> FlaskApp:
        return self._app

    def __init__(self) -> None:
        self._app = connexion.App(__name__, specification_dir='../../swagger_server/swagger/')
        CORS(self._app.app)
        self._app.app.json_encoder = JSONEncoder
        self._app.add_api('swagger.yaml')

        init_current_db()

        @self._app.app.before_request
        def _db_connect():
            if not DB().current.autoconnect:
                DB().current.connect()

        @self._app.app.teardown_request
        def _db_close(exc):
            if not DB().current.is_closed():
                DB().current.close()
