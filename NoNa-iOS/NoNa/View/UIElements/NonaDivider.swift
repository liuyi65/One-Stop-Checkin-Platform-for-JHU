//
//  NonaDivider.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-14.
//

import SwiftUI

struct NonaDivider: View {
    var dividerColor: Color = Color(cgColor: CGColor.init(red: 34.0/255, green: 51.0/255, blue: 83.0/255, alpha: 1))
    var textColor: Color = Color(cgColor: CGColor.init(red: 69.0/255, green: 101.0/255, blue: 172.0/255, alpha: 1))
    var text = "Upcoming Appointment"
    var imagePath: String? = nil
    
    var body: some View {
        HStack{
            DividerLine()
                .stroke(style: StrokeStyle(lineWidth: 1))
                .frame(height: 3).foregroundColor(dividerColor)
            if(imagePath != nil){
                Image(imagePath!)
            }
            Text(text).foregroundColor(textColor).lineLimit(1).layoutPriority(1)
            DividerLine()
                .stroke(style: StrokeStyle(lineWidth: 1))
                .frame(height: 3).foregroundColor(dividerColor)
        }
    }
}

struct DividerLine: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: 0, y: rect.height/2))
        path.addLine(to: CGPoint(x: rect.width, y: rect.height/2))
        return path
    }
}

struct NonaDivider_Previews: PreviewProvider {
    static var previews: some View {
        NonaDivider(imagePath: "BusinessIcon")
    }
}
