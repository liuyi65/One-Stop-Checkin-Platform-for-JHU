//
//  CategoryListView.swift
//  NoNa
//
//  Created by WYL on 2023/4/4.
//

import SwiftUI

struct CategoryListView: View {
    
    @ObservedObject var categoryVM: CategoryViewModel
    @ObservedObject var businessVM: BusinessListViewModel
    
    var body: some View {
//        NavigationView{
        VStack{
            ScrollView{
                categoryPageHeader()
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 150))]){
                    ForEach(categoryVM.categories) {category in
                        NavigationLink{
                            BusinessCategoryView(bussinessListVM: businessVM, category: category)
                        } label: {
                            CardView(content: category)
                                .aspectRatio(2/1, contentMode: .fit)
                        }
                        
                    }
                }
            }
            .buttonStyle(.plain)
            
            Spacer()
            
        }
        .padding(.horizontal)
    }
    func categoryPageHeader() -> some View{
        VStack{
            Text("All Categories")
                .bold()
                .font(.largeTitle)
                .padding(.vertical)
                .frame(maxWidth: .infinity, alignment: .leading)
            NavigationLink{
                let categoryVM = CategoryViewModel()
                let businessVM = BusinessListViewModel()
                SearchBarView(categoryVM: categoryVM, businessVM: businessVM)
            } label: {
                SearchBar()
                    .padding(.bottom)
            }.buttonStyle(.plain)
            
        }
    }
    
    struct CardView: View{
        var content: BusinessCategory
        var body: some View{
            VStack{
                ZStack{
                    let image = (content.image == nil) ? Image("DefaultThumbnailImage") : Image(uiImage: content.image!)
                    image
                        .resizable()
                        .scaledToFill()
                        .frame(width: 160, height: 100)
                        .cornerRadius(10)
                }
                Text(content.name)
                    .font(.footnote)
            }
        }
    }
}


































struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        CategoryListView(categoryVM: CategoryViewModel(isDemo: true), businessVM: BusinessListViewModel(isDemo: true))
            .preferredColorScheme(.dark)
        CategoryListView(categoryVM: CategoryViewModel(isDemo: true), businessVM: BusinessListViewModel(isDemo: true))
            .previewDevice("iPad Pro (12.9-inch) (6th generation)")
            .preferredColorScheme(.light)
        
    }
}
