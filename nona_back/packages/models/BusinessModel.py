from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine
from .db.tb_user import tb_user as User
from .db.tb_service import tb_service as Service
from .db.tb_business import tb_business as Business
from .db.tb_service_weekly_time_slots import tb_service_weekly_time_slots as ServiceWeeklyTimeSlot
from .db.tb_service_actual_time_slots import tb_service_actual_time_slots as ServiceActualTimeSlot
from .db.tb_order import tb_order as Order, OrderStatus
from .db.tb_category import tb_category as Category
from firebase_admin import auth as firebase_auth
from .APIModelException import APIModelException
from .ImageData import ImageData
from ..utils.GlobalSettings import GlobalSettings as settings

import time
import hashlib
import datetime

class BusinessModel():

    # region: initialization
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
        self.administrator_api_key = 'administrator_api_key'
    # endregion: initialization
    
    # -- Helper functions --
    # region: helper
    

    def generate_api_key(self, user_name):
        # generate 64bit api key from current time and user name

        api_key = hashlib.sha256((user_name + str(time.time())).encode('utf-8')).hexdigest()
        return api_key

    def get_user_from_api_key(self, api_key):
        if api_key == self.administrator_api_key:
            return 'administrator'
        else:
            with self.session() as session:
                user = session.query(User).filter(User.bus_api == api_key).first()
            return user

    def get_upcoming_slot(self, weekly_date_time):
        now = settings.utc_to_tz(datetime.datetime.utcnow())
        starts = datetime.datetime(now.year, now.month, now.day, weekly_date_time.hour, weekly_date_time.minute, 0)
        days_ahead = (weekly_date_time.weekday() - now.weekday()) % 7
        starts = starts + datetime.timedelta(days_ahead)
        if starts < now:
            # Same day, but in the past
            starts = starts + datetime.timedelta(7)
        return starts

    # -- Checking Helpers --

    def is_related_service(self, service_id, api_key):
        user = self.get_business_user(api_key)

        with self.session() as session:
            service = session.query(Service, Business).filter(
                Service.id == service_id,
                Business.id == Service.bus_id,
                Business.owner_user_id == user.id).first()
        return service is not None

    def is_related_order(self, order_id, api_key):
        user = self.get_business_user(api_key)

        with self.session() as session:
            bus_id = session.query(Business.id).filter(Business.owner_user_id == user.id).first()[0]
            service_ids = session.query(Service.id).filter(Service.bus_id == bus_id).all()
            service_ids = [x[0] for x in service_ids]
            order = session.query(Order, ServiceActualTimeSlot).filter(
                Order.id == order_id,
                ServiceActualTimeSlot.id == Order.time_id,
                ServiceActualTimeSlot.service_id.in_(service_ids)).first()
        return order is not None
    
    # endregion: helper

    # -- Set - Database admin only --
    # region: set for admin
    def create_business(self, token, api_key, bus_name):
        if self.get_user_from_api_key(api_key) != 'administrator':
            raise APIModelException('Only administrator can use this function', 403)

        try:
            auth = firebase_auth.verify_id_token(token)
        except:
            raise APIModelException('Invalid token', 401)
        uid = auth['uid']
        username = auth['email']
        email = auth['email']

        # uid = 'hxVSyBjRFlRU0aLF348QrdkcOM12'
        # username = 'hyu90@jh.edu'
        # email = 'hyu90@jh.edu'

        with self.session() as session:
            new_user = User()
            new_user.username = username
            new_user.email = email
            new_user.uid = uid
            new_user.bus_user = True
            api = self.generate_api_key(username)
            new_user.bus_api = api
            session.add(new_user)
            try:
                session.flush()
            except:
                raise APIModelException('User creration failed: User may already exists', 400)

            session.refresh(new_user)
            new_bus = Business()
            new_bus.name = bus_name
            new_bus.owner_user_id = new_user.id
            session.add(new_bus)
            session.commit()

        return api
    
    def create_category(self, api_key, cat_name):
        if self.get_user_from_api_key(api_key) != 'administrator':
            raise APIModelException('Only administrator can use this function', 403)
        
        with self.session() as session:
            new_cat = Category()
            new_cat.name = cat_name
            session.add(new_cat)
            session.commit()

    def modify_category(self, api_key, id, new_cat_name):
        if self.get_user_from_api_key(api_key) != 'administrator':
            raise APIModelException('Only administrator can use this function', 403)
        
        with self.session() as session:
            cat = session.query(Category).filter(Category.id == id).first()
            if cat is None:
                raise APIModelException('Category does not exist', 404)
            cat.name = new_cat_name
            session.commit()

    def set_cetegory_image(self, api_key, id, flask_image):
        if self.get_user_from_api_key(api_key) != 'administrator':
            raise APIModelException('Only administrator can use this function', 403)
        
        image = ImageData(flask_image, 'category')
        with self.session() as session:
            catgeory = session.query(Category).filter(Category.id == id).first()
            if catgeory is None:
                raise APIModelException('Category does not exist', 404)
            prev_image = catgeory.img_url
            image.save(prev_image)
            catgeory.img_url = image.path
            session.commit()


    def delete_category(self, api_key, id):
        if self.get_user_from_api_key(api_key) != 'administrator':
            raise APIModelException('Only administrator can use this function', 403)
        
        with self.session() as session:
            cat = session.query(Category).filter(Category.id == id).first()
            if cat is None:
                raise APIModelException('Category does not exist', 404)
            session.delete(cat)
            session.commit()

    # endregion: set for admin

    # -- Gets --
    # region: get
    def get_business_user(self, api_key):
        user = self.get_user_from_api_key(api_key)
        if user == 'administrator':
            raise APIModelException('Administrator cannot use this function', 403)
        if user is None:
            raise APIModelException('Invalid API key', 401)
        if not user.bus_user:
            raise APIModelException('User is not a business user', 403)
        return user
    
    def get_business_profile(self, api_key):
        user = self.get_business_user(api_key)
        with self.session() as session:
            bus = session.query(Business).filter(Business.owner_user_id == user.id).first()
            category = session.query(Category).filter(Category.id == bus.category_id).first()
        return (bus, category)

    def get_api_key_from_user(self, token):
        try:
            auth = firebase_auth.verify_id_token(token)
        except:
            raise APIModelException('Invalid token', 401)
        uid = auth['uid']
        username = auth['email']
        with self.session() as session:
            user = session.query(User).filter(
                User.username == username,
                User.uid == uid).first()
        if user is None:
            raise APIModelException('User does not exist', 400)
        if not user.bus_user:
            raise APIModelException('User is not a business user', 403)
        return user.bus_api

    def get_all_services_with_time_slots(self, api_key):
        user = self.get_business_user(api_key)

        with self.session() as session:
            bus_id = session.query(Business).filter(Business.owner_user_id == user.id).first().id
            services = session.query(Service, ServiceWeeklyTimeSlot).filter(
                Service.bus_id == bus_id,
                ServiceWeeklyTimeSlot.service_id == Service.id).all()
        return services

    def get_actual_time_slots(self, api_key, service_id, include_past=False):
        user = self.get_business_user(api_key)
        if not self.is_related_service(service_id, api_key):
            raise APIModelException('Not related service', 403)

        with self.session() as session:
            bus_id = session.query(Business).filter(Business.owner_user_id == user.id).first().id
            actual_time_slots = session.query(Service, ServiceActualTimeSlot).filter(
                Service.bus_id == bus_id,
                Service.id == service_id,
                ServiceActualTimeSlot.service_id == service_id).all()
            if not include_past:
                actual_time_slots = [x for x in actual_time_slots if x[1].starts > settings.utc_to_tz(datetime.datetime.utcnow())]
            return [x[1] for x in actual_time_slots]

    def get_available_time_slots(self, api_key, service_id, include_past=False):
        user = self.get_business_user(api_key)
        if not self.is_related_service(service_id, api_key):
            raise APIModelException('Not related service', 403)

        with self.session() as session:
            bus_id = session.query(Business).filter(Business.owner_user_id == user.id).first().id
            actual_time_slots = session.query(Service, ServiceActualTimeSlot).filter(
                Service.bus_id == bus_id,
                Service.id == service_id,
                ServiceActualTimeSlot.service_id == service_id).all()
            actual_time_slots = [x[1].id for x in actual_time_slots]
            orders = session.query(Order).filter(Order.time_id.in_(actual_time_slots)).all()
            
            orders = [x.time_id for x in orders]
            available_time_slots = session.query(ServiceActualTimeSlot).filter(
                ServiceActualTimeSlot.id.notin_(orders)).filter(
                    ServiceActualTimeSlot.service_id == service_id).all()
            if not include_past:
                available_time_slots = [x for x in available_time_slots if x.starts > settings.utc_to_tz(datetime.datetime.utcnow())]
            
            return available_time_slots

    def get_orders(self, api_key, service_id, include_past=False):
        user = self.get_business_user(api_key)

        if not self.is_related_service(service_id, api_key):
            raise APIModelException('Not related service', 403)

        with self.session() as session:
            bus_id = session.query(Business).filter(Business.owner_user_id == user.id).first().id
            orders = session.query(Order, ServiceActualTimeSlot, Service).filter(
                Order.time_id == ServiceActualTimeSlot.id,
                ServiceActualTimeSlot.service_id == Service.id,
                Service.bus_id == bus_id,
                Service.id == service_id).all()
            if not include_past:
                orders = [x for x in orders if x[1].starts > settings.utc_to_tz(datetime.datetime.utcnow())]
            return orders
        
    def get_all_orders(self, api_key, include_past=False):
        user = self.get_business_user(api_key)
        
        with self.session() as session:
            bus_id = session.query(Business).filter(Business.owner_user_id == user.id).first().id
            orders = session.query(Order, ServiceActualTimeSlot, Service).filter(
                Order.time_id == ServiceActualTimeSlot.id,
                ServiceActualTimeSlot.service_id == Service.id,
                Service.bus_id == bus_id).all()
    
            if not include_past:
                orders = [x for x in orders if x[1].starts > settings.utc_to_tz(datetime.datetime.utcnow())]
            return orders

    def get_ordered_time_slots_by_date(self, api_key, service_id, date):
        user = self.get_business_user(api_key)
        if not self.is_related_service(service_id, api_key):
            raise APIModelException('Not related service', 403)

        with self.session() as session:
            actual_time_slots = session.query(ServiceActualTimeSlot).filter(
                ServiceActualTimeSlot.service_id == service_id).all()
            actual_time_slots = [x.id for x in actual_time_slots]
            orders = session.query(Order).filter(Order.time_id.in_(actual_time_slots)).all()
            orders = [x.time_id for x in orders]
            available_time_slots = session.query(ServiceActualTimeSlot).filter(
                ServiceActualTimeSlot.id.in_(orders)).all()
            total_ordered_times = [x.starts for x in available_time_slots]
            ordered_times_on_certain_date = []
            for ele in total_ordered_times:
                _date = ele.strftime("%Y-%m-%d")
                _time = ele.strftime("%H:%M:%S")
                if _date == date:
                    ordered_times_on_certain_date.append(_time)

            return ordered_times_on_certain_date

    # endregion: get

    # -- Sets --
    # region: set
    def set_category(self, api_key, category_id):
        user = self.get_business_user(api_key)

        with self.session() as session:
            bus_id = session.query(Business).filter(Business.owner_user_id == user.id).first().id
            bus = session.query(Business).filter(Business.id == bus_id).first()
            bus.category_id = category_id
            session.commit()

    def set_business_image(self, api_key, flask_image):
        user = self.get_business_user(api_key)
        image = ImageData(flask_image, 'business')

        with self.session() as session:
            bus_id = session.query(Business).filter(Business.owner_user_id == user.id).first().id
            bus = session.query(Business).filter(Business.id == bus_id).first()
            prev_image = bus.img_url
            image.save(prev_image)
            bus.img_url = image.path
            session.commit()

    def create_service(self, api_key, service, base_price, description, service_time):
        user = self.get_business_user(api_key)

        with self.session() as session:
            bus_id = session.query(Business).filter(Business.owner_user_id == user.id).first().id

            new_service = Service()
            new_service.bus_id = bus_id
            new_service.name = service
            new_service.base_price = base_price
            new_service.description = description
            session.add(new_service)
            session.flush()

            for time in service_time:
                weekly_time_slot = ServiceWeeklyTimeSlot()
                weekly_time_slot.service_id = new_service.id
                weekly_time_slot.starts = ServiceWeeklyTimeSlot.set_start_time(time)
                weekly_time_slot.slots = time['slots']
                session.add(weekly_time_slot)
                session.flush()
            session.commit()

    def update_bus_info(self, api_key, name=None, address=None, phone=None, description=None):
        user = self.get_business_user(api_key)

        with self.session() as session:
            bus_id = session.query(Business).filter(Business.owner_user_id == user.id).first().id
            bus = session.query(Business).filter(Business.id == bus_id).first()
            if name is not None:
                bus.name = name
            if address is not None:
                bus.address = address
            if phone is not None:
                bus.phone = phone
            if description is not None:
                bus.description = description
            session.commit()

    def update_service_info(self, api_key, service_id, name=None, base_price=None, description=None):
        user = self.get_business_user(api_key)

        if not self.is_related_service(service_id, api_key):
            raise APIModelException('Not related service', 403)

        with self.session() as session:
            bus_id = session.query(Business).filter(Business.owner_user_id == user.id).first().id
            service = session.query(Service).filter(
                Service.id == service_id,
                Service.bus_id == bus_id).first()
            if name is not None:
                service.name = name
            if base_price is not None:
                service.base_price = base_price
            
            if description is not None:
                service.description = description
            session.commit()


    def set_service_image(self, api_key, service_id, flask_image):
        user = self.get_business_user(api_key)

        if not self.is_related_service(service_id, api_key):
            raise APIModelException('Not related service', 403)

        image = ImageData(flask_image, 'service')
        with self.session() as session:
            bus_id = session.query(Business).filter(Business.owner_user_id == user.id).first().id
            service = session.query(Service).filter(
                Service.id == service_id,
                Service.bus_id == bus_id).first()
            prev_image = service.img_url
            image.save(prev_image)
            service.img_url = image.path
            session.commit()

    def refresh_actual_time_slots(self, api_key, weeks_ahead=2):
        user = self.get_business_user(api_key)

        with self.session() as session:
            bus_id = session.query(Business).filter(Business.owner_user_id == user.id).first().id
            services = session.query(Service).filter(Service.bus_id == bus_id).all()
            # For each service, update the actual time slots for the next n weeks.
            for service in services:
                service_id = service.id
                weekly_time_slots = session.query(ServiceWeeklyTimeSlot).filter(
                    ServiceWeeklyTimeSlot.service_id == service_id).all()
                for weekly_time_slot in weekly_time_slots:
                    time_slot = weekly_time_slot.starts
                    slots = weekly_time_slot.slots
                    for week in range(weeks_ahead):
                        upcoming_slot = self.get_upcoming_slot(time_slot)
                        upcoming_slot = upcoming_slot + datetime.timedelta(weeks=week)
                        if session.query(ServiceActualTimeSlot).filter(
                                ServiceActualTimeSlot.service_id == service_id).filter(
                                ServiceActualTimeSlot.starts == upcoming_slot).first() is not None:
                            continue
                        for _ in range(slots):
                            new_actual_time_slot = ServiceActualTimeSlot()
                            new_actual_time_slot.service_id = service_id
                            new_actual_time_slot.starts = upcoming_slot
                            session.add(new_actual_time_slot)
                            session.flush()
            session.commit()

    def update_status(self, api_key, order_id, status):
        user = self.get_business_user(api_key)

        if not self.is_related_order(order_id, api_key):
            raise APIModelException('Not related order', 403)

        if status not in OrderStatus.__members__:
            raise APIModelException('Invalid status', 400)

        
        with self.session() as session:
            bus_id = session.query(Business).filter(Business.owner_user_id == user.id).first().id
            order = session.query(Order, ServiceActualTimeSlot, Service).filter(
                Order.id == order_id,
                ServiceActualTimeSlot.id == Order.time_id,
                ServiceActualTimeSlot.service_id == Service.id,
                Service.bus_id == bus_id).first()[0]
            if order.status == OrderStatus.Cancelled or order.status == OrderStatus.Completed or order.status == OrderStatus.Missed:
                raise APIModelException('Order already marked as a past(cancelled/completed/missed) state.')
            order.status = status
            
            
            if order.status == "Cancelled":
                cancelled_time_slot = session.query(ServiceActualTimeSlot).filter(ServiceActualTimeSlot.id == order.time_id).first()
                
                if cancelled_time_slot.starts > settings.utc_to_tz(datetime.datetime.utcnow()):
                    
                    new_time_slot = ServiceActualTimeSlot()
                    new_time_slot.service_id = cancelled_time_slot.service_id
                    new_time_slot.starts = cancelled_time_slot.starts
                    session.add(new_time_slot)
            
            session.commit()

        
    # endregion: set
        
    # -- Deamons --
    # region: deamons
    def refresh_all_actual_time_slots(self, weeks_ahead=1):

        with self.session() as session:
            users = session.query(User).filter(User.bus_user == True).all()
            for user in users:
                bus_id = session.query(Business).filter(Business.owner_user_id == user.id).first().id
                services = session.query(Service).filter(Service.bus_id == bus_id).all()
                # For each service, update the actual time slots for the next n weeks.
                for service in services:
                    service_id = service.id
                    weekly_time_slots = session.query(ServiceWeeklyTimeSlot).filter(
                        ServiceWeeklyTimeSlot.service_id == service_id).all()
                    for weekly_time_slot in weekly_time_slots:
                        time_slot = weekly_time_slot.starts
                        slots = weekly_time_slot.slots
                        for week in range(weeks_ahead):
                            upcoming_slot = self.get_upcoming_slot(time_slot)
                            upcoming_slot = upcoming_slot + datetime.timedelta(weeks=week)
                            if session.query(ServiceActualTimeSlot).filter(
                                    ServiceActualTimeSlot.service_id == service_id).filter(
                                    ServiceActualTimeSlot.starts == upcoming_slot).first() is not None:
                                continue
                            for _ in range(slots):
                                new_actual_time_slot = ServiceActualTimeSlot()
                                new_actual_time_slot.service_id = service_id
                                new_actual_time_slot.starts = upcoming_slot
                                session.add(new_actual_time_slot)
                                session.flush()
                session.commit()

    def refresh_order_status(self):
        with self.session() as session:
            orders = session.query(Order).all()
            for order in orders:
                if order.status == OrderStatus.Cancelled or order.status == OrderStatus.Completed or order.status == OrderStatus.Missed or order.status == OrderStatus.Progressing or order.status == OrderStatus.Waiting:
                    continue
                time_slots = session.query(ServiceActualTimeSlot).filter(ServiceActualTimeSlot.id == order.time_id).first()
                current_time = settings.utc_to_tz(datetime.datetime.utcnow())
                if time_slots.starts < current_time.replace(hour=0, minute=0, second=0, microsecond=0):
                    order.status = OrderStatus.Missed
                    continue
                if current_time < time_slots.starts and current_time > time_slots.starts - datetime.timedelta(hours=1):
                    order.status = OrderStatus.Ready
                    continue

            session.commit()

    # endregion: deamons

