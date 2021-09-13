"""
controller generated to handled auth operation described at:
https://connexion.readthedocs.io/en/latest/security.html
"""
from controllers.auth import decode_auth_token


def check_JwtAuth(token):
    return decode_auth_token(token)
