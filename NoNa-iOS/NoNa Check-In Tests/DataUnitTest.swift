//
//  DataUnitTest.swift
//  DataUnitTest
//
//  Created by Haoping Yu on 2023-03-17.
//

import XCTest
@testable import NoNa_Check_In

class MockURLProtocol: URLProtocol {
    static var requestHandler: ((URLRequest) throws -> (HTTPURLResponse, Data))?

    override class func canInit(with request: URLRequest) -> Bool {
        return true
    }

    override class func canonicalRequest(for request: URLRequest) -> URLRequest {
        return request
    }

    override func startLoading() {
        guard let handler = MockURLProtocol.requestHandler else {
            XCTFail("Received unexpected request with no handler set")
            return
        }
        do {
            let (response, data) = try handler(request)
            
            client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
            client?.urlProtocol(self, didLoad: data)
            client?.urlProtocolDidFinishLoading(self)
        } catch {
            client?.urlProtocol(self, didFailWithError: error)
        }
    }

    override func stopLoading() {
    }
}

final class DataUnitTest: XCTestCase {
    
    let busMockData = """
[{"business_id": 1, "name": "test1", "address": "0000 test rd", "rating": 3.2, "description": "This is a desc"}, {"business_id": 2, "name": "test2", "address": null, "rating": null, "description": null}]
"""
    let serviceMockData = """
[{"service_id": 1,"name": "flask_service","description": "Description","base_price": 50.66,"bus_id": 1}]
"""
    let timeMockData = """
{"Wednesday, 2023-03-29 13:00:00": {"available_slots": 5, "time": "Wednesday, 2023-03-29 13:00:00", "slot_ids": [6, 7,
8, 9, 10]}, "Monday, 2023-03-27 17:00:00": {"available_slots": 2, "time": "Monday, 2023-03-27 17:00:00", "slot_ids":
[15, 16]}}
"""
    let orderHistoryMockData = """
[{"order_id": 1, "user_id": 2, "time_id": 1, "name": "Book name", "phone":"22222", "email": "email@exma", "comments": "commentsss", "status": "Confirmed", "slot_id": 1, "starts": "Wednesday, 2023-03-15 13:00:00", "service": {"service_id": 1, "name": "flask_service", "description": "Description", "base_price": 50.66, "bus_id": 1, "bus_name": "test_buss_from_flask", "bus_address": null}}]
"""
    let allPersonInfoMockData = """
[{"info_id": 10001, "name": "customer_name", "phone": "2233-4433-2345", "email": "example@example.com"}]
"""
    


    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
        let config = URLSessionConfiguration.ephemeral
        config.protocolClasses = [MockURLProtocol.self]
        DataManager.instance.setTest(urlConfig: config)


    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func testBusinessData() throws {
        MockURLProtocol.requestHandler = { request in
            return (HTTPURLResponse(), self.busMockData.data(using: .utf8)!)
        }
        let result = [Business(busID: 1, name: "test1", address: "0000 test rd", rating: 3.2, desc: "This is a desc"), Business(busID: 2, name: "test2", address: nil, rating: nil, desc: nil)]

        _ = DataManager.instance.getBusinesses{businesses in
            XCTAssertEqual(businesses.count, 2)
            businesses.enumerated().forEach{index, element in
                let resultBus = result[index]
                XCTAssertEqual(element.id, resultBus.id)
                XCTAssertEqual(element.name, resultBus.name)
                XCTAssertEqual(element.address, resultBus.address)
                XCTAssertEqual(element.busID, resultBus.busID)
                XCTAssertEqual(element.desc, resultBus.desc)
                XCTAssertEqual(element.rating, resultBus.rating)
            }
        }

    }

    func testServiceData() throws {
        var target = ""
        MockURLProtocol.requestHandler = { request in
            target = request.url!.absoluteString
            return (HTTPURLResponse(), self.serviceMockData.data(using: .utf8)!)
        }
        let result = Service(service_id: 1, name: "flask_service", description: "Description", base_price: 50.66)
        _ = DataManager.instance.getServiceByBusID(id: 1){services in
            XCTAssertEqual(services.count, 1)
            let service = services[0]
            XCTAssertEqual(service.id, result.id)
            XCTAssertEqual(service.name, result.name)
            XCTAssertEqual(service.desc, result.desc)
            XCTAssertEqual(service.price, result.price)
            XCTAssertEqual(service.serviceID, result.serviceID)
            XCTAssertEqual(target, "http://api.magicspica.com/api/businesses/1/services")
        }
        

    }
    
    func testTimeSlot() throws {
        var target = ""
        MockURLProtocol.requestHandler = { request in
            target = request.url!.absoluteString
            return (HTTPURLResponse(), self.timeMockData.data(using: .utf8)!)
        }
        
        let result = AvailableTime(time: Date(timeIntervalSinceReferenceDate: 701643600), slotIDs: [15,16])
        _ = DataManager.instance.getAvailableTimesByServiceId(id: 1){ slots in
            let slots = slots.sorted{$0.originalTime < $1.originalTime}
            XCTAssertEqual(slots.count, 2)
            let slot = slots[0]
            XCTAssertEqual(slot.date, result.date)
            XCTAssertEqual(slot.id, result.id)
            XCTAssertEqual(slot.slotIDs, result.slotIDs)
            XCTAssertEqual(slot.originalTime, result.originalTime)
            XCTAssertEqual(target, "http://api.magicspica.com/api/services/1/available_time_slots")
            XCTAssertTrue(slot.isSameDay(result))
        }
        
    }
    
    func testPlaceOrder() throws {
        var target = ""
        MockURLProtocol.requestHandler = { request in
            target = request.url!.absoluteString
            return (HTTPURLResponse(), "Order created".data(using: .utf8)!)
        }
    
        _ = DataManager.instance.placeOrder(token: "test_token", slot_id: 1, name: "name", phone: "000-000-0000", email: "test@example.com", comments: "comments"){ success, result in
            XCTAssertTrue(success)
            XCTAssertEqual(result, "Order created")
            XCTAssertEqual(target, "http://api.magicspica.com/api/orders")
        }
        
    }
    
    func testPlaceOrderFailed() throws {
        var target = ""
        MockURLProtocol.requestHandler = { request in
            target = request.url!.absoluteString
            let response = HTTPURLResponse(url: URL(string: "localhost")!, statusCode: 401, httpVersion: nil, headerFields: [:])
            return (response!, "Invalid token".data(using: .utf8)!)
        }
        _ = DataManager.instance.placeOrder(token: "test_token", slot_id: 1, name: "name", phone: "000-000-0000", email: "test@example.com", comments: "comments"){ success, result in
            XCTAssertFalse(success)
            XCTAssertEqual(result, "Invalid token")
            XCTAssertEqual(target, "http://api.magicspica.com/api/orders")
        }
    }
    
    func testCreateUser() throws {
        var target = ""
        MockURLProtocol.requestHandler = { request in
            target = request.url!.absoluteString
            return (HTTPURLResponse(), "User created".data(using: .utf8)!)
        }
        _ = DataManager.instance.createUser(token: "token"){ success, result in
            XCTAssertTrue(success)
            XCTAssertEqual(result, "User created")
            XCTAssertEqual(target, "http://api.magicspica.com/api/users")
        }
        
    }
    
    func testCreatePersonalInfo() throws{
        var target = ""
        MockURLProtocol.requestHandler = { request in
            target = request.url!.absoluteString
            return (HTTPURLResponse(), "Personal info created".data(using: .utf8)!)
        }
        _ = DataManager.instance.createPersonalInfo(token: "token", name: "WYL", email: "WYL@qq.com", phone: "820-800-0000"){ result in
            XCTAssertEqual(result, "Personal info created")
            XCTAssertEqual(target, "http://api.magicspica.com/api/personal_info")
        }
    }
    
    func testModifyPersonalInfo() throws{
        var target = ""
        MockURLProtocol.requestHandler = { request in
            target = request.url!.absoluteString
            return (HTTPURLResponse(), "Personal info updated".data(using: .utf8)!)
        }
        _ = DataManager.instance.modifyPersonInfo(token: "token", infID: 1, name: "WYL", email: "WYL@qq.com", phone: "820-800-0000"){ result in
            XCTAssertEqual(result, "Personal info updated")
            XCTAssertEqual(target, "http://api.magicspica.com/api/personal_info")
        }
    }
    
    func testGetOrderHistory() throws{
        MockURLProtocol.requestHandler = { request in
            return (HTTPURLResponse(), self.orderHistoryMockData.data(using: .utf8)!)
        }
        
        let data = self.orderHistoryMockData.data(using: .utf8)!
        
        let result2 = try JSONDecoder().decode([Order].self, from: data)
        
        let result = Order(orderID: 1, userID: 2, timeID: 1, customerName: "Book name", phoneNumber: "22222", bookerEmail: "email@exma", status: "Confirmed", slotID: 1, starts: Date(timeIntervalSinceReferenceDate: 701643600), serviceID: 1, serviceName: "flask_service", basePrice: 50.66, busID: 1, busName: "test_buss_from_flask", busAddress: nil)
        result2.enumerated().forEach{index, element in
            XCTAssertEqual(result.orderID, element.orderID)
            XCTAssertEqual(result.userID, element.userID)
        }
        _ = DataManager.instance.getOrderHistory(token: "test", past: true){ orderHistory in
            orderHistory.enumerated().forEach{index, element in
                XCTAssertEqual(result.orderID, element.orderID)
                XCTAssertEqual(result.userID, element.userID)
            }
            
        }
    }
    
    func testGetAllPerson() throws{
        MockURLProtocol.requestHandler = { request in
            return (HTTPURLResponse(), self.allPersonInfoMockData.data(using: .utf8)!)
        }
        let result = [PersonalInformation(infoID: 10001, name: "customer_name", phone: "2233-4433-2345", email: "example@example.com")]

        _ = DataManager.instance.getAllPerson(token: "test"){businesses in
            businesses.enumerated().forEach{index, element in
                let resultBus = result[index]
                XCTAssertEqual(element.infoID, resultBus.infoID)
                XCTAssertEqual(element.name, resultBus.name)
                XCTAssertEqual(element.phone, resultBus.phone)
                XCTAssertEqual(element.email, resultBus.email)
            }
        }
    }
    
    func testCallChatBot() throws{
        var target = ""
        MockURLProtocol.requestHandler = { request in
            target = request.url!.absoluteString
            return (HTTPURLResponse(),
                    """
                    Yes, it seems that you missed an appointment. The appointment details are as follows:
                    
                    Order at: 2023-04-21 19:30:00
                    Status: OrderStatus.Missed
                    Business: Test Business Name
                    Service: haircut47
                    Service description: this is a test for api at april 7th
                    Customer Comments:
                    Booked name: customer
                    Booked phone: 000000000000
                    Booked email: email@example.com

                    Please make sure to keep track of your appointments and arrive on time for any future appointments. Let me know if you have any other questions or concerns.
""".data(using: .utf8)!)
        }
        _ = DataManager.instance.callChatBot(token: "token", message: "Do I missed any appointments?"){ result in
            XCTAssertEqual(result, """
                    Yes, it seems that you missed an appointment. The appointment details are as follows:
                    
                    Order at: 2023-04-21 19:30:00
                    Status: OrderStatus.Missed
                    Business: Test Business Name
                    Service: haircut47
                    Service description: this is a test for api at april 7th
                    Customer Comments:
                    Booked name: customer
                    Booked phone: 000000000000
                    Booked email: email@example.com

                    Please make sure to keep track of your appointments and arrive on time for any future appointments. Let me know if you have any other questions or concerns.
""")
            XCTAssertEqual(target, "http://api.magicspica.com/api/chat")
        }
    }
    
}
