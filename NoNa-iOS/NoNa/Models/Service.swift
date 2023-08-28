//
//  Service.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-05.
//

import Foundation
import UIKit

struct Service: Identifiable, Decodable {
    var id: Int {
        get {serviceID}
    }
    
    let serviceID: Int
    let name: String
    let desc: String?
    let price: Float?
    var image: UIImage?
    
    private enum CodingKeys: String, CodingKey {
        case serviceID = "service_id"
        case name = "name"
        case price = "base_price"
        case desc = "description"
    }
    
    init(service_id: Int, name: String, description: String?, base_price: Float?, image: UIImage? = nil) {
        self.serviceID = service_id
        self.name = name
        self.desc = description
        self.price = base_price
    }
    

}

