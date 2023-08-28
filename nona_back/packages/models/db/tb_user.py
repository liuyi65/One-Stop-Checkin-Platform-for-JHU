from sqlalchemy import Column, TIMESTAMP, String, Integer, DECIMAL, DATETIME, SmallInteger
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import text

Base = declarative_base()


class tb_user(Base):
    __tablename__ = 'tb_user'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(16))
    email = Column(String(255))
    create_time = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'))
    bus_user = Column(SmallInteger, server_default=text('0'))
    bus_api = Column(String(64))
    uid = Column(String(45))
