from peewee import AutoField, CharField, DateTimeField, TextField

from .base_model_ import BaseModel


class DbPerson(BaseModel):
    class Meta:
        table_name = 'people'

    person_id = AutoField(primary_key=True)
    photo_blob_name = CharField(null=True)
    full_name = TextField(null=True)
    birth_date = DateTimeField(null=True)
    nationality = CharField(null=True)
