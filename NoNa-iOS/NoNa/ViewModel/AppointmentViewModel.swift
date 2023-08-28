//
//  AppointmentViewModel.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-15.
//

import Foundation
import Combine

class AppointmentViewModel: ObservableObject {
    @Published var service: Service
    @Published var business: Business
    @Published var availableTimes: [Date: [AvailableTime]] = [:]
    @Published var selectedTime: AvailableTime?
    
    var cancellable: AnyCancellable?
    
    private var isDemo = false
    
    init(){
        service = Service(service_id: 1, name: "Test Service", description: "This is a description", base_price: 2.0)
        let timeSlots = [AvailableTime(time: Date(), slotIDs: [1,2,3]),
                          AvailableTime(time: Calendar.current.date(byAdding: .hour, value: 2, to: Date())!, slotIDs: [4,5,6]),
                          AvailableTime(time: Calendar.current.date(byAdding: .minute, value: 30, to: Date())!, slotIDs: []),
                          AvailableTime(time: Calendar.current.date(byAdding: .day, value: 1, to: Date())!, slotIDs: [7]),
                          AvailableTime(time: Calendar.current.date(byAdding: .day, value: 7, to: Date())!, slotIDs: [8])]
        business = Business(busID: 1, name: "test", address: "0000 addres", rating: 3.2, desc: "desc")
        setAvailableTimes(timeSlots.sorted(by: {$0.originalTime < $1.originalTime}))
        isDemo = true
    }
    
    init(service: Service, business: Business){
        self.service = service
        self.business = business
    }
    
    func onLoad(){
        if(isDemo){
            return
        }
        
        cancellable = DataManager.instance.getAvailableTimesByServiceId(id: service.id){ timeSlots in
            self.availableTimes = [:]
            self.setAvailableTimes(timeSlots.sorted(by: {$0.originalTime < $1.originalTime}))
        }
    }
    
    deinit{
        if(cancellable != nil){
            cancellable!.cancel()
        }
    }
    
    func setAvailableTimes(_ timeSlots: [AvailableTime]){
        timeSlots.forEach { timeSlot in
            if(availableTimes[timeSlot.date] == nil){
                availableTimes[timeSlot.date] = []
            }
            availableTimes[timeSlot.date]?.append(timeSlot)
        }
    }
    
    

}
