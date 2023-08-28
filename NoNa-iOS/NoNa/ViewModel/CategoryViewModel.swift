//
//  CategoryViewModel.swift
//  NoNa
//
//  Created by WYL on 2023/4/5.
//

import Foundation
import CoreData
import Combine
import UIKit

@MainActor class CategoryViewModel: ObservableObject {
    @Published var categories: [BusinessCategory] = []
    
    private var cancellables: [AnyCancellable] = []
    private let persistence: PersistenceController
    private let context: NSManagedObjectContext
    
    init(isDemo: Bool = false) {
        if (isDemo){
            persistence = .preview
            context = persistence.container.viewContext
            categories.append(BusinessCategory(name: "Restaurant", categoryID: 1))
            categories.append(BusinessCategory(name: "Cinema", categoryID: 2))
            return
        }
        persistence = .shared
        context = persistence.container.viewContext
        onLoad()
    }
    
    func onLoad(){
        let cancellable = DataManager.instance.getCategories{ cateogires in
            self.categories = cateogires
            self.getImage()
        }
        cancellables.append(cancellable)
    }
    
    private func getImage(){
        let localImage = getLocalImage()
        for (i, category) in categories.enumerated() {
            let img = localImage[category.id]
            if(img == nil){
                let cancellable = DataManager.instance.getImage(suffix: "categories/\(category.id)"){ retImg in
                    self.categories[i].image = retImg
                    self.setLocalImage(id: self.categories[i].id, image: retImg)
                }
                cancellables.append(cancellable)
            } else {
                self.categories[i].image = img
                
            }
        }
    }
    
    private func setLocalImage(id: Int, image: UIImage?){
        if (image == nil) {
            return
        }
        let newCategoryImage = CategoryImage(context: context)
        newCategoryImage.image = image?.jpegData(compressionQuality: 1.0)
        newCategoryImage.id = Int64(exactly: id)!
        context.saveContext()
    }
    
    private func getLocalImage() -> [Int: UIImage] {
        var fetchResult: [NSFetchRequestResult]
        do {
            try fetchResult = context.fetch(CategoryImage.fetchRequest())
        } catch {
            let nsError = error as NSError
            fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
        }
        let images = fetchResult as! [CategoryImage]
        var ret: [Int: UIImage] = [:]
        images.forEach{ img in
            let uiImg = UIImage(data: img.image!)
            ret[Int(img.id)] = uiImg
        }
        return ret
    }
    
    deinit{
        cancellables.forEach{cancellable in
            cancellable.cancel()
        }
    }
    
}

