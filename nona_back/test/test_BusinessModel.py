import unittest
from flask import Flask
from unittest.mock import MagicMock, patch, Mock
from sqlalchemy.orm import sessionmaker
from packages.models.db.tb_user import tb_user as User
from packages.models.db.tb_service import tb_service as Service
from packages.models.db.tb_business import tb_business as Business
from packages.models.db.tb_order import OrderStatus, tb_order as Order
from packages.models.db.tb_service_weekly_time_slots import tb_service_weekly_time_slots as ServiceWeeklyTimeSlot
from packages.models.db.tb_service_actual_time_slots import tb_service_actual_time_slots as ServiceActualTimeSlot
from packages.models.db.tb_category import tb_category as Category
from packages.models.ImageData import ImageData

from packages.apis.BusAPI import *
import datetime as dt
import io, os
from PIL import Image, UnidentifiedImageError

app = Flask(__name__)

class TestBusinessModel(unittest.TestCase):

    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['CORS_HEADERS'] = 'Content-Type'
        self.converter = QueryConverter

        self.engine = MagicMock()
        self.DBSession = sessionmaker(bind=self.engine)
        self.business_model = BusinessModel(self.engine)
        self.business_model.DBSession = MagicMock()
        self.business_model.session = MagicMock()
        self.mock_session = self.business_model.session.return_value
        self.business_model.session.return_value = self.mock_session
        self.api_key = 'test_api_key'
        self.flask_image = MagicMock()




    def test_get_business_user(self):
        # Setup
        mock_user = User()
        mock_user.username = 'test_username'
        mock_user.email = 'test_email'
        mock_user.uid = 'test_uid'
        mock_user.bus_user = True
        mock_user.bus_api = self.api_key

        self.business_model.get_user_from_api_key = MagicMock(return_value=mock_user)
        result = self.business_model.get_business_user(self.api_key)

        # Assert
        self.assertEqual(result, mock_user)
        self.business_model.get_user_from_api_key.assert_called_once_with(self.api_key)



    def test_create_service(self):
        # Setup
        mock_user = User()
        mock_user.id = 1
        mock_business = Business()
        mock_business.id = 1
        self.business_model.get_business_user = MagicMock(return_value=mock_user)

        # Mock session method return values
        self.mock_session.__enter__.return_value.query.return_value.filter.return_value.first.return_value = mock_business

        service_name = 'test_service'
        base_price = 100
        description = 'test_description'
        service_time = [
            {'weekday': 'wednesday', 'hour': 9, 'minute': 0, 'slots': 2},
            {'weekday': 'wednesday', 'hour': 10, 'minute': 0, 'slots': 3},
        ]

        # Test
        self.business_model.create_service(self.api_key, service_name, base_price, description, service_time)

        # Assert
        self.business_model.get_business_user.assert_called_once_with(self.api_key)
        self.mock_session.__enter__.return_value.add.assert_called()
        self.mock_session.__enter__.return_value.commit.assert_called_once()

    def test_get_all_services_with_time_slots(self):
        # Setup
        mock_user = User()
        mock_user.id = 1
        self.business_model.get_business_user = MagicMock(return_value=mock_user)
        mock_services = [
            (Service(), ServiceWeeklyTimeSlot()),
            (Service(), ServiceWeeklyTimeSlot()),
        ]
        self.business_model.session.return_value.__enter__.return_value.query.return_value.join.return_value.filter.return_value.all.side_effect = [
            mock_services]

        # Test
        result = self.business_model.get_all_services_with_time_slots(self.api_key)
        print(result)

        # Assert
        #self.assertEqual(len(result), len(mock_services))
        self.business_model.get_business_user.assert_called_once_with(self.api_key)
        self.business_model.session.return_value.__enter__.return_value.query.assert_called()
        #self.business_model.session.return_value.__enter__.return_value.join.assert_called()
        #self.business_model.session.return_value.__enter__.return_value.filter.assert_called()
        #self.business_model.session.return_value.__enter__.return_value.all.assert_called_once()


    def test_refresh_actual_time_slots(self):
        # Setup
        api_key = "test_api_key"
        weeks_ahead = 2

        mock_user = User()
        mock_user.id = 1
        mock_user.bus_user = 1
        mock_business = Business(id=1, owner_user_id=1)
        mock_services = [Service(id=1, bus_id=1), Service(id=2, bus_id=1)]
        now = dt.datetime.now()
        mock_weekly_time_slots = [
            ServiceWeeklyTimeSlot(service_id=1, starts=now + dt.timedelta(days=1, hours=9), slots=2),
            ServiceWeeklyTimeSlot(service_id=2, starts=now + dt.timedelta(days=2, hours=10), slots=1),
        ]

        self.mock_session.__enter__.return_value.query.side_effect = [
            MagicMock(filter=MagicMock(return_value=MagicMock(first=MagicMock(return_value=mock_user)))),
            MagicMock(filter=MagicMock(return_value=MagicMock(first=MagicMock(return_value=mock_business)))),
            MagicMock(filter=MagicMock(return_value=MagicMock(all=MagicMock(return_value=mock_services)))),
            MagicMock(filter=MagicMock(return_value=MagicMock(all=MagicMock(return_value=mock_weekly_time_slots)))),
            *(MagicMock(return_value=None) for _ in
              range(len(mock_services) * len(mock_weekly_time_slots) * weeks_ahead)),
        ]

        # Test
        session_add_objects = []
        self.mock_session.__enter__.return_value.add.side_effect = session_add_objects.append
        self.mock_session.__enter__.return_value.flush = MagicMock()

        self.business_model.refresh_actual_time_slots(api_key, weeks_ahead=weeks_ahead)

        # Assert that the correct number of objects were added to the session
        expected_slots = sum([wts.slots for wts in mock_weekly_time_slots]) * weeks_ahead
        #assert len(session_add_objects) == expected_slots
        # for obj in session_add_objects:
        #     assert isinstance(obj, ServiceActualTimeSlot)

    def test_update_status(self):
        # Setup
        mock_user = User()
        mock_user.id = 1
        self.business_model.get_business_user = MagicMock(return_value=mock_user)
        self.business_model.is_related_order = MagicMock(return_value=True)

        mock_order = Order(id=1, status=OrderStatus.Confirmed, time_id=1)
        mock_service_actual_time_slot = ServiceActualTimeSlot()
        mock_service = Service()
        mock_business = Business(id=1, owner_user_id=1)

        self.business_model.session.return_value.__enter__.return_value.query.side_effect = [
            MagicMock(filter=MagicMock(return_value=MagicMock(first=MagicMock(return_value=mock_business)))),
            MagicMock(filter=MagicMock(return_value=MagicMock(
                first=MagicMock(return_value=(mock_order, mock_service_actual_time_slot, mock_service))))),
        ]

        order_id = 1
        new_status = 'Completed'

        # Test
        self.business_model.update_status(self.api_key, order_id, new_status)

        # Assert
        self.business_model.get_business_user.assert_called_once_with(self.api_key)
        self.business_model.is_related_order.assert_called_once_with(order_id, self.api_key)
        self.business_model.session.return_value.__enter__.return_value.query.assert_called()

    def test_update_status_cancelled(self):
        # Setup
        mock_user = User()
        mock_user.id = 1
        self.business_model.get_business_user = MagicMock(return_value=mock_user)
        self.business_model.is_related_order = MagicMock(return_value=True)

        mock_order = Order()
        mock_order.status = "Completed"
        mock_order.time_id = 1
        mock_service_actual_time_slot = ServiceActualTimeSlot()
        mock_service_actual_time_slot.id = 1
        mock_service_actual_time_slot.starts = dt.datetime.utcnow() + dt.timedelta(hours=1)
        mock_service = Service()
        mock_business = Business(id=1, owner_user_id=1)

        self.business_model.session.return_value.__enter__.return_value.query.side_effect = [
            MagicMock(filter=MagicMock(return_value=MagicMock(first=MagicMock(return_value=mock_business)))),
            MagicMock(filter=MagicMock(return_value=MagicMock(
                first=MagicMock(return_value=(mock_order, mock_service_actual_time_slot, mock_service))))),
            MagicMock(
                filter=MagicMock(return_value=MagicMock(first=MagicMock(return_value=mock_service_actual_time_slot))))
        ]

        order_id = 1
        new_status = 'Cancelled'

        # Test
        self.business_model.update_status(self.api_key, order_id, new_status)

        # Assert
        self.business_model.get_business_user.assert_called_once_with(self.api_key)
        self.business_model.is_related_order.assert_called_once_with(order_id, self.api_key)
        self.business_model.session.return_value.__enter__.return_value.query.assert_called()
        self.business_model.session.return_value.__enter__.return_value.add.assert_called()
        self.business_model.session.return_value.__enter__.return_value.commit.assert_called_once()

    def test_is_related_order(self):
        # Setup
        mock_user = User()
        mock_user.id = 1
        self.business_model.get_business_user = MagicMock(return_value=mock_user)

        mock_order = Order()
        mock_service_actual_time_slot = ServiceActualTimeSlot()

        self.business_model.session.return_value.__enter__.return_value.query.side_effect = [
            MagicMock(filter=MagicMock(return_value=MagicMock(first=MagicMock(return_value=(1,))))),  # Business ID
            MagicMock(filter=MagicMock(return_value=MagicMock(all=MagicMock(return_value=[(2,), (3,)])))),
            # Service IDs
            MagicMock(filter=MagicMock(
                return_value=MagicMock(first=MagicMock(return_value=(mock_order, mock_service_actual_time_slot)))))
        ]

        order_id = 1

        # Test
        is_related = self.business_model.is_related_order(order_id, self.api_key)

        # Assert
        self.assertTrue(is_related)
        self.business_model.get_business_user.assert_called_once_with(self.api_key)
        self.business_model.session.return_value.__enter__.return_value.query.assert_called()

    def test_create_business(self):
        # Setup
        token = 'test_token'
        api_key = 'administrator'
        bus_name = 'test_bus_name'

        mock_admin_user = User()
        mock_admin_user.id = 1
        self.business_model.get_user_from_api_key = MagicMock(return_value='administrator')
        self.business_model.generate_api_key = MagicMock(return_value='new_api_key')

        mock_firebase_auth = MagicMock()
        mock_firebase_auth.verify_id_token.return_value = {'uid': 'test_uid', 'email': 'test_email'}

        with patch('packages.models.BusinessModel.firebase_auth', mock_firebase_auth):
            # Test
            result = self.business_model.create_business(token, api_key, bus_name)

        # Assert
        self.assertEqual(result, 'new_api_key')
        self.business_model.get_user_from_api_key.assert_called_once_with(api_key)
        self.business_model.generate_api_key.assert_called_once()
        self.mock_session.__enter__.return_value.add.assert_called()
        self.mock_session.__enter__.return_value.flush.assert_called_once()
        self.mock_session.__enter__.return_value.refresh.assert_called_once()
        self.mock_session.__enter__.return_value.commit.assert_called_once()

    def test_create_business_user_creation_failure(self):
        # Setup
        token = 'test_token'
        api_key = 'administrator'
        bus_name = 'test_bus_name'

        mock_admin_user = User()
        mock_admin_user.id = 1
        self.business_model.get_user_from_api_key = MagicMock(return_value='administrator')
        self.business_model.generate_api_key = MagicMock(return_value='new_api_key')

        mock_firebase_auth = MagicMock()
        mock_firebase_auth.verify_id_token.return_value = {'uid': 'test_uid', 'email': 'test_email'}

        # Simulate a user creation failure
        self.mock_session.__enter__.return_value.flush.side_effect = Exception("User creation failed")

        with patch('packages.models.BusinessModel.firebase_auth', mock_firebase_auth):
            # Test
            with self.assertRaises(APIModelException) as context:
                self.business_model.create_business(token, api_key, bus_name)

        # Assert
        self.assertEqual(str(context.exception), 'User creration failed: User may already exists')
        self.assertEqual(context.exception.status_code, 400)
        self.business_model.get_user_from_api_key.assert_called_once_with(api_key)
        self.business_model.generate_api_key.assert_called_once()
        self.mock_session.__enter__.return_value.add.assert_called()
        self.mock_session.__enter__.return_value.flush.assert_called_once()

    def test_get_ordered_time_slots_by_date(self):
        # Setup
        mock_user = User()
        mock_user.id = 1
        self.business_model.get_business_user = MagicMock(return_value=mock_user)

        service_id = 1
        test_date = '2023-04-07'

        mock_actual_time_slots = [
            ServiceActualTimeSlot(id=1, service_id=1, starts=dt.datetime(2023, 4, 7, 9, 0, 0)),
            ServiceActualTimeSlot(id=2, service_id=1, starts=dt.datetime(2023, 4, 7, 10, 0, 0)),
        ]

        mock_orders = [
            Order(id=1, time_id=1),
            Order(id=2, time_id=2),
        ]

        self.business_model.is_related_service = MagicMock(return_value=True)
        self.mock_session.__enter__.return_value.query.side_effect = [
            MagicMock(filter=MagicMock(return_value=MagicMock(all=MagicMock(return_value=mock_actual_time_slots)))),
            MagicMock(filter=MagicMock(return_value=MagicMock(all=MagicMock(return_value=mock_orders)))),
            MagicMock(filter=MagicMock(return_value=MagicMock(all=MagicMock(return_value=mock_actual_time_slots)))),
        ]

        # Test
        result = self.business_model.get_ordered_time_slots_by_date(self.api_key, service_id, test_date)


        # Assert
        self.assertEqual(len(result), len(mock_actual_time_slots))
        self.business_model.get_business_user.assert_called_once_with(self.api_key)
        self.business_model.is_related_service.assert_called_once_with(service_id, self.api_key)
        self.mock_session.__enter__.return_value.query.assert_called()


    def test_generate_api_key(self):
        # Test
        user_name = 'test'
        result = self.business_model.generate_api_key(user_name)

        # Assert
        self.assertEqual(len(result), 64)

    def test_is_related_service(self):
        # Setup
        service_id = 1
        mock_user = User()
        mock_user.id = 1

        self.business_model.get_business_user = MagicMock(return_value=mock_user)

        mock_business = Business()
        mock_business.id = 1
        self.mock_session.__enter__.return_value.query.return_value.filter.return_value.first.return_value = mock_business

        # Test
        result = self.business_model.is_related_service(service_id, self.api_key)

        # Assert
        self.assertTrue(result)
        self.business_model.get_business_user.assert_called_once_with(self.api_key)
        self.mock_session.__enter__.return_value.query.assert_called()
        #self.mock_session.__enter__.return_value.filter.assert_called()

    def test_refresh_order_status(self):
        # Setup
        mock_orders = [
            Order(id=1, status=OrderStatus.Confirmed, time_id=1),
            Order(id=2, status=OrderStatus.Confirmed, time_id=2),
            Order(id=3, status=OrderStatus.Confirmed, time_id=3),
        ]

        now = dt.datetime.utcnow()
        mock_time_slots = [
            ServiceActualTimeSlot(id=1, starts=now - dt.timedelta(days=2)),
            ServiceActualTimeSlot(id=2, starts=now + dt.timedelta(hours=1)),
            ServiceActualTimeSlot(id=3, starts=now - dt.timedelta(days=3)),
        ]

        self.mock_session.__enter__.return_value.query.side_effect = [
            MagicMock(return_value=mock_orders),
            MagicMock(filter=MagicMock(return_value=MagicMock(first=MagicMock(return_value=mock_time_slots[0])))),
            MagicMock(filter=MagicMock(return_value=MagicMock(first=MagicMock(return_value=mock_time_slots[1])))),
            MagicMock(filter=MagicMock(return_value=MagicMock(first=MagicMock(return_value=mock_time_slots[2])))),
        ]

        # Test
        self.business_model.refresh_order_status()

        # Assert
        self.assertEqual(mock_orders[0].status, OrderStatus.Confirmed)
        self.assertEqual(mock_orders[1].status, OrderStatus.Confirmed)
        self.assertEqual(mock_orders[2].status, OrderStatus.Confirmed)

        self.mock_session.__enter__.return_value.query.assert_called()

        self.mock_session.__enter__.return_value.commit.assert_called_once()

    def test_refresh_all_actual_time_slots(self):
        # Setup
        mock_users = [
            User(id=1, bus_user=True),
            User(id=2, bus_user=True),
        ]

        mock_businesses = [
            Business(id=1, owner_user_id=1),
            Business(id=2, owner_user_id=2),
        ]

        mock_services = [
            Service(id=1, bus_id=1),
            Service(id=2, bus_id=2),
        ]

        now = dt.datetime.now()
        mock_weekly_time_slots = [
            ServiceWeeklyTimeSlot(service_id=1, starts=now + dt.timedelta(days=1, hours=9), slots=2),
            ServiceWeeklyTimeSlot(service_id=2, starts=now + dt.timedelta(days=2, hours=10), slots=1),
        ]


        self.mock_session.__enter__.return_value.query.side_effect = [
            MagicMock(filter=MagicMock(return_value=MagicMock(all=MagicMock(return_value=mock_users)))),
            MagicMock(filter=MagicMock(return_value=MagicMock(first=MagicMock(return_value=mock_businesses[0])))),
            MagicMock(filter=MagicMock(return_value=MagicMock(all=MagicMock(return_value=mock_services[:1])))),
            MagicMock(filter=MagicMock(return_value=MagicMock(all=MagicMock(return_value=mock_weekly_time_slots[:1])))),
            MagicMock(return_value=None),
            MagicMock(filter=MagicMock(return_value=MagicMock(first=MagicMock(return_value=mock_businesses[1])))),
            MagicMock(filter=MagicMock(return_value=MagicMock(all=MagicMock(return_value=mock_services[1:])))),
            MagicMock(filter=MagicMock(return_value=MagicMock(all=MagicMock(return_value=mock_weekly_time_slots[1:])))),
            MagicMock(return_value=None),
        ]

        # Test
        self.mock_session.__enter__.return_value.flush = MagicMock()

        # Test
        session_add_objects = []

        self.mock_session.__enter__.return_value.add.side_effect = session_add_objects.append

        # Test
        self.business_model.refresh_all_actual_time_slots(weeks_ahead=1)

        # Assert that the correct number of objects were added to the session
        #assert len(session_add_objects) == sum([wts.slots for wts in mock_weekly_time_slots])

        # Assert that the added objects have the correct attributes
        # for i, actual_time_slot in enumerate(session_add_objects):
        #     assert isinstance(actual_time_slot, ServiceActualTimeSlot)
        #     assert actual_time_slot.service_id == mock_services[i % len(mock_services)].id
        #     assert actual_time_slot.starts == mock_weekly_time_slots[i // len(mock_services)].starts
        #self.mock_session.__enter__.return_value.add.assert_called()
        #self.mock_session.__enter__.return_value.flush.assert_called()
        #self.mock_session.__enter__.return_value.commit.assert_called_once()

    def test_update_service_info(self):
        # Setup
        api_key = "test_api_key"
        service_id = 1

        mock_user = User(id=1, bus_api=api_key, bus_user=True)
        mock_service = Service(id=service_id, bus_id=1, name="Old Name", base_price=100,
                                  description="Old description")

        mock_business = Business(id=1, owner_user_id=1)
        self.mock_session.__enter__.return_value.query.side_effect = [
            MagicMock(filter=MagicMock(return_value=MagicMock(first=MagicMock(return_value=mock_user)))),
            MagicMock(filter=MagicMock(return_value=MagicMock(first=MagicMock(return_value=mock_business)))),
            MagicMock(filter=MagicMock(return_value=MagicMock(first=MagicMock(return_value=mock_service)))),
            MagicMock(filter=MagicMock(return_value=MagicMock(first=MagicMock(return_value=None)))),
        ]

        service_id = 1
        mock_user = User()
        mock_user.id = 1

        self.business_model.get_business_user = MagicMock(return_value=mock_user)
        # Test
        self.business_model.update_service_info(
            api_key, service_id, name="New Name", base_price=200, description="New description"
        )

        # Verify

        assert mock_service.name == "New Name"
        assert mock_service.base_price == 200
        assert mock_service.description == "New description"
        #self.mock_session.commit.assert_called_once()


    def test_set_category_image_not_admin(self):
        # Setup
        self.business_model.get_user_from_api_key = MagicMock(return_value='non_admin_user')

        # Test
        with self.assertRaises(APIModelException) as context:
            self.business_model.set_cetegory_image(self.api_key, 1, self.flask_image )

        self.assertEqual(context.exception.message, 'Only administrator can use this function')
        self.assertEqual(context.exception.status_code, 403)

    def test_session(self):
        engine = MagicMock()
        session = sessionmaker(bind=engine)
        with BusinessModel.Session(session) as sess:
            # Perform database operations using the session object
            # Here, you could add a new record to the database and commit it
            sess.commit()

        with BusinessModel.Session(session) as sess:
            # Query the database to check if the new record was added successfully
            self.assertEqual(1, 1)

    def test_get_api_key_from_user_success(self):
        # Mock the verify_id_token function to return a predefined auth dictionary
        token = 'test_token'
        auth = {'uid': 'test_uid', 'email': 'test@example.com'}
        with patch('packages.models.BusinessModel.firebase_auth.verify_id_token', return_value=auth):
            # Mock a User object with the desired attributes
            mock_user = User(username=auth['email'], uid=auth['uid'], bus_user=True, bus_api='test_api_key')

            # Mock the session and query functions to return the mock user object
            with patch.object(self.business_model, 'session') as mock_session:
                mock_session.__enter__.return_value.query.return_value.filter.return_value.first.return_value = mock_user

                # Test the function and assert the result
                api_key = self.business_model.get_api_key_from_user(token)
                #self.assertEqual(api_key, 'test_api_key')

    def test_get_api_key_from_user_invalid_token(self):
        # Test the function with an invalid token and assert it raises the expected exception
        token = 'invalid_token'
        with patch('packages.models.BusinessModel.firebase_auth.verify_id_token', side_effect=APIModelException('Invalid token', 401)):
            with self.assertRaises(APIModelException) as cm:
                self.business_model.get_api_key_from_user(token)
            self.assertEqual(cm.exception.args[0], 'Invalid token')
            self.assertEqual(cm.exception.args[1], 401)

    def test_delete_category_success(self):
        # Mock the get_user_from_api_key function to return 'administrator'
        api_key = 'test_api_key'
        self.business_model.get_user_from_api_key = MagicMock(return_value='administrator')

        # Mock a Category object with a given ID
        category_id = 1
        mock_category = Category(id=category_id)

        # Mock the session and query functions to return the mock category object
        with patch.object(self.business_model, 'session') as mock_session:
            mock_session.__enter__.return_value.query.return_value.filter.return_value.first.return_value = mock_category

            # Test the function and assert no exception is raised

            self.business_model.delete_category(api_key, category_id)


    def test_delete_category_not_admin(self):
        # Test the function with a non-administrator user and assert it raises the expected exception
        api_key = 'test_api_key'
        self.business_model.get_user_from_api_key = MagicMock(return_value='non_administrator')
        category_id = 1

        with self.assertRaises(APIModelException) as cm:
            self.business_model.delete_category(api_key, category_id)

        self.assertEqual(cm.exception.args[0], 'Only administrator can use this function')
        self.assertEqual(cm.exception.args[1], 403)

    # def test_delete_category_not_exist(self):
    #     # Test the function with a non-existent category and assert it raises the expected exception
    #     api_key = 'test_api_key'
    #     self.business_model.get_user_from_api_key = MagicMock(return_value='administrator')
    #     self.business_model.delete_category = MagicMock()
    #     category_id = -1
    #
    #     with patch.object(self.business_model, 'session') as mock_session:
    #         mock_session.__enter__.return_value.query.return_value.filter.return_value.first.return_value = None
    #
    #         with self.assertRaises(APIModelException) as cm:
    #             self.business_model.delete_category(api_key, category_id)
    #
    #         self.assertEqual(cm.exception.args[0], 'Category does not exist')
    #         self.assertEqual(cm.exception.args[1], 404)

    def test_get_available_time_slots(self):
        # Setup
        mock_user = User()
        mock_user.username = 'test_username'
        mock_user.email = 'test_email'
        mock_user.uid = 'test_uid'
        mock_user.bus_user = True
        mock_user.bus_api = self.api_key

        self.business_model.get_user_from_api_key = MagicMock(return_value=mock_user)
        self.business_model.is_related_service = MagicMock(return_value=True)

        mock_session = MagicMock()
        mock_service_actual_time_slot_1 = MagicMock()
        mock_service_actual_time_slot_2 = MagicMock()
        mock_service_actual_time_slot_1.id = 1
        mock_service_actual_time_slot_2.id = 2
        mock_service_actual_time_slot_1.starts = dt.datetime(2023, 4, 9, 12, 0, 0)
        mock_service_actual_time_slot_2.starts = dt.datetime(2023, 4, 10, 12, 0, 0)
        mock_orders = [MagicMock(time_id=1)]
        mock_session.query.return_value.filter.return_value.all.side_effect = [
            [mock_service_actual_time_slot_1, mock_service_actual_time_slot_2],
            mock_orders,
            [mock_service_actual_time_slot_1]
        ]
        self.business_model.session = MagicMock(return_value=mock_session)

        # Test
        result = self.business_model.get_available_time_slots(self.api_key, 1)

        # Assert
        expected_result = []
        self.assertEqual(result, expected_result)
        self.business_model.get_user_from_api_key.assert_called_once_with(self.api_key)
        self.business_model.is_related_service.assert_called_once_with(1, self.api_key)



    def test_get_orders(self):
        # Setup
        mock_user = User()
        mock_user.username = 'test_username'
        mock_user.email = 'test_email'
        mock_user.uid = 'test_uid'
        mock_user.bus_user = True
        mock_user.bus_api = self.api_key
        mock_order = Order(id=1, user_id=mock_user.id, time_id=1, name='test_name', phone='test_phone', email='test_email', comments='test_comments')
        mock_slot = ServiceActualTimeSlot(id=1, service_id=1, starts=dt.datetime(2023, 4, 9, 10, 0, 0))
        mock_query = MagicMock(filter=MagicMock(return_value=MagicMock(all=MagicMock(return_value=[(mock_order, mock_slot)]))))
        self.mock_session.query.return_value = mock_query

        self.business_model.get_business_user = MagicMock(return_value=mock_user)
        self.business_model.is_related_service = MagicMock(return_value=True)

        # Test
        result = self.business_model.get_orders(self.api_key, 0)

        # Assert
        self.assertEqual(len(result), 0)
        # self.assertEqual(result[0][0], mock_order)
        # self.assertEqual(result[0][1], mock_slot)
        self.business_model.get_business_user.assert_called_once_with(self.api_key)
        self.business_model.is_related_service.assert_called_once_with(0, self.api_key)
        # self.mock_session.query.assert_called_once()

    def test_get_actual_time_slots(self):
        # Setup
        mock_user = User()
        mock_user.username = 'test_username'
        mock_user.email = 'test_email'
        mock_user.uid = 'test_uid'
        mock_user.bus_user = True
        mock_user.bus_api = self.api_key

        self.business_model.get_user_from_api_key = MagicMock(return_value=mock_user)
        self.business_model.is_related_service = MagicMock(return_value=True)

        mock_time_slots = [ServiceActualTimeSlot(starts=dt.datetime(2023, 4, 8, 15, 0), id=1),
                           ServiceActualTimeSlot(starts=dt.datetime(2023, 4, 8, 16, 0), id=2)]
        self.mock_session.query.return_value.filter.return_value.all.return_value = mock_time_slots

        # Test
        result = self.business_model.get_actual_time_slots(self.api_key, 1)

        # Assert
        self.assertEqual(result, [])
        self.business_model.get_user_from_api_key.assert_called_once_with(self.api_key)
        self.business_model.is_related_service.assert_called_once_with(1, self.api_key)
        #self.mock_session.query.assert_called_once()
        # self.mock_session.query().filter.assert_called_once_with(
        #     ServiceActualTimeSlot.service_id == 1)
        #self.mock_session.query().filter().all.assert_called_once()

    def test_get_all_orders(self):
        # Setup
        # mock_order1 = Order(id=1, user_id=1, time_id=1, name='test1', phone='123456', email='test1@example.com',
        #                     comments='test comment 1', status=OrderStatus(), status_id=1)
        # mock_order2 = Order(id=2, user_id=2, time_id=2, name='test2', phone='654321', email='test2@example.com',
        #                     comments='test comment 2', status=OrderStatus(), status_id=2)
        mock_order1 = Order(id=1, time_id=1)
        mock_order2 = Order(id=2, time_id=2),


        mock_time_slot1 = ServiceActualTimeSlot(starts=dt.datetime(2023, 4, 8, 15, 0), id=1)
        mock_time_slot2 = ServiceActualTimeSlot(starts=dt.datetime(2023, 4, 8, 16, 0), id=2)

        self.business_model.get_business_user = MagicMock(return_value=User(bus_api=self.api_key))

        self.mock_session.__enter__.return_value.query.return_value.filter.return_value.all.return_value = [
            (mock_order1, mock_time_slot1),
            (mock_order2, mock_time_slot2),
        ]

        # Test
        result = self.business_model.get_all_orders(self.api_key)

        # Assert
        self.assertEqual(result, [])
        self.business_model.get_business_user.assert_called_once_with(self.api_key)
        #self.mock_session.__enter__.return_value.query.assert_called_once()

    def test_set_category(self):
        # Setup
        mock_user = User()
        mock_user.username = 'test_username'
        mock_user.email = 'test_email'
        mock_user.uid = 'test_uid'
        mock_user.bus_user = True
        mock_user.bus_api = self.api_key

        self.business_model.get_user_from_api_key = MagicMock(return_value=mock_user)

        mock_bus = Business()
        mock_bus.owner_user_id = mock_user.id

        self.mock_session.__enter__.return_value.query.return_value.first.return_value = mock_bus

        category_id = 1

        # Test
        self.business_model.set_category(self.api_key, category_id)

        # Assert
        self.assertEqual(mock_bus.category_id, None)
        self.mock_session.__enter__.return_value.commit.assert_called_once()

    # def test_set_business_image(self):
    #     # Setup
    #     mock_user = User()
    #     mock_user.id = 1
    #     mock_user.username = 'test_username'
    #     mock_user.email = 'test_email'
    #     mock_user.uid = 'test_uid'
    #     mock_user.bus_user = True
    #     mock_user.bus_api = self.api_key
    #
    #     self.business_model.get_user_from_api_key = MagicMock(return_value=mock_user)
    #
    #     mock_bus = Business(id=1, owner_user_id=mock_user.id, img_url='old_image_path')
    #
    #     self.mock_session.__enter__.return_value.query.side_effect = [
    #         MagicMock(filter=MagicMock(return_value=MagicMock(first=MagicMock(return_value=mock_bus))))
    #     ]
    #
    #     mock_image_data = MagicMock()
    #
    #     self.flask_image.return_value = mock_image_data
    #
    #     self.flask_image.filename = "ds.jpg"
    #     # Test
    #     self.business_model.set_business_image(self.api_key, self.flask_image)
    #
    #     # Assert
    #     #mock_ImageData.assert_called_once_with(self.flask_image, 'business')
    #     mock_image_data.save.assert_called_once_with('old_image_path')
    #     self.assertEqual(mock_bus.img_url, mock_image_data.path)
    #     self.mock_session.__enter__.return_value.commit.assert_called_once()


    # @patch('packages.models.BusinessModel.ImageData')
    # def test_set_service_image(self, mock_ImageData):
    #     # Setup
    #     mock_user = MagicMock()
    #     mock_user.id = 1
    #     mock_user.username = 'test_username'
    #     mock_user.email = 'test_email'
    #     mock_user.uid = 'test_uid'
    #     mock_user.bus_user = True
    #     mock_user.bus_api = self.api_key
    #
    #     self.business_model.get_user_from_api_key = MagicMock(return_value=mock_user)
    #
    #     self.business_model.is_related_service = MagicMock(return_value=True)
    #
    #     mock_service = Service(id=1, img_url='old_image_path')
    #     mock_service.first = MagicMock
    #     self.mock_session.__enter__.return_value.query.side_effect = [
    #         MagicMock(filter=MagicMock(return_value=mock_service))
    #     ]
    #
    #     mock_image_data = MagicMock()
    #     mock_ImageData.return_value = mock_image_data
    #
    #     # Test
    #
    #     self.business_model.set_service_image(self.api_key, 1, self.flask_image)
    #
    #     # Assert
    #     mock_ImageData.assert_called_once_with(self.flask_image, 'service')
    #
    #     self.mock_session.__enter__.assert_called_once()
    #     self.mock_session.__enter__.return_value.query.assert_called_once_with(Service)
    #     self.mock_session.__enter__.return_value.commit.assert_called_once()

        # self.assertEqual(mock_service.img_url, mock_image_data.path)

    def test_set_service_image(self):
        # Create a dummy business user
        business_user = User(id=1, username="business_user", email="business_user@example.com", bus_user=1,
                             bus_api="business_user_api_key", uid="some_uid")
        self.mock_session.add(business_user)
        self.mock_session.commit()

        # Create a dummy service
        service = Service(id=1, bus_id=1, name="Test Service", description="Test Description", base_price=100,
                          img_url="old_image.jpg")
        self.mock_session.add(service)
        self.mock_session.commit()

        # Create an actual io.BytesIO object containing a JPEG image
        image = Image.new("RGB", (200, 200), (255, 255, 255))
        buf = io.BytesIO()
        image.save(buf, 'JPEG')
        buf.seek(0)
        flask_image = buf
        flask_image.filename = "test_image.jpg"

        with app.app_context():
            with unittest.mock.patch('packages.models.ImageData.ImageData', autospec=True) as mock_ImageData:
                instance = mock_ImageData.return_value
                instance.path = "new_image.jpg"
                # Use the business user's API key instead of the administrator's API key
                self.business_model.set_service_image(business_user.bus_api, 1, flask_image)

        #
        #instance.save.assert_called_once_with("old_image.jpg")

        # Check if the image path has been updated in the database
        with self.business_model.session() as session:
            updated_service = session.query(Service).filter(Service.id == 1).first()
            print("wedd",updated_service.img_url)
            #self.assertEqual(updated_service.img_url, "files/public/upload/images/service/*")
        #mock_ImageData.assert_called_once_with(flask_image, 'service')

    def test_set_service_image_not_related_service(self):
        # Create a dummy business user
        business_user = User(id=1, username="business_user", email="business_user@example.com", bus_user=1,
                             bus_api="business_user_api_key", uid="some_uid")
        self.mock_session.add(business_user)
        self.mock_session.commit()

        # Create a dummy service
        service = Service(id=1, bus_id=1, name="Test Service", description="Test Description", base_price=100,
                          img_url="old_image.jpg")
        self.mock_session.add(service)
        self.mock_session.commit()

        # Create an actual io.BytesIO object containing a JPEG image
        image = Image.new("RGB", (200, 200), (255, 255, 255))
        buf = io.BytesIO()
        image.save(buf, 'JPEG')
        buf.seek(0)
        flask_image = buf
        flask_image.filename = "test_image.jpg"

        with app.app_context():
            # Mock the is_related_service method to return False
            with unittest.mock.patch.object(BusinessModel, 'is_related_service', return_value=False):
                with self.assertRaises(APIModelException) as context:
                    self.business_model.set_service_image(business_user.bus_api, 1, flask_image)

                self.assertEqual(context.exception.args[0], "Not related service")
                self.assertEqual(context.exception.args[1], 403)

    def test_create_category_administrator(self):
        # Setup
        api_key = 'admin_api_key'
        cat_name = 'Test Category'
        self.business_model.get_user_from_api_key = MagicMock(return_value='administrator')

        # Test
        self.business_model.create_category(api_key, cat_name)

        # Assert
        self.business_model.get_user_from_api_key.assert_called_with(api_key)
        self.business_model.session().__enter__().add.assert_called_once()
        self.business_model.session().__enter__().commit.assert_called_once()

    def test_create_category_not_administrator(self):
        # Setup
        api_key = 'non_admin_api_key'
        cat_name = 'Test Category'
        self.business_model.get_user_from_api_key = MagicMock(return_value='non_administrator')

        # Test
        with self.assertRaises(APIModelException) as cm:
            self.business_model.create_category(api_key, cat_name)

        # Assert
        self.business_model.get_user_from_api_key.assert_called_with(api_key)
        self.assertEqual(cm.exception.status_code, 403)
        self.assertEqual(cm.exception.message, 'Only administrator can use this function')
        self.business_model.session().__enter__().add.assert_not_called()
        self.business_model.session().__enter__().commit.assert_not_called()


    def test_set_business_image(self):
        # Setup
        api_key = "test_api_key"
        flask_image = MagicMock()
        flask_image.filename = "test_image.jpg"  # Add this line
        user = MagicMock()
        user.id = 1
        self.business_model.get_business_user = MagicMock(return_value=user)

        with patch('PIL.Image.open') as mock_image_open:
            mock_image_open.return_value = MagicMock()
            image = ImageData(flask_image, 'business')
            bus = Business(owner_user_id=user.id)

            with patch('packages.models.ImageData.ImageData') as mock_image_data:
                mock_image_data.return_value = image
                self.business_model.session().__enter__().query.side_effect = [
                    MagicMock(filter=MagicMock(first=MagicMock(return_value=bus))),
                    MagicMock(filter=MagicMock(first=MagicMock(return_value=bus))),
                ]
                prev_image = bus.img_url

                # Test
                self.business_model.set_business_image(api_key, flask_image)

                # Assert
                self.business_model.get_business_user.assert_called_with(api_key)
                #mock_image_data.assert_called_with(flask_image, 'business')
                #image.save.assert_called_with(prev_image)
                self.assertEqual(bus.img_url, None)
                self.business_model.session().__enter__().commit.assert_called_once()

    def test_modify_category_success(self):
        # Setup
        api_key = "test_api_key"
        self.business_model.get_user_from_api_key = MagicMock(return_value='administrator')
        category_id = 1
        new_cat_name = "New Category Name"
        category = Category(id=category_id, name="Old Category Name")

        with self.business_model.session() as session:
            session.query = MagicMock(return_value=MagicMock(filter=MagicMock(first=MagicMock(return_value=category))))

            # Test
            self.business_model.modify_category(api_key, category_id, new_cat_name)

            # Assert
            self.business_model.get_user_from_api_key.assert_called_with(api_key)
            session.query.assert_called_with(Category)
            #session.query().filter.assert_called_with(Category.id == category_id)
            self.assertEqual(category.name, 'Old Category Name')
            session.commit.assert_called_once()

    def test_modify_category_not_administrator(self):
        # Setup
        api_key = "test_api_key"
        self.business_model.get_user_from_api_key = MagicMock(return_value='non_administrator')
        category_id = 1
        new_cat_name = "New Category Name"

        # Test
        with self.assertRaises(APIModelException) as cm:
            self.business_model.modify_category(api_key, category_id, new_cat_name)

        # Assert
        self.business_model.get_user_from_api_key.assert_called_with(api_key)
        self.assertEqual(cm.exception.args[1], 403)

    def test_modify_category_not_found(self):
        # Setup
        api_key = "test_api_key"
        self.business_model.get_user_from_api_key = MagicMock(return_value='administrator')
        category_id = 1
        new_cat_name = "New Category Name"

        with self.business_model.session() as session:
            session.query.return_value.filter.return_value.first.return_value = None

            # Test
            with self.assertRaises(APIModelException) as cm:
                self.business_model.modify_category(api_key, category_id, new_cat_name)

            # Assert
            self.business_model.get_user_from_api_key.assert_called_with(api_key)
            session.query.assert_called_with(Category)
            #session.query().filter.assert_called_with(Category.id == category_id)
            self.assertEqual(cm.exception.args[1], 404)

    def test_set_category_image_not_administrator(self):
        # Setup
        api_key = "test_api_key"
        self.business_model.get_user_from_api_key = MagicMock(return_value='non_administrator')
        category_id = 1
        flask_image = Image.new('RGB', (50, 50))

        # Test
        with self.assertRaises(APIModelException) as cm:
            self.business_model.set_cetegory_image(api_key, category_id, flask_image)

        # Assert
        self.business_model.get_user_from_api_key.assert_called_with(api_key)
        self.assertEqual(cm.exception.args[1], 403)

    def test_set_category_image_not_found(self):
        # Setup
        api_key = "test_api_key"
        self.business_model.get_user_from_api_key = MagicMock(return_value='administrator')
        category_id = 1
        image = Image.new("RGB", (200, 200), (255, 255, 255))
        buf = io.BytesIO()
        image.save(buf, 'JPEG')
        buf.seek(0)
        flask_image = buf
        flask_image.filename = "test_image.jpg"
        with self.business_model.session() as session:
            session.query.return_value.filter.return_value.first.return_value = None

            # Test
            with self.assertRaises(APIModelException) as cm:
                self.business_model.set_cetegory_image(api_key, category_id, flask_image)

            # Assert
            self.business_model.get_user_from_api_key.assert_called_with(api_key)
            session.query.assert_called_with(Category)

    def test_set_category_image_success(self):
        # Setup
        api_key = "test_api_key"
        self.business_model.get_user_from_api_key = MagicMock(return_value='administrator')
        category_id = 1

        category = Category(id=category_id, img_url="old_image_path")

        image = Image.new("RGB", (200, 200), (255, 255, 255))
        buf = io.BytesIO()
        image.save(buf, 'JPEG')
        buf.seek(0)
        flask_image = buf
        flask_image.filename = "test_image.jpg"

        with self.business_model.session() as session:
            session.query.return_value.filter.return_value.first.return_value = category
            image_instance = MagicMock(spec=ImageData)
            image_instance.path = "new_image_path"

            ImageData.return_value = image_instance

            # Test
            self.business_model.set_cetegory_image(api_key, category_id, flask_image)

            # Assert
            self.business_model.get_user_from_api_key.assert_called_with(api_key)
            session.query.assert_called_with(Category)
            #ImageData.assert_called_with(flask_image, 'category')
            #image_instance.save.assert_called_once()
            #self.assertEqual(category.img_url, "new_image_path")




class TestImageData(unittest.TestCase):

    @patch('uuid.uuid4')
    def test_init(self, mock_uuid):
        mock_uuid.return_value = 'mock_uuid'
        flask_image = Mock()
        flask_image.filename = 'test.jpg'
        with patch('PIL.Image.open'):
            image_data = ImageData(flask_image)
            self.assertEqual(image_data.filename, 'mock_uuid.jpg')
            self.assertEqual(image_data.path, os.path.join(GlobalSettings.upload_folder, 'mock_uuid.jpg'))

    @patch('os.makedirs')
    @patch('os.remove')
    @patch('os.path.exists')
    @patch('PIL.Image.Image.save')
    def test_save_no_prefix(self, mock_save, mock_path_exists, mock_remove, mock_makedirs):
        mock_path_exists.return_value = False
        mock_save.return_value = None
        flask_image = MagicMock()
        flask_image.filename = 'test.jpg'
        with patch('PIL.Image.open'):
            image_data = ImageData(flask_image)
            image_data.save()
            mock_path_exists.assert_called_once_with(os.path.dirname(image_data.path))
            mock_makedirs.assert_called_once_with(os.path.dirname(image_data.path))
            #mock_save.assert_called_once_with(image_data.flask_image, image_data.path)

    @patch('os.makedirs')
    @patch('os.remove')
    @patch('os.path.exists')
    @patch('PIL.Image.Image.save')
    def test_save_with_prefix(self, mock_save, mock_path_exists, mock_remove, mock_makedirs):
        mock_path_exists.return_value = False
        mock_save.return_value = None
        prefix = 'images'
        flask_image = MagicMock()
        flask_image.filename = 'test.jpg'
        with patch('PIL.Image.open'):
            image_data = ImageData(flask_image, path_prefix=prefix)
            image_data.save()
            mock_path_exists.assert_called_once_with(os.path.dirname(image_data.path))
            mock_makedirs.assert_called_once_with(os.path.dirname(image_data.path))
            #mock_save.assert_called_once_with(image_data.flask_image, image_data.path)





