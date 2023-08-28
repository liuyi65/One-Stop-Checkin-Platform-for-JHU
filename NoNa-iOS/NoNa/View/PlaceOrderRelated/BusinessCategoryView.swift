//
//  BusinessListView.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-05.
//

import SwiftUI
import NavigationViewKit

struct BusinessCategoryView: View {
    @ObservedObject private(set) var bussinessListVM: BusinessListViewModel
    var category: BusinessCategory

    var body: some View {
        ScrollView {
            VStack{
                mainPageHeader()
                VStack{
                    let businesses = bussinessListVM.getBusinessesByCategory(category)
                    ForEach(businesses) { business in
                        LazyVStack(alignment: .leading){
                            if (business.id != businesses.first?.id){
                                Divider().overlay(Color(cgColor: CGColor(red: 126.0/255, green: 161.0/255, blue: 238.0/255, alpha: 1)))
                            }
                            NavigationLink {
                                let detailVM = BusinessDetailViewModel(business: business)
                                ServiceListView(detailVM: detailVM)
                            } label: {
                                businessItem(business)
                            }.buttonStyle(.plain)
                            
                            
                        }
                    }
                }.padding(.all)
            }
        }
        .ignoresSafeArea(SafeAreaRegions.container, edges: Edge.Set.top)
        
    }
    
    func mainPageHeader() -> some View {
    
        ThumbnailHeader(items: [
            ThumbnailItem(image: category.image, description: category.name, textYOffset: 10),
        ], minSize: 200)
        .frame(maxWidth: .infinity, minHeight: 200, maxHeight: 250)
        .clipped()
        .shadow(radius: 4, y:4)
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




struct BusinessCategoryView_Previews: PreviewProvider {
    static var previews: some View {
        BusinessCategoryView(bussinessListVM: BusinessListViewModel(isDemo: true), category: BusinessCategory(name: "Category 1", categoryID: 1))
        BusinessCategoryView(bussinessListVM: BusinessListViewModel(isDemo: true), category: BusinessCategory(name: "Category 1", categoryID: 1))
            .previewInterfaceOrientation(.landscapeRight)
            .previewDevice("iPad Pro (12.9-inch) (6th generation)")
    }
}
