from peewee import AutoField, BooleanField, CharField, IntegerField, Model, TextField

from police_lineups.db.connector import DBConnector


class BaseModel(Model):
    class Meta:
        database = DBConnector().database


class DbUser(BaseModel):
    class Meta:
        table_name = 'users'

    username = CharField(primary_key=True, unique=True, max_length=45)
    password = CharField(max_length=258, null=True)
    name = CharField(max_length=45, null=True)
    is_admin = BooleanField(default=False)


class DbPerson(BaseModel):
    class Meta:
        table_name = 'people'

    id = AutoField(primary_key=True)
    pid = CharField(max_length=25, null=True)
    name = TextField(null=True)
    born = IntegerField(null=True)
    nationality = CharField(max_length=3, null=True)
    features = TextField(null=True)


def prepare_database():
    with DBConnector().database as database:
        database.create_tables([DbUser, DbPerson])
