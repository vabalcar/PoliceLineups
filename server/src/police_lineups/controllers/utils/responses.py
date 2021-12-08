from swagger_server.models import Response


class Responses:
    SUCCESS = Response()

    @staticmethod
    def error(error: str) -> Response:
        return Response(error)
