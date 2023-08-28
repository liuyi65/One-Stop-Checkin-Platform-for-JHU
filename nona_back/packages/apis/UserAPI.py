from flask_cors import cross_origin
from ..models.UserModel import UserModel
from ..utils.QueryConverter import QueryConverter
from flask import request, send_file
from sqlalchemy import create_engine
from ..utils.GlobalSettings import GlobalSettings
from ..models.APIModelException import return_error
import sys


engine = create_engine("mysql+pymysql://nona:nona@" + GlobalSettings.host + ":3306/nona_db", echo=True)

model = UserModel(engine)
converter = QueryConverter()
@cross_origin(supports_credentials=True)
def get_businesses():
    print(request.remote_addr, file=sys.stderr)
    try:
        return converter.businesses_to_json(model.get_all_businesses())
    except Exception as e:
        return return_error(e)
        
@cross_origin(supports_credentials=True)
def get_services_by_business_id(business_id):
    print(request.remote_addr, file=sys.stderr)
    try:
        return converter.services_to_json(model.get_services(business_id))
    except Exception as e:
        return return_error(e)

@cross_origin(supports_credentials=True)
def get_available_time_slots(service_id):
    print(request.remote_addr, file=sys.stderr)
    try:
        args = request.args
        include_past = False
        if 'past' in args:
            include_past = args['past'] == 'true'
        time_slots = model.get_available_slots(service_id, include_past)
        return converter.actual_time_slots_to_json(time_slots)
    except Exception as e:
        return return_error(e)

@cross_origin(supports_credentials=True)
def get_order_by_user():
    print(request.remote_addr, file=sys.stderr)
    try:
        args = request.args
        include_past = False
        if 'past' in args:
            include_past = args['past'] == 'true'
        request_data = request.get_json()
        token = request_data['token']    
        return converter.orders_with_detail_to_json(model.get_order_history_with_details(token, include_past))
    except Exception as e:
        return return_error(e)

@cross_origin(supports_credentials=True)
def create_order():
    print(request.remote_addr, file=sys.stderr)
    try:
        request_data = request.get_json()
        token = request_data['token']
        slot_id = request_data['slot_id']
        name = request_data['name']
        phone = request_data['phone']
        email = request_data['email']
        comments = request_data['comments']
        model.create_order(token, slot_id, name, phone, email, comments)
    except Exception as e:
        return return_error(e)
    return "Order created", 200

@cross_origin(supports_credentials=True)
def cancel_order():
    print(request.remote_addr, file=sys.stderr)
    try:
        request_data = request.get_json()
        token = request_data['token']
        order_id = request_data['order_id']
        model.cancel_order(token, order_id)
    except Exception as e:
        return return_error(e)
    return "Order canceled", 200

@cross_origin(supports_credentials=True)
def create_user():
    print(request.remote_addr, file=sys.stderr)
    try:
        request_data = request.get_json()
        token = request_data['token']
        model.create_user(token)
    except Exception as e:
        return return_error(e)
    return "User created", 200

@cross_origin(supports_credentials=True)
def get_all_categories():
    print(request.remote_addr, file=sys.stderr)
    try:
        categories = model.get_all_categories()
        return converter.categories_to_json(categories)
    except Exception as e:
        return return_error(e)
    
@cross_origin(supports_credentials=True)
def get_all_personal_info():
    print(request.remote_addr, file=sys.stderr)
    try:
        request_data = request.get_json()
        token = request_data['token']
        infos = model.get_all_personal_info(token)
        return converter.personal_info_to_json(infos)
    except Exception as e:
        return return_error(e)
    
@cross_origin(supports_credentials=True)
def create_personal_info():
    print(request.remote_addr, file=sys.stderr)
    try:
        request_data = request.get_json()
        token = request_data['token']
        name = request_data['name']
        email = request_data['email']
        phone = request_data['phone']
        model.create_personal_info(token, name, email, phone)
    except Exception as e:
        return return_error(e)
    return "Personal info created", 200

@cross_origin(supports_credentials=True)
def update_personal_info():
    print(request.remote_addr, file=sys.stderr)
    try:
        request_data = request.get_json()
        token = request_data['token']
        info_id = request_data['info_id']
        name = request_data['name']
        email = request_data['email']
        phone = request_data['phone']
        model.update_personal_info(token, info_id, name, email, phone)
    except Exception as e:
        return return_error(e)
    return "Personal info updated", 200

@cross_origin(supports_credentials=True)
def delete_personal_info():
    print(request.remote_addr, file=sys.stderr)
    try:
        request_data = request.get_json()
        token = request_data['token']
        info_id = request_data['info_id']
        model.delete_personal_info(token, info_id)
    except Exception as e:
        return return_error(e)
    return "Personal info deleted", 200

@cross_origin(supports_credentials=True)
def get_category_image(cat_id):
    print(request.remote_addr, file=sys.stderr)
    try:
        return send_file(model.get_category_image_url(cat_id))
    except Exception as e:
        return return_error(e)
    
@cross_origin(supports_credentials=True)
def get_service_image(service_id):
    print(request.remote_addr, file=sys.stderr)
    try:
        return send_file(model.get_service_image_url(service_id))
    except Exception as e:
        return return_error(e)
    
@cross_origin(supports_credentials=True)
def get_business_image(business_id):
    print(request.remote_addr, file=sys.stderr)
    try:
        return send_file(model.get_business_image_url(business_id))
    except Exception as e:
        return return_error(e)
    
@cross_origin(supports_credentials=True)
def send_chat():
    try:
        request_data = request.get_json()
        token = request_data['token']
        message = request_data['message']
        ret = model.send_chat_message(token, message)
    except Exception as e:
        return return_error(e)
    return ret, 200

@cross_origin(supports_credentials=True)
def check_in():
    try:
        request_data = request.get_json()
        token = request_data['token']
        order_id = request_data['order_id']
        model.check_in(token, order_id)
    except Exception as e:
        return return_error(e)
    return "Checked in", 200

def user_api_register(app):
    app.add_url_rule('/api/businesses', 'get_businesses', get_businesses, methods=['GET'])
    app.add_url_rule('/api/businesses/<int:business_id>/services', 'get_services_by_business_id', get_services_by_business_id, methods=['GET'])
    app.add_url_rule('/api/services/<int:service_id>/available_time_slots', 'get_available_time_slots', get_available_time_slots, methods=['GET'])
    app.add_url_rule('/api/orders', 'get_order_by_user', get_order_by_user, methods=['POST'])
    app.add_url_rule('/api/orders', 'create_order', create_order, methods=['PUT'])
    app.add_url_rule('/api/orders', 'cancel_order', cancel_order, methods=['DELETE'])
    app.add_url_rule('/api/users', 'create_user', create_user, methods=['PUT'])
    app.add_url_rule('/api/categories', 'get_all_categories', get_all_categories, methods=['GET'])
    app.add_url_rule('/api/all_personal_info', 'get_all_personal_info', get_all_personal_info, methods=['POST'])
    app.add_url_rule('/api/personal_info', 'create_personal_info', create_personal_info, methods=['PUT'])
    app.add_url_rule('/api/personal_info', 'update_personal_info', update_personal_info, methods=['POST'])
    app.add_url_rule('/api/personal_info', 'delete_personal_info', delete_personal_info, methods=['DELETE'])
    app.add_url_rule('/file/image/categories/<int:cat_id>', 'get_category_image', get_category_image, methods=['GET'])
    app.add_url_rule('/file/image/services/<int:service_id>', 'get_service_image', get_service_image, methods=['GET'])
    app.add_url_rule('/file/image/businesses/<int:business_id>', 'get_business_image', get_business_image, methods=['GET'])
    app.add_url_rule('/api/chat', 'send_chat', send_chat, methods=['POST'])
    app.add_url_rule('/api/checkin', 'checkin', check_in, methods=['POST'])
