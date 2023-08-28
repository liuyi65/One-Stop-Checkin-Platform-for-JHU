from sqlalchemy import Column, String, Integer
from sqlalchemy.dialects.mysql import INTEGER
from sqlalchemy.ext.declarative import declarative_base
import enum
from sqlalchemy import Enum

Base = declarative_base()

class OrderStatus(enum.Enum):
    Confirmed = 1
    Ready = 2
    Progressing = 3
    Waiting = 4
    Cancelled = 5
    Completed = 6
    Missed = 7
    
class tb_order(Base):
    __tablename__ = 'tb_order'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, primary_key=True)
    time_id = Column(Integer, primary_key=True)
    comments = Column(String(1024))
    name = Column(String(256))
    phone = Column(String(45))
    email = Column(String(255))
    status = Column(Enum(OrderStatus), default=OrderStatus.Confirmed)
