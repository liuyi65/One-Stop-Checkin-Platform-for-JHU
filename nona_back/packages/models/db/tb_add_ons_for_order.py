from sqlalchemy import Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class tb_add_ons_for_order(Base):
    __tablename__ = 'tb_add_ons_for_order'
    order_id = Column(Integer, primary_key=True)
    add_on_id = Column(Integer, primary_key=True)
    quantity = Column(Integer)
