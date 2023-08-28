//
//  OrderPlaceViewModel.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-16.
//

import Foundation
import FirebaseAuth
import Combine


class OrderPlaceViewModel: ObservableObject {
    @Published var business: Business
    @Published var service: Service
    @Published var time: AvailableTime?
    @Published var customerInfo: PersonalInformation?
    @Published var comments: String
    
    private var cancellable: AnyCancellable?
    
    private let dateFormatter = DateFormatter()
    
    init(business: Business, service: Service, time: AvailableTime?) {
        self.business = business
        self.service = service
        self.time = time
       
        self.comments = ""
        self.customerInfo = nil
        dateFormatter.locale = Locale(identifier: "en_US_POSIX")
        dateFormatter.dateFormat = "EE, MMM dd at HH:mm"
    }
    
    init(){
        business = Business(busID: 1, name: "bus name", address: "0000 desc", rating: 3.2, desc: "Desc")
        service = Service(service_id: 1, name: "service name", description: "service desc", base_price: 10.2)
        time = AvailableTime(time: Date(), slotIDs: [1,2,3])
        comments = ""
        
    }
    
    func onLoad(){
        customerInfo = DataManager.instance.getSelectedPerson()
    }
    
    func placeOrder(callback: @escaping () -> Void = {}){
        Auth.auth().currentUser?.getIDToken() { token, error in
            if(error != nil){
                print(error!.localizedDescription)
                return
            }
            
            self.cancellable = DataManager.instance.placeOrder(token: token!, slot_id: self.time!.slotIDs.first!, name: self.customerInfo!.name, phone: self.customerInfo!.phone, email: self.customerInfo!.email, comments: self.comments){ result, msg in
                print(msg)
                if (result){
                    callback()
                }
            }
        }
    }
    
    deinit{
        if(cancellable != nil){
            cancellable?.cancel()
        }
    }
//    def getTimeString(){
//
//    }
}
