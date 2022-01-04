from peewee import AutoField, BooleanField, CharField

from .base_model_ import BaseModel


class DbUser(BaseModel):
    class Meta:
        table_name = 'users'

    user_id = AutoField(primary_key=True)
    username = CharField(unique=True)
    password = CharField(max_length=258)
    is_admin = BooleanField(default=False)
    # max length of email is the same as value which Angular validates
    email = CharField(max_length=254)
    full_name = CharField()
