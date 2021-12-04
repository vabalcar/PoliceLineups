class UserContext:

    @property
    def user_id(self) -> int:
        return self._user_id

    @property
    def is_admin(self) -> bool:
        return self._is_admin

    def __init__(self, user_id: int, is_admin: bool) -> None:
        self._user_id = user_id
        self._is_admin = is_admin
