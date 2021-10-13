from peewee import AutoField, CharField, IntegerField, TextField

from .base_model_ import BaseModel


class DbPerson(BaseModel):
    class Meta:
        table_name = 'people'

    id = AutoField(primary_key=True)
    pid = CharField(max_length=25, null=True)
    name = TextField(null=True)
    born = IntegerField(null=True)
    nationality = CharField(max_length=3, null=True)
    features = TextField(null=True)
