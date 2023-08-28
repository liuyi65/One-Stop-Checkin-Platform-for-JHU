//
//  AvailableTime.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-15.
//

import Foundation

struct AvailableTime: Identifiable, Decodable, Equatable {
    var id: Date {
        get {originalTime}
    }
    var date: Date {
        get {Calendar.current.date(bySettingHour: 0, minute: 0, second: 0, of: self.originalTime)!}
    }
    var originalTime: Date
    var slotIDs: [Int] = []
    
    enum CodingKeys: String, CodingKey {
        case originalTime = "time"
        case slot_id = "slot_ids"
    }
    
    init(time: Date, slotIDs: [Int]){
        self.originalTime = time
        self.slotIDs = slotIDs
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let timeString = try container.decode(String.self, forKey: .originalTime)
        originalTime = FormatFactory.instance.jsonDateFormatter.date(from: timeString)!
        slotIDs = try container.decode([Int].self, forKey: .slot_id)
    }
    
//    init?(json: [String: Any]){
//
//        guard let timeString = json["time"] as? String,
//              let time = FormatManager.instance.dateFormatter.date(from: timeString),
//              let slot_ids = json["slot_ids"] as? [Int]
//        else {
//            return nil
//        }
//        self.slot_id = slot_ids
//        self.originalTime = time
//    }
    
    func isSameDay(_ time: AvailableTime) -> Bool{
        return Calendar.current.isDate(self.originalTime, equalTo: time.originalTime, toGranularity: .day)
    }
}
