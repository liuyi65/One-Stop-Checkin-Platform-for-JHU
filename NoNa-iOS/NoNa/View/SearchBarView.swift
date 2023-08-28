//
//  SearchBarView.swift
//  NoNa
//
//  Created by WYL on 2023/4/22.
//

import Foundation
import SwiftUI

struct SearchBarView: View{
    @ObservedObject var categoryVM: CategoryViewModel
    @ObservedObject var businessVM: BusinessListViewModel
    @State var text: String = ""
    @State private var isEditing = false
    
    var body: some View{
        VStack{
            HStack{
                TextField("Restaurants, Groceries, Hair cur, etc.", text: $text)
                    .padding(7)
                    .padding(.horizontal, 25)
                    .background(Color(.systemGray6))
                    .cornerRadius(8)
                    .overlay(
                        HStack {
                            Image(systemName: "magnifyingglass")
                                .foregroundColor(.gray)
                                .frame(minWidth: 0, maxWidth: .infinity, alignment: .leading)
                                .padding(.leading, 8)
                     
                            if isEditing {
                                Button(action: {
                                    self.text = ""
                                }) {
                                    Image(systemName: "multiply.circle.fill")
                                        .foregroundColor(.gray)
                                        .padding(.trailing, 8)
                                }
                            }
                        }
                    )
                    .padding(.horizontal, 10)
                    .onTapGesture {
                        self.isEditing = true
                    }
                if isEditing {
                    Button(action: {
                        self.isEditing = false
                        self.text = ""
                    }) {
                        Text("Cancel")
                    }
                    .padding(.trailing, 10)
                    .transition(.move(edge: .trailing))
                    .animation(.default)
                }
            }
            ScrollView{
                ForEach(businessVM.businesses.filter{businessFilter(business: $0, text: text)}) { business in
                    NavigationLink {
                        let detailVM = BusinessDetailViewModel(business: business)
                        ServiceListView(detailVM: detailVM)
                    } label: {
                        businessItem(business)
                    }.buttonStyle(.plain)
                }.padding(.horizontal)
            }
//            Spacer()
        }
        
    }
    
    func businessFilter(business: Business, text: String) -> Bool{
        if (text.isEmpty){
            return false
        }
        if (business.name.lowercased().contains(text.lowercased())){
            return true
        }
        
        let filteredCategory = categoryVM.categories.filter{ category in
            category.categoryID == business.categoryID
        }.first
        
        if (filteredCategory != nil){
            return filteredCategory!.name.lowercased().contains(text.lowercased())
        }
        
        return false
        
    }
    
    func businessItem(_ business: Business) -> some View{
        HStack{
            let image = (business.image == nil) ? Image("DefaultThumbnailImage") : Image(uiImage: business.image!)
            image
                .resizable()
                .scaledToFill()
                .frame(width: 80, height: 80)
                .cornerRadius(10)
                .padding(.trailing, 6)
            
            VStack(alignment: .leading){
                Text(business.name)
                    .font(.title3)
                    .bold()
                Text(String(format: "%.2f", business.rating ?? 0))
                    .font(.callout)
                Text(String(business.address ?? "0000 Address"))
                    .font(.body)
            }
            Spacer()
        }
    }
}




struct SearchBarView_Previews: PreviewProvider {
    static var previews: some View {
        let categoryVM = CategoryViewModel(isDemo: true)
        let businessVM = BusinessListViewModel(isDemo: true)
        SearchBarView(categoryVM: categoryVM, businessVM: businessVM)
    }
}
