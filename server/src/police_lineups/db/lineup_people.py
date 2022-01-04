from peewee import AutoField, ForeignKeyField

from .base_model_ import BaseModel
from .lineups import DbLineup
from .people import DbPerson


class DbLineupPerson(BaseModel):
    class Meta:
        table_name = 'lineup_people'

    entry_id = AutoField(primary_key=True)
    lineup_id = ForeignKeyField(DbLineup, backref='people')
    person_id = ForeignKeyField(DbPerson)
