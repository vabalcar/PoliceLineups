from swagger_server.models import Response


class Responses:
    SUCCESS = Response()
    NOT_FOUND = None, 404

    @staticmethod
    def error(error: str) -> Response:
        return Response(error)
