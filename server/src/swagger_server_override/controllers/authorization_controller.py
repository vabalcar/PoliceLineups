from controllers.auth import decode_auth_token

def check_jwt_user(token):
    return decode_auth_token(token)

def check_jwt_admin(token):
    return check_jwt_user(token)

def check_jwt_init(token):
    return True
