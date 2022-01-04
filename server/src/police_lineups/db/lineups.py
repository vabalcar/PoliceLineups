from peewee import AutoField, DateTimeField, ForeignKeyField, TextField

from .base_model_ import BaseModel
from .users import DbUser


class DbLineup(BaseModel):
    class Meta:
        table_name = 'lineups'

    lineup_id = AutoField(primary_key=True)
    name = TextField()
    last_edit_date_time = DateTimeField()
    owner_id = ForeignKeyField(DbUser, backref='lineups')
