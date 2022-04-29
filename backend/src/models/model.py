from src import db
from dataclasses import dataclass

@dataclass
class TestModel(db.Model):
    __tablename__ = "TestTable"
    field1 = db.Column(db.Integer, primary_key=True)
    field2 = db.Column(db.Text)