from peewee import BooleanField, CharField

from .base_model_ import BaseModel


class DbUser(BaseModel):
    class Meta:
        table_name = 'users'

    username = CharField(primary_key=True, unique=True, max_length=45)
    password = CharField(max_length=258, null=True)
    name = CharField(max_length=45, null=True)
    is_admin = BooleanField(default=False)
