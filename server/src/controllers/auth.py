import secrets
import time
import connexion

from werkzeug.security import check_password_hash
from werkzeug.exceptions import Unauthorized
from jose import JWTError, jwt

from swagger_server.models import AuthRequest, AuthResponse
from police_lineups.mysql.utils import MysqlDBTable

JWT_ISSUER = 'policelineups'
JWT_SECRET = secrets.token_urlsafe(32)
JWT_LIFETIME_SECONDS = 600
JWT_ALGORITHM = 'HS256'

def _current_timestamp() -> int:
    return int(time.time())

def _generate_auth_token(username):
    timestamp = _current_timestamp()
    payload = {
        "iss": JWT_ISSUER,
        "iat": int(timestamp),
        "exp": int(timestamp + JWT_LIFETIME_SECONDS),
        "sub": username,
    }

    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_auth_token(token):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError:
        raise Unauthorized

def login(body):  # noqa: E501
    """Logins registered user

     # noqa: E501

    :param body: AuthRequest
    :type body: dict | bytes

    :rtype: object
    """
    if connexion.request.is_json:
        body = AuthRequest.from_dict(connexion.request.get_json())  # noqa: E501

    success = False
    path = '/'
    auth_token = None

    username = body.username
    password = body.password

    result = MysqlDBTable('users').find(username=username)
    success = len(result) == 1 and  check_password_hash(result[0].password, password)

    if success:
        path = body.path
        auth_token = _generate_auth_token(username)

    return AuthResponse(success, path, auth_token)
