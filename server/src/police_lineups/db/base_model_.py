from peewee import Model

from police_lineups.singletons import DB


class BaseModel(Model):
    class Meta:
        database = DB().current
