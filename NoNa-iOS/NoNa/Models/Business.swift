//
//  Business.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-05.
//

import Foundation
import UIKit

struct Business: Identifiable, Decodable {

    
    var id: Int {
        get {busID}
    }
    
    private enum CodingKeys: String, CodingKey {
        case busID = "business_id"
        case name = "name"
        case address = "address"
        case rating = "rating"
        case desc = "description"
        case categoryID = "category_id"
        case phone = "phone"
    }
    
    let busID: Int
    let name: String
    let address: String?
    let rating: Float?
    let desc: String?
    let categoryID: Int?
    let phone: String?
    var image: UIImage?
    
    
    init(busID: Int, name: String, address: String?, rating: Float?, desc: String?, image: UIImage? = nil, categoryID: Int? = nil, phone: String? = nil) {
        self.busID = busID
        self.name = name
        self.address = address
        self.rating = rating
        self.desc = desc
        self.image = image
        self.categoryID = categoryID
        self.phone = phone
    }
    
}
