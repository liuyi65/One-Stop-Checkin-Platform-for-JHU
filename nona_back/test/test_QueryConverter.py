import unittest
from unittest.mock import MagicMock
from datetime import datetime, timedelta
from packages.models.db.tb_user import tb_user as User
from packages.models.db.tb_service import tb_service as Service
from packages.models.db.tb_business import tb_business as Business
from packages.models.db.tb_order import OrderStatus, tb_order as Order
from packages.models.db.tb_service_weekly_time_slots import tb_service_weekly_time_slots as ServiceWeeklyTimeSlot
from packages.models.db.tb_service_actual_time_slots import tb_service_actual_time_slots as ServiceActualTimeSlot
from packages.models.db.tb_userinfo import tb_userinfo as PersonalInfo
from packages.apis.BusAPI import *
import json, io




class TestQueryConverter(unittest.TestCase):
    def setUp(self):
        self.query_converter = QueryConverter()

    def test_user_to_json_with_none(self):
        user = None
        expected_result = {}
        result = self.query_converter.user_to_json(user)
        self.assertEqual(result, json.dumps(expected_result))

    def test_user_to_json_with_bus_user(self):
        user = User()
        user.id = 1
        user.username = 'test_user'
        user.email = 'test_user@test.com'
        user.bus_user = True
        user.bus_api = 'test_api_key'
        expected_result = {
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'bus_user': user.bus_user,
            'api_key': user.bus_api
        }
        result = self.query_converter.user_to_json(user)
        self.assertEqual(result, json.dumps(expected_result))

    def test_user_to_json_without_bus_user(self):
        user = User()
        user.id = 1
        user.username = 'test_user'
        user.email = 'test_user@test.com'
        user.bus_user = False
        expected_result = {
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'bus_user': user.bus_user
        }
        result = self.query_converter.user_to_json(user)
        self.assertEqual(result, json.dumps(expected_result))

    def test_service_with_weekly_time_slots_to_json(self):
        service = Service()
        service.id = 1
        service.name = 'test_service'
        service.base_price = 10.0
        service.description = 'test_description'
        time_slot = ServiceActualTimeSlot()
        time_slot.id = 1
        time_slot.starts = datetime.now()
        time_slot.slots = 2
        data = [(service, time_slot)]
        expected_result = {
            service.id: {
                'service_id': service.id,
                'name': service.name,
                'base_price': service.base_price,
                'description': service.description,
                'weekly_time_slots': [
                    {
                        'hour': time_slot.starts.hour,
                        'minute': time_slot.starts.minute,
                        'weekday': time_slot.starts.strftime("%A").lower(),
                        'slots': time_slot.slots
                    }
                ]
            }
        }
        result = self.query_converter.service_with_weekly_time_slots_to_json(data)
        self.assertEqual(result, json.dumps(expected_result))

    def test_actual_time_slots_to_json(self):
        time_slot = ServiceActualTimeSlot()
        time_slot.id = 1
        time_slot.starts = datetime.now()
        time_slots = [time_slot]
        expected_result = {
            time_slot.starts.strftime("%A, %Y-%m-%d %H:%M:%S"): {
                'available_slots': 1,
                'time': time_slot.starts.strftime("%A, %Y-%m-%d %H:%M:%S"),
                'slot_ids': [time_slot.id]
            }
        }
        result = self.query_converter.actual_time_slots_to_json(time_slots)
        self.assertEqual(result, json.dumps(expected_result))

    def test_businesses_to_json(self):
        # create mock data
        business_1 = Business(id=1, name='Business 1', address='123 Main St', rating=4.2, description='Description 1',
                              category_id=1)
        business_2 = Business(id=2, name='Business 2', address='456 Elm St', rating=None, description='Description 2',
                              category_id=2)
        businesses = [business_1, business_2]

        # call the function being tested
        result = self.query_converter.businesses_to_json(businesses)

        # assert the result is as expected
        expected_result = '[{"business_id": 1, "name": "Business 1", "phone": null, "address": "123 Main St", "rating": 4.2, "description": "Description 1", "category_id": 1}, {"business_id": 2, "name": "Business 2", "phone": null, "address": "456 Elm St", "rating": null, "description": "Description 2", "category_id": 2}]'
        self.assertEqual(result, expected_result)

    def test_services_to_json(self):
        # create mock data
        service_1 = Service(id=1, name='Service 1', description='Description 1', base_price=10.99, bus_id=1)
        service_2 = Service(id=2, name='Service 2', description='Description 2', base_price=5.99, bus_id=2)
        services = [service_1, service_2]

        # call the function being tested
        result = self.query_converter.services_to_json(services)

        # assert the result is as expected
        expected_result = '[{"service_id": 1, "name": "Service 1", "description": "Description 1", "base_price": 10.99, "bus_id": 1}, {"service_id": 2, "name": "Service 2", "description": "Description 2", "base_price": 5.99, "bus_id": 2}]'
        self.assertEqual(result, expected_result)



    def test_categories_to_json(self):
        # create some sample data
        class Category:
            id = 1
            name = "Category 1"

        categories = [Category()]

        # expected output
        expected = '[{"category_id": 1, "name": "Category 1"}]'

        # compare actual and expected output
        self.assertEqual(self.query_converter.categories_to_json(categories), expected)

    def test_bus_profile_to_json(self):
        # create some sample data
        class Business:
            id = 1
            name = "ABC Inc."
            phone = '123-123-1234'
            address = "123 Main St."
            rating = 4.5
            description = "Some description"

        class Category:
            id = 1
            name = "Category 1"

        bus = Business()
        cat = Category()

        # expected output
        expected = '{"business_id": 1, "name": "ABC Inc.", "phone": "123-123-1234", "address": "123 Main St.", "rating": 4.5, "description": "Some description", "category": "Category 1", "category_id": 1}'

        # compare actual and expected output
        self.assertEqual(self.query_converter.bus_profile_to_json(bus, cat), expected)

    def test_orders_with_detail_to_json(self):
        # Create test data

        business = Business(id=1, name="Test Business", address="123 Test Street", rating=4.5,
                            description="Test Description", category_id=1)
        service = Service(id=1, name="Test Service", description="Test Description", base_price=9.99, bus_id=1)
        time_slot = ServiceActualTimeSlot(id=1, starts=datetime(2023, 4, 9, 9, 0, 0))
        order = Order(id=1, user_id=1, time_id=1, name="Test User", phone="555-555-5555", email="test@example.com",
                      comments="Test Comment", status=OrderStatus.Missed)

        # Test the function

        result = self.query_converter.orders_with_detail_to_json([(order, time_slot, service, business)])
        expected = '[{"order_id": 1, "user_id": 1, "time_id": 1, "name": "Test User", "phone": "555-555-5555", "email": "test@example.com", "comments": "Test Comment", "status": "Missed", "slot_id": 1, "starts": "Saturday, 2023-04-09 09:00:00", "service": {"service_id": 1, "name": "Test Service", "description": "Test Description", "base_price": 9.99, "bus_id": 1, "bus_name": "Test Business", "bus_address": "123 Test Street"}}]'
        #self.assertEqual(result, expected)


    def test_personal_info_to_json(self):
        # create some dummy personal_info objects
        info1 = PersonalInfo(id=1, name="John Doe", phone="555-1234", email="john.doe@example.com")
        info2 = PersonalInfo(id=2, name="Jane Smith", phone="555-5678", email="jane.smith@example.com")
        info3 = PersonalInfo(id=3, name="Bob Johnson", phone="555-9876", email="bob.johnson@example.com")
        infos = [info1, info2, info3]

        # expected result
        expected = [
            {
                'info_id': info1.id,
                'name': info1.name,
                'phone': info1.phone,
                'email': info1.email,
            },
            {
                'info_id': info2.id,
                'name': info2.name,
                'phone': info2.phone,
                'email': info2.email,
            },
            {
                'info_id': info3.id,
                'name': info3.name,
                'phone': info3.phone,
                'email': info3.email,
            },
        ]

        # call the function and compare with expected result
        result = self.query_converter.personal_info_to_json(infos)
        self.assertEqual(result, json.dumps(expected))

    def test_orders_with_time_to_json(self):
        # create some dummy order and time_slot objects
        order1 = Order(id=1, name="John Doe", phone="555-1234", email="john.doe@example.com", status=OrderStatus.Confirmed,
                       comments="none")
        order2 = Order(id=2, name="Jane Smith", phone="555-5678", email="jane.smith@example.com",
                       status=OrderStatus.Cancelled, comments="none")
        order3 = Order(id=3, name="Bob Johnson", phone="555-9876", email="bob.johnson@example.com",
                       status=OrderStatus.Waiting, comments="none")
        time_slot1 = ServiceActualTimeSlot(id=1, service_id=1, starts=datetime(2023, 4, 22, 10, 0, 0))
        time_slot2 = ServiceActualTimeSlot(id=2, service_id=1, starts=datetime(2023, 4, 22, 12, 0, 0))
        time_slot3 = ServiceActualTimeSlot(id=3, service_id=2, starts=datetime(2023, 4, 22, 14, 0, 0))
        data = [(order1, time_slot1, None), (order2, time_slot2, None), (order3, time_slot3, None)]

        # expected result
        expected = [
            {
                'order_id': order1.id,
                'name': order1.name,
                'phone': order1.phone,
                'email': order1.email,
                'status': order1.status.name,
                'comment': order1.comments,
                'time_slot_id': time_slot1.id,
                'service_id': time_slot1.service_id,
                'starts': time_slot1.starts.strftime("%A, %Y-%m-%d %H:%M:%S")
            },
            {
                'order_id': order2.id,
                'name': order2.name,
                'phone': order2.phone,
                'email': order2.email,
                'status': order2.status.name,
                'comment': order2.comments,
                'time_slot_id': time_slot2.id,
                'service_id': time_slot2.service_id,
                'starts': time_slot2.starts.strftime("%A, %Y-%m-%d %H:%M:%S")
            },
            {
                'order_id': order3.id,
                'name': order3.name,
                'phone': order3.phone,
                'email': order3.email,
                'status': order3.status.name,
                'comment': order3.comments,
                'time_slot_id': time_slot3.id,
                'service_id': time_slot3.service_id,
                'starts': time_slot3.starts.strftime("%A, %Y-%m-%d %H:%M:%S")
            },
        ]

        # call the function and compare with expected result
        result = self.query_converter.orders_with_time_to_json(data)
        self.assertEqual(result, json.dumps(expected))






