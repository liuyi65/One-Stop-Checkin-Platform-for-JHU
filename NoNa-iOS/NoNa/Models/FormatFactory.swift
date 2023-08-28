//
//  FormatFactory.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-15.
//

import Foundation

class FormatFactory {
    static let instance = FormatFactory()
    private(set) var jsonDateFormatter: DateFormatter
    private init(){
        jsonDateFormatter = DateFormatter()
        jsonDateFormatter.locale = Locale(identifier: "en_US_POSIX")
        jsonDateFormatter.dateFormat = "EEEE, yyyy-MM-dd HH:mm:ss"
    }
    
    func getDateString(date: Date, includeYear: Bool = true, includeTime: Bool = false) -> String{
        if (Calendar.current.isDateInToday(date)){
            return "Today"
        }
        if (Calendar.current.isDateInTomorrow(date)){
            return "Tomorrow"
        }
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        if (Calendar.current.isDate(date, equalTo: Date(), toGranularity: .weekOfYear)){
            formatter.dateFormat = "'This 'EEEE"
            return formatter.string(from: date)
        }
        formatter.dateFormat = includeYear ? "MMM d, yyyy" : "MMM d"
        if(includeTime){
            formatter.dateFormat += " HH:mm:ss"
        }
        return formatter.string(from: date)
    }
    
    func getTimeString(date: Date) -> String? {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: date)
    }
}
