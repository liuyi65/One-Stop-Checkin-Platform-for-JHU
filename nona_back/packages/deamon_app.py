from sqlalchemy import create_engine
from .utils.GlobalSettings import GlobalSettings
from .models.BusinessModel import BusinessModel
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime

engine = create_engine("mysql+pymysql://nona:nona@" + GlobalSettings.host + ":3306/nona_db", echo=True)
model = BusinessModel(engine)

class NonaScheduler:
    def __init__(self):
        self.sched = BackgroundScheduler(daemon=True)

    def add_job(self, *args, **kwargs):
        self.sched.add_job(*args, **kwargs)

    def start(self):
        self.sched.start()

    def shutdown(self):
        self.sched.shutdown()

def sensor():
    print(GlobalSettings.utc_to_tz(datetime.utcnow()).strftime("%H:%M:%S"))

def update_time_slots():
    print('updating time slots')
    model.refresh_all_actual_time_slots()

def update_order_status():
    print('updating order status')
    model.refresh_order_status()

def register_deamon(scheduler):
    update_order_status()
    update_time_slots()
    scheduler.add_job(update_time_slots, 'interval', days=1)
    scheduler.add_job(update_order_status, 'interval', hours=1)
    # scheduler.add_job(sensor, 'interval', seconds=1)


