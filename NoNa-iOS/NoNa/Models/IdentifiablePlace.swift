//
//  IdentifiablePlace.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-04-21.
//

import Foundation
import CoreLocation

struct IdentifiablePlace: Identifiable {
    let id: UUID
    let location: CLLocationCoordinate2D
    init(id: UUID = UUID(), lat: Double, long: Double) {
        self.id = id
        self.location = CLLocationCoordinate2D(
            latitude: lat,
            longitude: long)
    }
    
    init(id: UUID = UUID(), location: CLLocationCoordinate2D) {
        self.id = id
        self.location = location
    }
}
