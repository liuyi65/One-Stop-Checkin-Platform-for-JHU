from flask.views import MethodView
from sqlalchemy.orm import sessionmaker, Session

from .db.tb_business import tb_business as Business
from .db.tb_service import tb_service as Service
from .db.tb_service_actual_time_slots import tb_service_actual_time_slots as ServiceActualTimeSlot
from .db.tb_order import tb_order as Order
from .db.tb_order import OrderStatus
from .db.tb_user import tb_user as User
from .db.tb_category import tb_category as Category
from firebase_admin import auth as firebase_auth
from .APIModelException import APIModelException
from .db.tb_userinfo import tb_userinfo as UserInfo
import datetime
from ..utils.GlobalSettings import GlobalSettings as settings
from .ChatGPTModel import ChatModel


class UserModel(MethodView):
    #region: init
    class Session:
        def __init__(self, db_session: sessionmaker):
            self.db_session = db_session

        def __enter__(self) -> Session:
            self.session = self.db_session()
            return self.session
        
        def __exit__(self, exc_type, exc_value, traceback):
            self.session.close()

    def session(self):
        return self.Session(self.DBSession)

    def __init__(self, engine):
        self.engine = engine
        self.DBSession = sessionmaker(bind=engine)
        self.chatModels = {}
    #endregion: init

    # -- Helper functions --
    
    #region: helper
    def get_user(self, id_token):
        try:
            auth = firebase_auth.verify_id_token(id_token)
        except:
            raise APIModelException('Invalid token', 401)
        uid = auth['uid']
        username = auth['email']
        with self.session() as session:
            user = session.query(User).filter(User.username == username).filter(User.uid == uid).first()
        if user is None:
            raise APIModelException('User not found', 400)
        return user
    #endregion: helper

    # -- Gets --
    #region: gets
    def get_all_categories(self):
        with self.session() as session:
            return session.query(Category).all()
        

    def get_all_businesses(self):
        with self.session() as session:
            return session.query(Business).all()
    
    def get_services(self, bus_id):
        with self.session() as session:
            return session.query(Service).filter(Service.bus_id == bus_id).all()
        
    def get_available_slots(self, service_id, include_past=False):
        with self.session() as session:
            userd_slots = session.query(Order, ServiceActualTimeSlot).filter(ServiceActualTimeSlot.service_id == service_id).filter(Order.time_id == ServiceActualTimeSlot.id).all()
            ids = [x[1].id for x in userd_slots]
            available_slots = session.query(ServiceActualTimeSlot).filter(ServiceActualTimeSlot.service_id == service_id).filter(ServiceActualTimeSlot.id.notin_(ids)).all()
            if not include_past:
                available_slots = [x for x in available_slots if x.starts > settings.utc_to_tz(datetime.datetime.utcnow())]
            return available_slots
        
    def get_order_history_with_details(self, id_token, include_past=False):
        user = self.get_user(id_token)
        
        ret = []
        with self.session() as session:
            orders = session.query(Order).filter(Order.user_id == user.id).all()
            for order in orders:
                slot = session.query(ServiceActualTimeSlot).filter(ServiceActualTimeSlot.id == order.time_id).first() if order.time_id is not None else None
                if not include_past and slot.starts < settings.utc_to_tz(datetime.datetime.utcnow()):
                    continue
                service = session.query(Service).filter(Service.id == slot.service_id).first()
                business = session.query(Business).filter(Business.id == service.bus_id).first()
                ret.append((order, slot, service, business))
            return ret

    def get_all_personal_info(self, id_token):
        user = self.get_user(id_token)

        with self.session() as session:
            info = session.query(UserInfo).filter(UserInfo.user_id == user.id).all()
            return info
    
    def create_personal_info(self, id_token, name, email, phone):
        user = self.get_user(id_token)

        with self.session() as session:
            info = UserInfo()
            info.user_id = user.id
            info.name = name
            info.email = email
            info.phone = phone
            session.add(info)
            session.commit()

    def update_personal_info(self, id_token, info_id, name, email, phone):
        user = self.get_user(id_token)

        with self.session() as session:
            info = session.query(UserInfo).filter(UserInfo.id == info_id).filter(UserInfo.user_id == user.id).first()
            if info is None:
                raise APIModelException('Info not found', 400)
            info.name = name
            info.email = email
            info.phone = phone
            session.commit()
    
    def delete_personal_info(self, id_token, info_id):
        user = self.get_user(id_token)

        with self.session() as session:
            info = session.query(UserInfo).filter(UserInfo.id == info_id).filter(UserInfo.user_id == user.id).first()
            if info is None:
                raise APIModelException('Info not found', 400)
            session.delete(info)
            session.commit()

    def get_category_image_url(self, cat_id):
        with self.session() as session:
            cat = session.query(Category).filter(Category.id == cat_id).first()
            if cat is None:
                raise APIModelException('Category not found', 400)
            url = cat.img_url
            if url is None:
                raise APIModelException('Image not found', 400)
            return url
        
    def get_business_image_url(self, bus_id):
        with self.session() as session:
            bus = session.query(Business).filter(Business.id == bus_id).first()
            if bus is None:
                raise APIModelException('Business not found', 400)
            url = bus.img_url
            if url is None:
                raise APIModelException('Image not found', 400)
            return url
        
    def get_service_image_url(self, service_id):
        with self.session() as session:
            service = session.query(Service).filter(Service.id == service_id).first()
            if service is None:
                raise APIModelException('Service not found', 400)
            url = service.img_url
            if url is None:
                raise APIModelException('Image not found', 400)
            return url
    #endregion: gets
    
    # -- Sets --
    def send_chat_message(self, id_token, message):
        user = self.get_user(id_token)
        if user.id not in self.chatModels:
            cm = ChatModel()
        else:
            cm = self.chatModels[user.id]

        recent_orders = self.get_order_history_with_details(id_token, include_past=False)

        if len(recent_orders) <= 0:
            cm.append_message_from_user("The user have no orders", direct=True)
        else:
            sorted_orders = sorted(recent_orders, key=lambda x: x[1].starts, reverse=True)
            
            cm.append_message_from_user("Appointments:", direct=True)
            for order_combine in sorted_orders:
                msg = ""
                order, slot, service, business = order_combine
                msg += "Order at: " + settings.utc_to_tz(slot.starts).strftime("%Y-%m-%d %H:%M:%S") + "\n"
                msg += "Status: " + str(order.status) + "\n"
                msg += "Business: " + business.name + "\n"
                if business.address is not None:
                    msg += "Business address: " + business.address + "\n"
                msg += "Service: " + service.name + "\n"
                if service.description is not None:
                    msg += "Service descrption: " + service.description + "\n"
                if order.comments is not None:
                    msg += "Customer Comments: " + order.comments + "\n"
                msg += "Booked name: " + order.name + "\n"
                msg += "Booked phone: " + order.phone + "\n"
                msg += "Booked email: " + order.email + "\n"
                
                cm.append_message_from_user(msg, direct=True)
        cm.append_message_from_user("The current time is: " + settings.utc_to_tz(datetime.datetime.utcnow()).strftime("%Y-%m-%d %H:%M:%S"), direct=True)
        cm.append_message_from_user("The user's message is: " + message, direct=True)
        ret, _ = cm.send_feedback()
        self.chatModels[user.id] = cm
        return ret

    #region: sets
    def create_order(self, id_token, time_id, name, phone, email, comments):
        user = self.get_user(id_token)
        
        with self.session() as session:
            order = Order()
            order.user_id = user.id
            order.time_id = time_id
            order.name = name
            order.phone = phone
            order.email = email
            order.comments = comments
            session.add(order)

            time_slot = session.query(ServiceActualTimeSlot).filter(ServiceActualTimeSlot.id == time_id).first()
            current_time = settings.utc_to_tz(datetime.datetime.utcnow())
            if current_time < time_slot.starts and current_time > time_slot.starts - datetime.timedelta(hours=1):
                order.status = OrderStatus.Ready

            try:
                session.commit()
            except Exception as e:
                raise APIModelException('Invalid time slot', 400)
            
    def check_in(self, id_token, order_id):
        user = self.get_user(id_token)
        
        with self.session() as session:
            order = session.query(Order).filter(Order.id == order_id).filter(Order.user_id == user.id).first()
            if order is None:
                raise APIModelException('Order not found', 400)
            
            if order.status != OrderStatus.Ready:
                raise APIModelException('Order is not ready', 400)
            
            order.status = OrderStatus.Progressing
            session.flush()
            session.commit()
    
    def cancel_order(self, id_token, order_id):
        user = self.get_user(id_token)
        
        with self.session() as session:
            order = session.query(Order).filter(Order.id == order_id).filter(Order.user_id == user.id).first()
            if order is None:
                raise APIModelException('Order not found', 400)
            
            if order.status == OrderStatus.Cancelled or order.status == OrderStatus.Completed or order.status == OrderStatus.Missed:
                raise APIModelException('Order already marked as a past(cancelled/completed/missed) state.')
            
            order.status = OrderStatus.Cancelled
            session.flush()

            cancelled_time_slot = session.query(ServiceActualTimeSlot).filter(ServiceActualTimeSlot.id == order.time_id).first()
            if cancelled_time_slot.starts > settings.utc_to_tz(datetime.datetime.utcnow()):
                new_time_slot = ServiceActualTimeSlot()
                new_time_slot.service_id = cancelled_time_slot.service_id
                new_time_slot.starts = cancelled_time_slot.starts
                session.add(new_time_slot)
            session.commit()
    
    
    def create_user(self, id_token):
        # uid = firebase_auth.create_user(
        #     email=email,
        #     email_verified=False,
        #     password=password,
        #     display_name=username,
        #     disabled=False
        # ).uid
        
        try:
            auth = firebase_auth.verify_id_token(id_token)
        except:
            raise APIModelException('Invalid token', 401)
        uid = auth['uid']
        username = auth['email']
        email = auth['email']

        with self.session() as session:
            user = User()
            user.username = username
            user.uid = uid
            user.email = email
            session.add(user)
            try:
                session.commit()
            except:
                raise APIModelException('User already exists', 400)
            return user
    #endregion: sets




