//
//  BusinessDetailViewModel.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-05.
//

import Foundation
import Combine
import CoreData
import Combine
import UIKit

@MainActor class BusinessDetailViewModel: ObservableObject {
    @Published var business: Business
    @Published var services: [Service] = []
    @Published var timeSlots: [Int: [AvailableTime]] = [:]
    
    private var cancellable: [AnyCancellable] = []
    private let persistence: PersistenceController
    private let context: NSManagedObjectContext
    
    init(business: Business, isDemo: Bool = false){
        self.business = business
        if(isDemo){
            persistence = .preview
            context = persistence.container.viewContext
            services.append(Service(service_id: 1, name: "test", description: "test", base_price: 2.3))
            services.append(Service(service_id: 2, name: "test333", description: nil, base_price: nil))
            timeSlots[1] = [AvailableTime(time: Date(), slotIDs: [1,2,3])]
            timeSlots[2] = [AvailableTime(time: Date(), slotIDs: [4,5,6])]
            return
        }
        persistence = .shared
        context = persistence.container.viewContext
        onLoad()
    }
    
    func onLoad(){
        let newCancellable = DataManager.instance.getServiceByBusID(id: business.busID){ services in
            self.services = services
            self.services.forEach{service in
                let newCancellable = DataManager.instance.getAvailableTimesByServiceId(id: service.id) { slots in
                    self.timeSlots[service.id] = slots
                }
                self.cancellable.append(newCancellable)
            }
            self.getImage()
        }
        cancellable.append(newCancellable)
    }
        
    private func getImage(){
        let localImage = getLocalImage()
        for (i, service) in services.enumerated() {
            let img = localImage[service.id]
            if(img == nil){
                let ret = DataManager.instance.getImage(suffix: "services/\(service.id)"){ retImg in
                    self.services[i].image = retImg
                    self.setLocalImage(id: self.services[i].id, image: retImg)
                }
                cancellable.append(ret)
            } else {
                self.services[i].image = img
                
            }
        }
    }
    
    private func setLocalImage(id: Int, image: UIImage?){
        if (image == nil) {
            return
        }
        let newServiceImage = ServiceImage(context: context)
        newServiceImage.image = image?.jpegData(compressionQuality: 1.0)
        newServiceImage.id = Int64(exactly: id)!
        context.saveContext()
    }
    
    private func getLocalImage() -> [Int: UIImage] {
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
        return ret
    }
    
    func getNearestAvailable(service: Service) -> String? {
        guard let nextDate = self.timeSlots[service.serviceID]?.first?.originalTime
        else  {
            return nil
        }
        return FormatFactory.instance.getDateString(date: nextDate)
    }
    
    deinit{
        cancellable.forEach{$0.cancel()}
    }
}
