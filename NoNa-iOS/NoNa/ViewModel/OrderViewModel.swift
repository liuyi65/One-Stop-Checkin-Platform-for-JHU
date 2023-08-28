//
//  OrderViewModel.swift
//  NoNa
//
//  Created by WYL on 2023/4/6.
//

import Foundation
import FirebaseAuth
import Combine
import CoreData
import UIKit

@MainActor class OrderViewModel: ObservableObject{
    @Published var orders: [Order] = []
    @Published var ordersByDate: [Date: [Order]] = [:]
    private var localImages: [Int: UIImage] = [:]
    private var locationManager: LocationManager?
    
    private var cancellable: AnyCancellable?
    private let persistence: PersistenceController
    private let context: NSManagedObjectContext
    
    var past: Bool
    
    init(isDemo: Bool = false, past: Bool = false, locationManager: LocationManager? = nil){
        if (isDemo){
            persistence = .preview
            context = persistence.container.viewContext
            self.past = true
            let order1 = Order(orderID: 3, userID: 3, timeID: 5, customerName: "WYL", phoneNumber: "800000000", bookerEmail: "example@gmail.com", status: "Ready For Check In", slotID: 10, starts: Date(), serviceID: 7, serviceName: "Hair Cut", basePrice: 25, busID: 8, busName: "Hair Salone", busAddress: "500 W University Pkwy")
            let order2 = Order(orderID: 2, userID: 4, timeID: 6, customerName: "JKQ", phoneNumber: "800123456", bookerEmail: "user@gmail.com", status: "15 miles", slotID: 5, starts: Date(), serviceID: 4, serviceName: "Auto Repair", basePrice: 30, busID: 7, busName: "Auto Maintanience", busAddress: "501 W University Pkwy")
            orders.append(order1)
            orders.append(order2)
            ordersByDate[order1.date] = [order1, order2]
            return
        }
        persistence = .shared
        context = persistence.container.viewContext
        self.past = past
        self.locationManager = locationManager
        onLoad()
    }
    
    func getOrderByID(_ id: Int) -> Order? {
        return orders.first{ $0.id == id }
    }
    
    func getImageByOrder(order: Order) -> UIImage? {
        return localImages[order.service.serviceID]
    }
    
    
    private func getLocalImage() {
        var fetchResult: [NSFetchRequestResult]
        do {
            try fetchResult = context.fetch(ServiceImage.fetchRequest())
        } catch {
            let nsError = error as NSError
            fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
        }
        let images = fetchResult as! [ServiceImage]
        var ret: [Int: UIImage] = [:]
        images.forEach{ img in
            let uiImg = UIImage(data: img.image!)
            ret[Int(img.id)] = uiImg
        }
        localImages = ret
    }
    
    func onLoad(){
        if Auth.auth().currentUser == nil{
            self.orders = [];
            self.ordersByDate = [:]
            return
        }
        getLocalImage()
        Auth.auth().currentUser!.getIDToken{ token, error in
            self.cancellable = DataManager.instance.getOrderHistory(token: token!, past: self.past){ orders in
                self.orders = orders
                self.orders.sort(by: {$0.starts > $1.starts})
                if(!self.past){
                    self.orders = self.orders.filter{$0.status != "Completed" && $0.status != "Missed"}
                }
                self.ordersByDate = [:]
                self.setOrdersByDate(self.orders)
                
                if(self.locationManager != nil){
                    let preparedOrders = orders.filter{$0.status == "Ready"}
                    preparedOrders.forEach{ order in
                        self.locationManager!.listeningOrder(order: order)
                    }
                }
            }
        }
        return
    }
    
    func setOrdersByDate(_ orders: [Order]){
        orders.forEach{ order in
            if(ordersByDate[order.date] == nil){
                ordersByDate[order.date] = []
            }
            ordersByDate[order.date]?.append(order)
        }
        
        ordersByDate.keys.forEach{ date in
            ordersByDate[date]?.sort{$0.starts < $1.starts}
        }
        
    }
    
    deinit {
        cancellable?.cancel()
    }
}
