from sqlalchemy import Column, String, Integer, DECIMAL, DATETIME, SmallInteger
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

day_map = {
    "monday": 6,
    "tuesday": 7,
    "wednesday": 1,
    "thursday": 2,
    "friday": 3,
    "saturday": 4,
    "sunday": 5
}

class tb_service_weekly_time_slots(Base):
    __tablename__ = 'tb_service_weekly_time_slots'
    service_id = Column(Integer, primary_key=True)
    starts = Column(DATETIME, primary_key=True)
    slots = Column(Integer)

    def set_start_time(start_time):
        weekday = start_time["weekday"]
        hour = start_time["hour"]
        minute = start_time["minute"]
        starts = datetime.datetime(2020, 1, day_map[weekday.lower()], hour, minute, 0, 0)
        return starts
