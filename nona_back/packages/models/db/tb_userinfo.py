from sqlalchemy import Column, TIMESTAMP, String, Integer, DECIMAL, DATETIME, SmallInteger
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class tb_userinfo(Base):
    __tablename__ = 'tb_userinfo'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, primary_key=True)
    name = Column(String(16))
    email = Column(String(255))
    phone = Column(String(45))
    