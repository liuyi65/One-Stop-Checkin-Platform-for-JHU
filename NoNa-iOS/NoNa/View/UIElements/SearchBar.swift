//
//  SearchBar.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-14.
//

import SwiftUI


struct SearchBar: View { 
    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(.secondary)
                .padding(.leading)
            VStack{
                Text("Search")
                    .foregroundColor(.secondary)
            }
            Spacer()
        }
        .padding(.all)
        .background(Color(.systemGray6))
        .cornerRadius(.infinity)
        .shadow(radius: 2, x: 0, y: 5)
    }
}

struct SearchBar_Previews: PreviewProvider {
    static var previews: some View {
        SearchBar()
    }
}

extension View {
    func endTextEditing() {
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
    }
}
