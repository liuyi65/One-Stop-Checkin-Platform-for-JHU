from flask_cors import cross_origin
from ..models.BusinessModel import BusinessModel
from ..utils.QueryConverter import QueryConverter
from flask import request
from sqlalchemy import create_engine
from ..utils.GlobalSettings import GlobalSettings
from ..models.APIModelException import APIModelException, return_error
import sys

# engine = create_engine("mysql+pymysql://nona:nona@" + GlobalSettings.host + ":3306/nona_db", echo=True)
#
# model = BusinessModel(engine)
# converter = QueryConverter()


@cross_origin(supports_credentials=True)
def get_bus_user_from_api_key(api_key):
    print(request.remote_addr, file=sys.stderr)
    try:
        return converter.user_to_json(model.get_business_user(api_key))
    except Exception as e:
        return return_error(e)


@cross_origin(supports_credentials=True)
def get_api_key_from_bus_user():
    print(request.remote_addr, file=sys.stderr)
    try:
        request_data = request.get_json()
        token = request_data['token']
        return model.get_api_key_from_user(token)
    except Exception as e:
        return return_error(e)


@cross_origin(supports_credentials=True)
def get_services_with_time_slots(api_key):
    print(request.remote_addr, file=sys.stderr)
    try:
        services = model.get_all_services_with_time_slots(api_key)
        return converter.service_with_weekly_time_slots_to_json(services)
    except Exception as e:
        return return_error(e)


@cross_origin(supports_credentials=True)
def get_all_time_slots(api_key, service_id):
    print(request.remote_addr, file=sys.stderr)
    try:
        args = request.args
        include_past = False
        if 'past' in args:
            include_past = args['past'] == 'true'
        time_slots = model.get_actual_time_slots(api_key, service_id, include_past)
        return converter.actual_time_slots_to_json(time_slots)
    except Exception as e:
        return return_error(e)


@cross_origin(supports_credentials=True)
def get_available_time_slots(api_key, service_id):
    print(request.remote_addr, file=sys.stderr)
    try:
        args = request.args
        include_past = False
        if 'past' in args:
            include_past = args['past'] == 'true'
        time_slots = model.get_available_time_slots(api_key, service_id, include_past)
        return converter.actual_time_slots_to_json(time_slots)
    except Exception as e:
        return return_error(e)


@cross_origin(supports_credentials=True)
def get_orders_with_time_slots(api_key, service_id):
    print(request.remote_addr, file=sys.stderr)
    try:
        args = request.args
        include_past = False
        if 'past' in args:
            include_past = args['past'] == 'true'
        orders = model.get_orders(api_key, service_id, include_past)
        return converter.orders_with_time_to_json(orders)
    except Exception as e:
        return return_error(e)
    
@cross_origin(supports_credentials=True)
def get_orders(api_key):
    print(request.remote_addr, file=sys.stderr)
    try:
        args = request.args
        include_past = False
        if 'past' in args:
            include_past = args['past'] == 'true'
        orders = model.get_all_orders(api_key, include_past)
        return converter.orders_with_time_to_json(orders)
    except Exception as e:
        return return_error(e)



@cross_origin(supports_credentials=True)
def create_bus_user():
    print(request.remote_addr, file=sys.stderr)
    try:
        request_data = request.get_json()
        token = request_data['token']
        business_name = request_data['business_name']
        admin_api = request_data['admin_api']
        return model.create_business(token, admin_api, business_name)
    except Exception as e:
        return return_error(e)


@cross_origin(supports_credentials=True)
def create_service():
    print(request.remote_addr, file=sys.stderr)
    try:
        request_data = request.get_json()
        api_key = request_data['api_key']
        service_name = request_data['service_name']
        service_description = request_data['service_description']
        service_price = request_data['service_price']
        service_time = request_data['service_time']

        # Check available service time
        if len(service_time) == 0:
            raise APIModelException('Service time is empty', 400)
        for time in service_time:
            if time.keys() != {'weekday', 'hour', 'minute', 'slots'}:
                raise APIModelException('Service time key is not valid', 400)
            if time['weekday'].lower() not in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']:
                raise APIModelException('Service weekday is not valid', 400)
            if time['hour'] < 0 or time['hour'] > 23:
                raise APIModelException('Service hour is not valid', 400)
            if time['minute'] < 0 or time['minute'] > 59:
                raise APIModelException('Service minute is not valid', 400)
            if time['slots'] < 0:
                raise APIModelException('Service slots is not valid', 400)

        model.create_service(api_key, service_name, service_price, service_description, service_time)
    except Exception as e:
        return return_error(e)
    return 'Service created', 200


@cross_origin(supports_credentials=True)
def make_future_time_slots_available():
    print(request.remote_addr, file=sys.stderr)
    try:
        request_data = request.get_json()
        api_key = request_data['api_key']
        weeks_ahead = request_data['weeks_ahead']
        model.refresh_actual_time_slots(api_key, weeks_ahead)
    except Exception as e:
        return return_error(e)
    return 'Time slots refreshed', 200


@cross_origin(supports_credentials=True)
def update_order_status():
    print(request.remote_addr, file=sys.stderr)
    try:
        request_data = request.get_json()
        api_key = request_data['api_key']
        order_id = request_data['order_id']
        status = request_data['status']
        model.update_status(api_key, order_id, status)
    except Exception as e:
        return return_error(e)
    return 'Order status updated', 200

@cross_origin(supports_credentials=True)
def create_category():
    print(request.remote_addr, file=sys.stderr)
    try:
        request_data = request.get_json()
        api_key = request_data['admin_api']
        category_name = request_data['category_name']
        model.create_category(api_key, category_name)
    except Exception as e:
        return return_error(e)
    return 'Category created', 200

@cross_origin(supports_credentials=True)
def modify_category():
    print(request.remote_addr, file=sys.stderr)
    try:
        request_data = request.get_json()
        api_key = request_data['admin_api']
        category_id = request_data['category_id']
        category_name = request_data['category_name']
        model.modify_category(api_key, category_id, category_name)
    except Exception as e:
        return return_error(e)
    return 'Category modified', 200

@cross_origin(supports_credentials=True)
def delete_category():
    print(request.remote_addr, file=sys.stderr)
    try:
        request_data = request.get_json()
        api_key = request_data['admin_api']
        category_id = request_data['category_id']
        model.delete_category(api_key, category_id)
    except Exception as e:
        return return_error(e)
    return 'Category deleted', 200
    
@cross_origin(supports_credentials=True)
def set_bus_category():
    print(request.remote_addr, file=sys.stderr)
    try:
        request_data = request.get_json()
        api_key = request_data['api_key']
        category_id = request_data['category_id']
        model.set_category(api_key, category_id)
    except Exception as e:
        return return_error(e)
    return 'Category set', 200

@cross_origin(supports_credentials=True)
def get_bus_profile(api_key):
    print(request.remote_addr, file=sys.stderr)
    try:
        bus, cat = model.get_business_profile(api_key)
        return converter.bus_profile_to_json(bus, cat)
    except Exception as e:
        return return_error(e)

@cross_origin(supports_credentials=True)
def set_bus_image():
    print(request.remote_addr, file=sys.stderr)
    try:
        image = request.files['image']
        api_key = request.form['api_key']
        model.set_business_image(api_key, image)
    except Exception as e:
        return return_error(e)
    return 'Image set', 200

@cross_origin(supports_credentials=True)
def set_category_image():
    print(request.remote_addr, file=sys.stderr)
    try:
        image = request.files['image']
        api_key = request.form['admin_api']
        category_id = request.form['category_id']
        model.set_cetegory_image(api_key, category_id, image)
    except Exception as e:
        return return_error(e)
    return 'Image set', 200

@cross_origin(supports_credentials=True)
def set_service_image():
    print(request.remote_addr, file=sys.stderr)
    try:
        image = request.files['image']
        api_key = request.form['api_key']
        service_id = request.form['service_id']
        model.set_service_image(api_key, service_id, image)
    except Exception as e:
        return return_error(e)
    return 'Image set', 200

@cross_origin(supports_credentials=True)
def update_business():
    print(request.remote_addr, file=sys.stderr)
    try:
        request_data = request.get_json()
        api_key = request_data['api_key']
        business_name = request_data['name'] if 'name' in request_data else None
        business_address = request_data['address'] if 'address' in request_data else None
        business_phone = request_data['phone'] if 'phone' in request_data else None
        business_description = request_data['description'] if 'description' in request_data else None
        model.update_bus_info(api_key, business_name, business_address, business_phone, business_description)
    except Exception as e:
        return return_error(e)
    return 'Business updated', 200

@cross_origin(supports_credentials=True)
def update_service():
    print(request.remote_addr, file=sys.stderr)
    try:
        request_data = request.get_json()
        api_key = request_data['api_key']
        service_id = request_data['service_id']
        service_name = request_data['name'] if 'name' in request_data else None
        service_description = request_data['description'] if 'description' in request_data else None
        service_price = request_data['base_price'] if 'base_price' in request_data else None
        model.update_service_info(api_key, service_id, service_name, service_price, service_description)
    except Exception as e:
        return return_error(e)
    return 'Service updated', 200

@cross_origin(supports_credentials=True)
def get_ordered_time_slots_by_date(api_key, service_id):
    print(request.remote_addr, file=sys.stderr)
    try:
        request_data = request.get_json()
        date_string = request_data['date']
        time_slots = model.get_ordered_time_slots_by_date(api_key, service_id, date_string)
        return converter.get_ordered_time_slots_by_date(time_slots)
    except Exception as e:
        return return_error(e)



def bus_api_register(app, mock_model=None):
    global converter, model
    model = mock_model if mock_model else BusinessModel(create_engine("mysql+pymysql://nona:nona@" + GlobalSettings.host + ":3306/nona_db", echo=True))
    converter = QueryConverter()
    app.add_url_rule('/api/bus/<api_key>/bus_user', 'get_bus_user_from_api_key', get_bus_user_from_api_key, methods=['GET'])
    app.add_url_rule('/api/bus/api_key', 'get_api_key_from_bus_user', get_api_key_from_bus_user, methods=['POST'])
    app.add_url_rule('/api/bus/<api_key>/services', 'get_services_with_time_slots', get_services_with_time_slots, methods=['GET'])
    app.add_url_rule('/api/bus/<api_key>/<service_id>/all_time_slots', 'get_all_time_slots', get_all_time_slots, methods=['GET'])
    app.add_url_rule('/api/bus/<api_key>/<service_id>/available_time_slots', 'get_available_time_slots_bus', get_available_time_slots, methods=['GET'])
    app.add_url_rule('/api/bus/<api_key>/<service_id>/orders', 'get_orders_by_service', get_orders_with_time_slots, methods=['GET'])
    app.add_url_rule('/api/bus/<api_key>/orders', 'get_orders', get_orders, methods=['GET'])
    app.add_url_rule('/api/admin/bus_user', 'create_bus_user', create_bus_user, methods=['PUT'])
    app.add_url_rule('/api/bus/service', 'create_service', create_service, methods=['PUT'])
    app.add_url_rule('/api/bus/create_future_time_slots', 'make_future_time_slots_available', make_future_time_slots_available, methods=['POST'])
    app.add_url_rule('/api/bus/order_status', 'update_order_status', update_order_status, methods=['POST'])
    app.add_url_rule('/api/bus/<api_key>/<service_id>/show_calender', 'get_ordered_time_slots_by_date', get_ordered_time_slots_by_date, methods=['post'])
    app.add_url_rule('/api/admin/category', 'create_category', create_category, methods=['PUT'])
    app.add_url_rule('/api/admin/category', 'modify_category', modify_category, methods=['POST'])
    app.add_url_rule('/api/admin/category', 'delete_category', delete_category, methods=['DELETE'])
    app.add_url_rule('/api/bus/set_category', 'set_bus_category', set_bus_category, methods=['POST'])
    app.add_url_rule('/api/bus/<api_key>/profile', 'get_bus_profile', get_bus_profile, methods=['GET'])
    app.add_url_rule('/api/admin/category/image', 'set_category_image', set_category_image, methods=['POST'])
    app.add_url_rule('/api/bus/image', 'set_bus_image', set_bus_image, methods=['POST'])
    app.add_url_rule('/api/bus/service/image', 'set_service_image', set_service_image, methods=['POST'])
    app.add_url_rule('/api/bus', 'update_business', update_business, methods=['POST'])
    app.add_url_rule('/api/bus/service', 'update_service', update_service, methods=['POST'])
    

