from sqlalchemy import Column, String, Integer, DECIMAL
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class tb_service(Base):
    __tablename__ = 'tb_service'
    id = Column(Integer, primary_key=True, autoincrement=True)
    bus_id = Column(Integer, primary_key=True)
    name = Column(String(45))
    description = Column(String(500))
    base_price = Column(DECIMAL)
    img_url = Column(String(255))