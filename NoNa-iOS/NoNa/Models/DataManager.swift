//
//  DataManager.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-05.
//

import Foundation
import Combine
import UIKit
import CoreData


class DataManager{
    static let instance = DataManager()
    private static let APIURL = "http://api.magicspica.com"
    private static let sessionProcessingQueue = DispatchQueue(label: "SessionProcessingQueue")
    private static var testUrlConfig: URLSessionConfiguration?
    private static let persistence = PersistenceController.shared
    private init(){}
    
    func setTest(urlConfig: URLSessionConfiguration){
        DataManager.testUrlConfig = urlConfig
    }
    
    private func errorHandling(_ completion: Subscribers.Completion<Error>){
        switch(completion){
        case .failure(let error):
            print(error.localizedDescription)
            return
        case .finished:
            return
        }
    }
    
    private func errorHandling(_ completion: Subscribers.Completion<URLError>, callback: (Bool, String?) -> Void = {_,_ in }){
        switch(completion){
        case .failure(let error):
            print(error.localizedDescription)
            callback(false, error.localizedDescription)
            return
        case .finished:
            callback(true, nil)
            return
        }
    }

    
    func getBusinesses(callback: @escaping ([Business])->Void) -> AnyCancellable {
        let urlSession = DataManager.testUrlConfig == nil ? URLSession.shared : URLSession(configuration: DataManager.testUrlConfig!)
        let cancellable = urlSession.dataTaskPublisher(for: URL(string: DataManager.APIURL + "/api/businesses")!)
            .subscribe(on: DataManager.sessionProcessingQueue)
            .map {$0.data}
            .decode(type: [Business].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: errorHandling(_:)){ businesses in
                callback(businesses)
            }
        return cancellable
    }
    
    func getServiceByBusID(id: Int, callback: @escaping ([Service])->Void) -> AnyCancellable {
        let urlSession = DataManager.testUrlConfig == nil ? URLSession.shared : URLSession(configuration: DataManager.testUrlConfig!)
        let cancellable = urlSession.dataTaskPublisher(for: URL(string: DataManager.APIURL + "/api/businesses/" + String(id) + "/services")!)
            .subscribe(on: DataManager.sessionProcessingQueue)
            .map{$0.data}
            .decode(type: [Service].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: errorHandling(_:)){ services in
                callback(services)
            }
        return cancellable
    }
    
    func getAvailableTimesByServiceId(id: Int, callback: @escaping ([AvailableTime]) -> Void) -> AnyCancellable {
        let urlSession = DataManager.testUrlConfig == nil ? URLSession.shared : URLSession(configuration: DataManager.testUrlConfig!)
        let cancellable = urlSession.dataTaskPublisher(for: URL(string: DataManager.APIURL + "/api/services/" + String(id) + "/available_time_slots")!)
            .subscribe(on: DataManager.sessionProcessingQueue)
            .map{$0.data}
            .decode(type: [String: AvailableTime].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: errorHandling(_:)){ times in
                var ret: [AvailableTime] = []
                times.forEach{key, value in
                    ret.append(value)
                }
                callback(ret)
            }
        return cancellable
    }

    func getCategories(callback: @escaping ([BusinessCategory]) -> Void) -> AnyCancellable {
        let urlSession = DataManager.testUrlConfig == nil ? URLSession.shared : URLSession(configuration: DataManager.testUrlConfig!)
        let cancellable = urlSession.dataTaskPublisher(for: URL(string: DataManager.APIURL + "/api/categories")!)
            .subscribe(on: DataManager.sessionProcessingQueue)
            .map{$0.data}
            .decode(type: [BusinessCategory].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: errorHandling(_:)){ categories in
                callback(categories)
            }
        return cancellable
    }
    
    func getAllPerson(token:String, callback: @escaping ([PersonalInformation]) -> Void) -> AnyCancellable{
        let urlSession = DataManager.testUrlConfig == nil ? URLSession.shared : URLSession(configuration: DataManager.testUrlConfig!)
        var request = URLRequest(url: URL(string: DataManager.APIURL + "/api/all_personal_info")!)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        let json = ["token": token]
        request.httpBody = try! JSONSerialization.data(withJSONObject: json)
        let cancellable = urlSession.dataTaskPublisher(for: request)
            .subscribe(on: DataManager.sessionProcessingQueue)
            .map{$0.data}
            .decode(type: [PersonalInformation].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: errorHandling(_:)){ allPersonInfo in
                callback(allPersonInfo)
            }
        return cancellable
    }
    
    func callChatBot(token: String, message: String, callback: @escaping(String) -> Void) -> AnyCancellable{
        let urlSession = DataManager.testUrlConfig == nil ? URLSession.shared : URLSession(configuration: DataManager.testUrlConfig!)
        var request = URLRequest(url: URL(string: DataManager.APIURL + "/api/chat")!)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        let json = ["token": token, "message": message] as [String : Any]
        
        request.httpBody = try! JSONSerialization.data(withJSONObject: json)
        let cancellable = urlSession.dataTaskPublisher(for: request)
            .subscribe(on: DataManager.sessionProcessingQueue)
            .map{$0.data}
            .compactMap{String(data: $0, encoding:. utf8)}
            .receive(on: DispatchQueue.main)
            .sink{self.errorHandling($0){_, _ in}
            } receiveValue: { value in
                callback(value)
            }
        return cancellable
    }
    
    
    func getOrderHistory(token: String, past: Bool, callback: @escaping ([Order]) -> Void) -> AnyCancellable{
        let urlSession = DataManager.testUrlConfig == nil ? URLSession.shared : URLSession(configuration: DataManager.testUrlConfig!)
        var url = URLComponents(string: DataManager.APIURL + "/api/orders")!
        url.queryItems = [URLQueryItem(name: "past", value: String(past))]
        var request = URLRequest(url: url.url!)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        let json = ["token": token]
        
        request.httpBody = try! JSONSerialization.data(withJSONObject: json)
        let cancellable = urlSession.dataTaskPublisher(for: request)
            .subscribe(on: DataManager.sessionProcessingQueue)
            .map{$0.data}
            .decode(type: [Order].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: errorHandling(_:)){ orders in
                callback(orders)
            }
        return cancellable
    }
    
    func getImage(suffix: String, callback: @escaping (UIImage?) -> Void) -> AnyCancellable{
        let urlSession = DataManager.testUrlConfig == nil ? URLSession.shared : URLSession(configuration: DataManager.testUrlConfig!)
        let url = URL(string: DataManager.APIURL + "/file/image/\(suffix)")!
        let cancellable = urlSession.dataTaskPublisher(for: url)
            .subscribe(on: DataManager.sessionProcessingQueue)
            .map{UIImage(data: $0.data)}
            .receive(on: DispatchQueue.main)
            .sink{
                self.errorHandling($0){_, _ in}
            } receiveValue: { image in
                callback(image)
            }
        
        return cancellable
    }
    
    func modifyPersonInfo(token: String, infID: Int, name: String, email: String, phone: String, callback: @escaping(String) -> Void) -> AnyCancellable{
        let urlSession = DataManager.testUrlConfig == nil ? URLSession.shared : URLSession(configuration: DataManager.testUrlConfig!)
        var request = URLRequest(url: URL(string: DataManager.APIURL + "/api/personal_info")!)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        let json = ["token": token, "info_id": infID, "name": name, "email": email, "phone":phone] as [String : Any]
        
        request.httpBody = try! JSONSerialization.data(withJSONObject: json)
        let cancellable = urlSession.dataTaskPublisher(for: request)
            .subscribe(on: DataManager.sessionProcessingQueue)
            .map{$0.data}
            .compactMap{String(data: $0, encoding:. utf8)}
            .receive(on: DispatchQueue.main)
            .sink{self.errorHandling($0){_, _ in}
            } receiveValue: { value in
                callback(value)
            }
        return cancellable
    }
    
//    func deletePersonInfo(token:String, infoID: Int, callback: @escaping(String) -> Void) -> AnyCancellable{
//        let urlSession = DataManager.testUrlConfig == nil ? URLSession.shared : URLSession(configuration: DataManager.testUrlConfig!)
//        var request = URLRequest(url: URL(string: DataManager.APIURL + "/api/personal_info")!)
//        request.httpMethod = "DEL"
//        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
//        request.addValue("application/json", forHTTPHeaderField: "Accept")
//        let json = ["token": token, "info_id": infoID] as [String : Any]
//        
//        request.httpBody = try! JSONSerialization.data(withJSONObject: json)
//        let cancellable = urlSession.dataTaskPublisher(for: request)
//            .subscribe(on: DataManager.sessionProcessingQueue)
//            .map{$0.data}
//            .compactMap{String(data: $0, encoding:. utf8)}
//            .receive(on: DispatchQueue.main)
//            .sink{self.errorHandling($0){_, _ in}
//            } receiveValue: { value in
//                callback(value)
//            }
//        return cancellable
//    }
    
    func createPersonalInfo(token: String, name: String, email: String, phone: String, callback: @escaping(String) -> Void) -> AnyCancellable{
        let urlSession = DataManager.testUrlConfig == nil ? URLSession.shared : URLSession(configuration: DataManager.testUrlConfig!)
        var request = URLRequest(url: URL(string: DataManager.APIURL + "/api/personal_info")!)
        request.httpMethod = "PUT"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        let json = ["token": token, "name": name, "email": email, "phone":phone] as [String : Any]
        
        request.httpBody = try! JSONSerialization.data(withJSONObject: json)
        let cancellable = urlSession.dataTaskPublisher(for: request)
            .subscribe(on: DataManager.sessionProcessingQueue)
            .map{$0.data}
            .compactMap{String(data: $0, encoding:. utf8)}
            .receive(on: DispatchQueue.main)
            .sink{self.errorHandling($0){_, _ in}
            } receiveValue: { value in
                callback(value)
            }
        return cancellable
    }
        
    
    func createUser(token: String, callback: @escaping (Bool, String) -> Void) -> AnyCancellable{
        let urlSession = DataManager.testUrlConfig == nil ? URLSession.shared : URLSession(configuration: DataManager.testUrlConfig!)
        var request = URLRequest(url: URL(string: DataManager.APIURL + "/api/users")!)
        request.httpMethod = "PUT"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        let json = ["token": token]
        
        request.httpBody = try! JSONSerialization.data(withJSONObject: json)
        let cancellable = urlSession.dataTaskPublisher(for: request)
            .subscribe(on: DataManager.sessionProcessingQueue)
            .map{$0.data}
            .compactMap{String(data: $0, encoding:. utf8)}
            .receive(on: DispatchQueue.main)
            .sink{self.errorHandling($0){_, _ in}
            } receiveValue: { value in
                callback(value == "User created", value)
            }
        return cancellable
    }
    
    func placeOrder(token: String, slot_id: Int, name: String, phone: String, email: String, comments: String, callback: @escaping(Bool, String) -> Void) -> AnyCancellable{
        let urlSession = DataManager.testUrlConfig == nil ? URLSession.shared : URLSession(configuration: DataManager.testUrlConfig!)
        var request = URLRequest(url: URL(string: DataManager.APIURL + "/api/orders")!)
        request.httpMethod = "PUT"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        let json = ["token": token, "name": name, "phone": phone, "email": email, "comments": comments, "slot_id": slot_id] as [String : Any]
        request.httpBody = try! JSONSerialization.data(withJSONObject: json)
    
        let cancellable = urlSession.dataTaskPublisher(for: request)
            .subscribe(on: DataManager.sessionProcessingQueue)
            .map{$0.data}
            .compactMap{String(data: $0, encoding: .utf8)}
            .receive(on: DispatchQueue.main)
            .sink{self.errorHandling($0){_, _ in}
            } receiveValue: { value in
                callback(value == "Order created", value)
            }
        return cancellable
    }
    
    func checkIn(token: String, orderID: Int, callback: @escaping(Bool, String) -> Void) -> AnyCancellable{
        let urlSession = DataManager.testUrlConfig == nil ? URLSession.shared : URLSession(configuration: DataManager.testUrlConfig!)
        var request = URLRequest(url: URL(string: DataManager.APIURL + "/api/checkin")!)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        let json = ["token": token, "order_id": orderID] as [String : Any]
        request.httpBody = try! JSONSerialization.data(withJSONObject: json)
    
        let cancellable = urlSession.dataTaskPublisher(for: request)
            .subscribe(on: DataManager.sessionProcessingQueue)
            .map{$0.data}
            .compactMap{String(data: $0, encoding: .utf8)}
            .receive(on: DispatchQueue.main)
            .sink{self.errorHandling($0){_, _ in}
            } receiveValue: { value in
                callback(value == "Checked in", value)
            }
        return cancellable
    }
    
    func getSelectedPerson() -> PersonalInformation? {
        let context = DataManager.persistence.container.viewContext
        var fetchResult: [NSFetchRequestResult]
        do {
            try fetchResult = context.fetch(NonaSettings.fetchRequest())
        } catch {
            let nsError = error as NSError
            fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
        }
        let result = fetchResult as! [NonaSettings]
        if (result.count < 1) {
            return nil
        }
        let nonaSettings = result[0]
        let infoID = Int(nonaSettings.personalInfoID)
        let name = nonaSettings.personalName!
        let email = nonaSettings.personalEmail!
        let phone = nonaSettings.personalPhone!
        
        return PersonalInformation(infoID: infoID, name: name, phone: phone, email: email)
    }
    
    func setSelectedPerson(personInfo: PersonalInformation) {
        let context = DataManager.persistence.container.viewContext
        var fetchResult: [NSFetchRequestResult]
        do {
            try fetchResult = context.fetch(NonaSettings.fetchRequest())
        } catch {
            let nsError = error as NSError
            fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
        }
        let result = fetchResult as! [NonaSettings]
        var nonaSetting: NonaSettings?
        if (result.count < 1) {
            nonaSetting = NonaSettings(context: context)
        } else {
            nonaSetting = result[0]
        }
        nonaSetting!.personalPhone = personInfo.phone
        nonaSetting!.personalName = personInfo.name
        nonaSetting!.personalEmail = personInfo.email
        nonaSetting!.personalInfoID = Int32(personInfo.infoID)
        context.saveContext()
    }

    func clearSelectedPerson(){
        let context = DataManager.persistence.container.viewContext
        var fetchResult: [NSFetchRequestResult]
        do {
            try fetchResult = context.fetch(NonaSettings.fetchRequest())
        } catch {
            let nsError = error as NSError
            fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
        }
        let result = fetchResult as! [NonaSettings]
        var nonaSetting: NonaSettings?
        if (result.count < 1) {
            return
        }
        nonaSetting = result[0]
        context.delete(nonaSetting!)
    }
}
