from sqlalchemy import Column, String, Integer, DECIMAL, DATETIME
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()


class tb_service_actual_time_slots(Base):
    __tablename__ = 'tb_service_actual_time_slots'
    id = Column(Integer, primary_key=True, autoincrement=True)
    service_id = Column(Integer, primary_key=True)
    starts = Column(DATETIME, primary_key=True)



