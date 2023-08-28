//
//  Order.swift
//  NoNa
//
//  Created by WYL on 2023/4/6.
//

import Foundation
import CoreLocation

struct Order: Identifiable, Decodable{
    var id: Int{
        get {orderID}
    }
    
    struct Service: Decodable {
        var serviceID: Int
        var serviceName: String
        var serviceDescription: String?
        var basePrice: Float?
        var busID: Int
        var busName: String
        var busAddress: String?
        var busPhone: String?
        
        enum CodingKeys: String, CodingKey {
            case serviceID = "service_id"
            case serviceName = "name"
            case serviceDescription = "description"
            case basePrice = "base_price"
            case busID = "bus_id"
            case busName = "bus_name"
            case busAddress = "bus_address"
            case busPhone = "bus_phone"
        }
        
        
//
//        init(from decoder: Decoder) throws {
//            let container: KeyedDecodingContainer<Order.Service.CodingKeys> = try decoder.container(keyedBy: Order.Service.CodingKeys.self)
//            self.serviceID = try container.decode(Int.self, forKey: Order.Service.CodingKeys.serviceID)
//            self.serviceName = try container.decode(String.self, forKey: Order.Service.CodingKeys.serviceName)
//            self.serviceDescription = try container.decodeIfPresent(String.self, forKey: Order.Service.CodingKeys.serviceDescription)
//            self.basePrice = try container.decode(String.self, forKey: Order.Service.CodingKeys.basePrice)
//            self.busID = try container.decode(Int.self, forKey: Order.Service.CodingKeys.busID)
//            self.busName = try container.decode(String.self, forKey: Order.Service.CodingKeys.busName)
//            self.busAddress = try container.decode(String.self, forKey: Order.Service.CodingKeys.busAddress)
//        }
    }
    var orderID: Int
    var userID: Int
    var timeID: Int
    var customerName: String
    var phoneNumber: String
    var bookerEmail: String
    var comments: String?
    var status: String
    var slotID: Int
    var starts: Date
    var service: Order.Service
    var date: Date {
        get {Calendar.current.date(bySettingHour: 0, minute: 0, second: 0, of: self.starts)!}
    }
    
    enum CodingKeys: String, CodingKey{
        case orderID = "order_id"
        case userID = "user_id"
        case timeID = "time_id"
        case customerName = "name"
        case phoneNumber = "phone"
        case bookerEmail = "email"
        case comments = "comments"
        case status = "status"
        case slotID = "slot_id"
        case starts = "starts"
        case service = "service"
    }
    
    init(orderID: Int, userID: Int, timeID: Int, customerName: String, phoneNumber: String, bookerEmail: String, comments: String? = nil, status: String, slotID: Int, starts: Date, serviceID: Int, serviceName: String, serviceDescription: String? = nil, basePrice: Float, busID: Int, busName: String, busAddress: String?) {
        self.orderID = orderID
        self.userID = userID
        self.timeID = timeID
        self.customerName = customerName
        self.phoneNumber = phoneNumber
        self.bookerEmail = bookerEmail
        self.comments = comments
        self.status = status
        self.slotID = slotID
        self.starts = starts
        self.service = Order.Service(serviceID: serviceID, serviceName: serviceName, basePrice: basePrice, busID: busID, busName: busName, busAddress: busAddress)
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        self.service = try container.decode(Order.Service.self, forKey: .service)
        orderID = try container.decode(Int.self, forKey: .orderID)
        userID = try container.decode(Int.self, forKey: .userID)
        timeID = try container.decode(Int.self, forKey: .timeID)
        customerName = try container.decode(String.self, forKey: .customerName)
        phoneNumber = try container.decode(String.self, forKey: .phoneNumber)
        bookerEmail = try container.decode(String.self, forKey: .bookerEmail)
        comments = try container.decode(String?.self, forKey: .comments)
        status = try container.decode(String.self, forKey: .status)
        slotID = try container.decode(Int.self, forKey: .slotID)
        let startsString = try container.decode(String.self, forKey: .starts)
        starts = FormatFactory.instance.jsonDateFormatter.date(from: startsString)!
    }
    
    func getLocation(callback: @escaping (CLLocationCoordinate2D) -> Void) {
        if(service.busAddress != nil){
            let geoCoder = CLGeocoder()
            geoCoder.geocodeAddressString(service.busAddress!) { placemarks, error in
                guard let placemarks = placemarks,
                      let location = placemarks.first?.location?.coordinate
                else {
                    return
                }
                callback(location)
            }
        }
    }
}
