//
//  CheckInViewModel.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-04-22.
//

import Foundation
import FirebaseAuth
import Combine

class CheckInViewModel: ObservableObject {
    @Published var order: Order
    
    var cancellable: AnyCancellable? = nil
    
    init(order: Order, success: Bool = false){
        self.order = order
    }
    
    init(isDemo: Bool = true){
        self.order = Order(orderID: 1, userID: 1, timeID: 1, customerName: "CusName", phoneNumber: "111", bookerEmail: "E@E", status: "Ready", slotID: 1, starts: Date(), serviceID: 1, serviceName: "SName", basePrice: 0, busID: 1, busName: "BusName", busAddress: "000 add")
    }

    func checkIn(callback: @escaping () -> Void = {}){
        Auth.auth().currentUser?.getIDToken() { token, error in
            if(error != nil){
                print(error!.localizedDescription)
                return
            }
            
            self.cancellable = DataManager.instance.checkIn(token: token!, orderID: self.order.orderID){ result, msg in
                print(msg)
                if (result) {
                    callback()
                }
            }
        }
    }
    
    deinit {
        self.cancellable?.cancel()
    }
}
