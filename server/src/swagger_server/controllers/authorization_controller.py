"""
controller for handling auth operation described at:
https://connexion.readthedocs.io/en/latest/security.html
"""
from police_lineups.controllers.auth.internal import authorize_admin_by_token, authorize_user_by_token


def check_JwtAuthUser(token):
    return authorize_user_by_token(token)


def check_JwtAuthAdmin(token):
    return authorize_admin_by_token(token)
