import json

class QueryConverter:
    def __init__(self):
        pass

    def user_to_json(self, user):
        if user is None:
            return json.dumps({})
        ret = {
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'bus_user': user.bus_user
        }
        if user.bus_user == True:
            ret['api_key'] = user.bus_api
        return json.dumps(ret)

    def service_with_weekly_time_slots_to_json(self, data):
        ret = {}
        for service, time_slot in data:
            if service.id not in ret:
                ret_service = {}
                ret_service['service_id'] = service.id
                ret_service['name'] = service.name
                ret_service['base_price'] = float(service.base_price) if service.base_price is not None else None
                ret_service['description'] = service.description
                ret_service['weekly_time_slots'] = []
                ret[service.id] = ret_service
            ret_time_slot = {}
            ret_time_slot['hour'] = time_slot.starts.hour
            ret_time_slot['minute'] = time_slot.starts.minute
            ret_time_slot['weekday'] = time_slot.starts.strftime("%A").lower()
            ret_time_slot['slots'] = time_slot.slots
            ret[service.id]['weekly_time_slots'].append(ret_time_slot)
        return json.dumps(ret)
    
    def actual_time_slots_to_json(self, time_slots):
        ret = {}
        for time_slot in time_slots:
            time = time_slot.starts.strftime("%A, %Y-%m-%d %H:%M:%S")
            if time not in ret:
                ret[time] = {}
                ret[time]['available_slots'] = 0
                ret[time]['time'] = time
                ret[time]['slot_ids'] = []
            ret[time]['available_slots'] += 1
            ret[time]['slot_ids'].append(time_slot.id)
        return json.dumps(ret)
    
    def orders_with_time_to_json(self, data):
        ret = []
        for order, time_slot, _ in data:
            ret.append({
                'order_id': order.id,
                'name': order.name,
                'phone': order.phone,
                'email': order.email,
                'status': order.status.name,
                'comment': order.comments,
                'time_slot_id': time_slot.id,
                'service_id': time_slot.service_id,
                'starts': time_slot.starts.strftime("%A, %Y-%m-%d %H:%M:%S")
            })
        return json.dumps(ret)
    
    def businesses_to_json(self, businesses):
        ret = []
        for business in businesses:
            business_ret = {
                'business_id': business.id,
                'name': business.name,
                'phone': business.phone,
                'address': business.address,
                'rating': float(business.rating) if business.rating is not None else None,
                'description': business.description,
                'category_id': business.category_id,
            }
            ret.append(business_ret)
        return json.dumps(ret)
    
    def services_to_json(self, services):
        ret = []
        for service in services:
            service_ret = {
                'service_id': service.id,
                'name': service.name,
                'description': service.description,
                'base_price': float(service.base_price) if service.base_price is not None else None,
                'bus_id': service.bus_id,
            }
            ret.append(service_ret)
        return json.dumps(ret)
    
    def orders_with_detail_to_json(self, data):
        ret = []
        for order, slot, service, business in data:
            order_ret = {
                'order_id': order.id,
                'user_id': order.user_id,
                'time_id': order.time_id,
                'name': order.name,
                'phone': order.phone,
                'email': order.email,
                'comments': order.comments,
                'status': order.status.name,
                'slot_id': slot.id,
                'starts': slot.starts.strftime('%A, %Y-%m-%d %H:%M:%S'),
                'service': {
                    'service_id': service.id,
                    'name': service.name,
                    'description': service.description,
                    'base_price': float(service.base_price) if service.base_price is not None else None,
                    'bus_id': service.bus_id,
                    'bus_name': business.name,
                    'bus_address': business.address,
                    'bus_phone': business.phone,
                }
            }
            ret.append(order_ret)
        return json.dumps(ret)
    
    def categories_to_json(self, categories):
        ret = []
        for category in categories:
            ret.append({
                'category_id': category.id,
                'name': category.name,
            })
        return json.dumps(ret)

    def bus_profile_to_json(self, bus, cat):
        ret = {
            'business_id': bus.id,
            'name': bus.name,
            'phone': bus.phone,
            'address': bus.address,
            'rating': float(bus.rating) if bus.rating is not None else None,
            'description': bus.description,
            'category': cat.name if cat is not None else None,
            'category_id': cat.id if cat is not None else None,
        }
        return json.dumps(ret)
    
    def personal_info_to_json(self, infos):
        ret = []
        for info in infos:
            ret.append({
                'info_id': info.id,
                'name': info.name,
                'phone': info.phone,
                'email': info.email,
            })
        return json.dumps(ret)

    '''
    Calender Converter
    '''

    def get_ordered_time_slots_by_date(self, time_slots):
        ret = {}
        ret["ordered_time_slots"] = time_slots

        return json.dumps(ret)



