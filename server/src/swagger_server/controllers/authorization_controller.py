"""
controller generated to handled auth operation described at:
https://connexion.readthedocs.io/en/latest/security.html
"""
from controllers.auth import authorize_admin_by_token, authorize_user_by_token


def check_JwtAuthUser(token):
    return authorize_user_by_token(token)


def check_JwtAuthAdmin(token):
    return authorize_admin_by_token(token)
