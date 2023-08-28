//
//  BusinessListViewModel.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-05.
//

import Foundation
import Combine
import UIKit
import CoreData

@MainActor class BusinessListViewModel: ObservableObject {
    @Published private(set) var businesses: [Business] = []
    
    private var cancellables: [AnyCancellable] = []
    private let persistence: PersistenceController
    private let context: NSManagedObjectContext
    
    init(isDemo: Bool = false){
        if (isDemo){
            persistence = .preview
            context = persistence.container.viewContext
            self.businesses.append(Business(busID: 1, name: "Test1", address: nil, rating: nil, desc: nil))
            self.businesses.append(Business(busID: 2, name: "Test2", address: "address", rating: 3.3, desc: "desc", categoryID: 1))
            return
        }
        persistence = .shared
        context = persistence.container.viewContext
        onLoad()
    }
    
    func onLoad(){
        let cancellable = DataManager.instance.getBusinesses{ businesses in
            self.businesses = businesses
            self.getImage()
        }
        cancellables.append(cancellable)
       
    }
    
    func getImage(){
        let localImage = getLocalImage()
        
        for (i, business) in businesses.enumerated() {
            let img = localImage[business.id]
            if(img == nil){
                let cancellable = DataManager.instance.getImage(suffix: "businesses/\(business.id)"){ retImg in
                    self.businesses[i].image = retImg
                    self.setLocalImage(id: self.businesses[i].id, image: retImg)
                }
                cancellables.append(cancellable)
            } else {
                self.businesses[i].image = img
            }
        }
    }
    
    func setLocalImage(id: Int, image: UIImage?){
        if (image == nil) {
            return
        }
        let newBusImage = BusinessImage(context: context)
        newBusImage.image = image?.jpegData(compressionQuality: 1.0)
        newBusImage.id = Int64(exactly: id)!
        context.saveContext()
    }
    
    func getLocalImage() -> [Int: UIImage] {
        var fetchResult: [NSFetchRequestResult]
        do {
            try fetchResult = context.fetch(BusinessImage.fetchRequest())
        } catch {
            let nsError = error as NSError
            fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
        }
        let images = fetchResult as! [BusinessImage]
        var ret: [Int: UIImage] = [:]
        images.forEach{ img in
            let uiImg = UIImage(data: img.image!)
            ret[Int(img.id)] = uiImg
        }
        return ret
    }
    
    func getBusinessesByCategory(_ category: BusinessCategory) -> [Business] {
        businesses.filter{ business in
            return business.categoryID == category.id
        }
    }
    
    deinit{
        cancellables.forEach{ cancellable in
            cancellable.cancel()
        }
    }
}
