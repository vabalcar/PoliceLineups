from peewee import AutoField, BooleanField, CharField

from .base_model_ import BaseModel


class DbUser(BaseModel):
    class Meta:
        table_name = 'users'

    user_id = AutoField(primary_key=True)
    username = CharField(unique=True, max_length=45)
    password = CharField(max_length=258, null=True)
    is_admin = BooleanField(default=False)
    full_name = CharField(max_length=45, null=True)