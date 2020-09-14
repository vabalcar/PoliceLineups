from controllers.auth import decode_auth_token

def check_jwt(token):
    return decode_auth_token(token)
