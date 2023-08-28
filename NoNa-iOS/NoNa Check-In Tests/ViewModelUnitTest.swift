//
//  ViewModelUnitTest.swift
//  NoNa Check-In Tests
//
//  Created by Haoping Yu on 2023-03-18.
//

import XCTest
@testable import NoNa_Check_In



final class ViewModelUnitTest: XCTestCase {

    let timeMockData = """
{"Wednesday, 2023-03-29 13:00:00": {"available_slots": 5, "time": "Wednesday, 2023-03-29 13:00:00", "slot_ids": [6, 7,
8, 9, 10]}, "Monday, 2023-03-27 17:00:00": {"available_slots": 2, "time": "Monday, 2023-03-27 17:00:00", "slot_ids":
[15, 16]}}
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

    @MainActor func testBusinessListVM() throws {
        let vm = BusinessListViewModel(isDemo: true)
        XCTAssertEqual(vm.businesses[0].name, "Test1")
    }
    
    @MainActor func testBusinessDetailVM() throws {
        let vm = BusinessDetailViewModel(business: Business(busID: 1, name: "test", address: nil, rating: nil, desc: nil), isDemo: true)
//        vm.onLoad()
        XCTAssertNotNil(vm.getNearestAvailable(service: vm.services[0]))
        XCTAssertEqual(vm.timeSlots[1]![0].slotIDs, [1,2,3])
        XCTAssertNil(vm.getNearestAvailable(service: Service(service_id: -1, name: "", description: nil, base_price: nil)))
    }
    
    @MainActor func testAppointmentVM() throws {
        MockURLProtocol.requestHandler = { request in
            return (HTTPURLResponse(), self.timeMockData.data(using: .utf8)!)
        }
        let vm = AppointmentViewModel()
        XCTAssertEqual(vm.service.name, "Test Service")
        vm.onLoad()
        
        let vm2 = AppointmentViewModel(service: Service(service_id: 1, name: "a", description: nil, base_price: nil), business: Business(busID: 1, name: "b", address: nil, rating: nil, desc: nil))
        vm2.onLoad()
        
        
    }
    
    @MainActor func testOrderPlaceVM() throws {
        let vm = OrderPlaceViewModel()
//        vm.placeOrder()
        
        XCTAssertEqual(vm.service.name, "service name")
        let vm2 = OrderPlaceViewModel(business: Business(busID: 1, name: "1", address: nil, rating: nil, desc: nil), service: Service(service_id: 1, name: "b", description: nil, base_price: nil), time: nil)
        XCTAssertEqual(vm2.service.name, "b")
    }
    
    
    @MainActor func testCheckInVM() throws{
        let vm =  CheckInViewModel(isDemo: true)
//        vm.checkIn()
        XCTAssertEqual(vm.order.orderID, 1)
        XCTAssertEqual(vm.order.userID, 1)
        XCTAssertEqual(vm.order.timeID, 1)
        XCTAssertEqual(vm.order.customerName, "CusName")
        XCTAssertEqual(vm.order.phoneNumber, "111")
        XCTAssertEqual(vm.order.bookerEmail, "E@E")
        XCTAssertEqual(vm.order.status, "Ready")
    }
    
    @MainActor func testChatVM() throws{
        let vm = ChatViewModel(isDemo: true)
//        vm.sendMessage(message: "asd")
        XCTAssertEqual(vm.chatList[0].message, "asd")
        XCTAssertEqual(vm.chatList[1].message, "Hello, test run Hi there, this is a demo testsssss Hi there, this is a demo testsssssHi there, this is a demo testsssss Hi there, this is a demo testsssss Hi there, this is a demo testsssss Hi there, this is a demo testsssss Hi there, this is a demo testsssss")
    }
    
    @MainActor func testPersonalInfoVM() throws{
        let vm = PersonalInfoViewModel(isDemo: true)
        XCTAssertEqual(vm.personInfo[0].infoID, 1001)
        XCTAssertEqual(vm.personInfo[0].name, "Yinglong")
        XCTAssertEqual(vm.personInfo[0].phone, "8000001234")
        XCTAssertEqual(vm.personInfo[0].email, "wyl@gmail.com")
    }
    
    @MainActor func testCategoryVM() throws{
        let vm = CategoryViewModel(isDemo: true)
        XCTAssertEqual(vm.categories[0].name, "Restaurant")
        XCTAssertEqual(vm.categories[0].categoryID, 1)
        XCTAssertEqual(vm.categories[1].name, "Cinema")
        XCTAssertEqual(vm.categories[1].categoryID, 2)
    }
    
    @MainActor func testOrderVM() throws{
        let vm = OrderViewModel(isDemo: true)
        XCTAssertEqual(vm.orders[0].orderID, 3)
        XCTAssertEqual(vm.orders[0].userID, 3)
        XCTAssertEqual(vm.orders[0].timeID, 5)
        XCTAssertEqual(vm.orders[1].orderID, 2)
        XCTAssertEqual(vm.orders[1].userID, 4)
        XCTAssertEqual(vm.orders[1].timeID, 6)
    }
}
