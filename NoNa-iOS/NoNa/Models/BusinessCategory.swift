//
//  BusinessCategory.swift
//  NoNa
//
//  Created by WYL on 2023/4/5.
//

import Foundation
import UIKit

struct BusinessCategory: Identifiable, Decodable {
    var id: Int {
        get { categoryID }
    }
    
    private enum CodingKeys: String, CodingKey {
        case name = "name"
        case categoryID = "category_id"
    }
    
    var image: UIImage?
    var name: String
    var categoryID: Int
    
    init(image: UIImage? = nil, name: String, categoryID: Int) {
        self.image = image
        self.name = name
        self.categoryID = categoryID
    }
    
}
