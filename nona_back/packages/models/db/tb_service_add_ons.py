from sqlalchemy import Column, String, Integer, DECIMAL, DATETIME, SmallInteger
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class tb_service_add_ons(Base):
    __tablename__ = 'tb_service_add_ons'
    id = Column(Integer, primary_key=True, autoincrement=True)
    service_id = Column(Integer, primary_key=True)
    name = Column(String(45))
    price = Column(DECIMAL)
    allows_multiple = Column(SmallInteger)