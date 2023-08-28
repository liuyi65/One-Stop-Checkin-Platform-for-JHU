from sqlalchemy import Column, String, Integer, DECIMAL
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class tb_category(Base):
    __tablename__ = 'tb_category'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255))
    img_url = Column(String(255))
