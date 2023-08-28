from sqlalchemy import Column, String, Integer, DECIMAL
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()


class tb_business(Base):
    __tablename__ = 'tb_business'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(45))
    phone = Column(String(45))
    description = Column(String(500))
    reviews = Column(Integer)
    rating = Column(DECIMAL)
    address = Column(String(100))
    category_id = Column(Integer)
    owner_user_id = Column(Integer)
    img_url = Column(String(255))
