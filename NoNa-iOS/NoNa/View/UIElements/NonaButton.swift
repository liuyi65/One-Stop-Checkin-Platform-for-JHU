//
//  NonaButton.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-15.
//

import SwiftUI

struct NonaButton: ViewModifier {
    var selected: Bool
    func body(content: Content) -> some View {
        let color = selected ?  Color(cgColor: CGColor(red: 7.0/255, green: 5.0/255, blue: 115.0/255, alpha: 1.0)) : Color(cgColor: CGColor(red: 126.0/255, green: 161.0/255, blue: 238.0/255, alpha: 1.0))
        HStack {
            Spacer()
            content
            Spacer()
        }.background(color)
            .cornerRadius(.infinity)
    }
}

extension View {
    func nonaButton(selected: Bool = false) -> some View{
        modifier(NonaButton(selected: selected))
    }
}

struct NonaButton_Previews: PreviewProvider {
    static var previews: some View {
        Text("test").nonaButton()
    }
}
