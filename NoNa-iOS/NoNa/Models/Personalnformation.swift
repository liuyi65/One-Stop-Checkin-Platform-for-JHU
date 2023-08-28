//
//  Personalnformation.swift
//  NoNa
//
//  Created by WYL on 2023/4/7.
//

import Foundation

struct PersonalInformation: Identifiable, Decodable{
    
    var id: Int{
        get {infoID}
    }
    private enum CodingKeys: String, CodingKey{
        case infoID = "info_id"
        case name = "name"
        case phone = "phone"
        case email = "email"
    }
    
    var infoID: Int
    var name: String
    var phone: String
    var email: String
    

    
    init(infoID: Int, name: String, phone: String, email: String) {
        self.infoID = infoID
        self.name = name
        self.phone = phone
        self.email = email
    }
}
