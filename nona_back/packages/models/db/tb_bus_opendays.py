from sqlalchemy import Column, String, Integer, DECIMAL, DATETIME
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class tb_bus_opendays(Base):
    __tablename__ = 'tb_bus_opendays'
    bus_id = Column(Integer, primary_key=True)
    starts = Column(DATETIME)
    ends = Column(DATETIME)
