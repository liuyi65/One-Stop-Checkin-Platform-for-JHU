//
//  BusinessListView.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-05.
//

import SwiftUI
import NavigationViewKit

struct BusinessHomePageView: View {
    @ObservedObject private(set) var bussinessListVM: BusinessListViewModel
    @ObservedObject private(set) var orderVM: OrderViewModel

    var body: some View {
//        NavigationView {
        ScrollView {
            VStack{
                mainPageHeader()
                
                VStack{
                   
                    let readyOrders = orderVM.orders.filter({$0.status == "Ready"})
                    if (!readyOrders.isEmpty){
                        NonaDivider(text: "Ready To Check In", imagePath: "BusinessIcon")
                    }
                    ForEach(readyOrders){ order in
                        let img = orderVM.getImageByOrder(order: order)
                        NavigationLink{
                            AppointmentsDetailView(appointmentsDetailVM: orderVM, orderId: order.orderID)
                        } label: {
                            calendarCard(content: order, serviceImage: img)
                        }.buttonStyle(.plain)
                        
                    }
                    
                    NonaDivider(text: "Business near by", imagePath: "BusinessIcon")
                    
                    ForEach(bussinessListVM.businesses) { business in
                        LazyVStack(alignment: .leading){
                            if (business.id != bussinessListVM.businesses.first?.id){
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
        .navigationViewManager(for: "BusHomeView")
        
//        }
        
        
    }
    
    func mainPageHeader() -> some View {
        ZStack(alignment:.bottom){
            ThumbnailHeader(items: [
                ThumbnailItem(description: "We found these amazing places for you", textYOffset: 10),
                ThumbnailItem(description: "What would you like to have today?", textYOffset: 10)
            ], minSize: 300)
            .frame(maxWidth: .infinity, minHeight: 250)
            .shadow(radius: 4, y:4)
            NavigationLink{
                let categoryVM = CategoryViewModel()
                let businessVM = BusinessListViewModel()
                SearchBarView(categoryVM: categoryVM, businessVM: businessVM)
            } label: {
                GeometryReader { geometry in
                    SearchBar().frame(width: geometry.size.width)
                        .position(x: geometry.size.width / 2,y: geometry.size.height)
                }.padding(.horizontal, 20)
            }.buttonStyle(.plain)
        }.padding(.bottom, 20)
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
                if (business.phone != nil){
                    Text(business.phone!)
                        .font(.callout)
                }
                Text(String(business.address ?? "0000 Address"))
                    .font(.body)
            }
            Spacer()
        }.accessibilityIdentifier("BusinessHomeItem")
    }
    
    func calendarCard(content: Order, serviceImage: UIImage?) -> some View{
        HStack{
            let image = (serviceImage == nil) ? Image("DefaultThumbnailImage") : Image(uiImage: serviceImage!)
            image
                .resizable()
                .scaledToFill()
                .frame(width: 80, height: 80)
                .cornerRadius(10)
                .padding([.top, .bottom, .trailing], 6)
//            Image(systemName: "bag.circle.fill")
//                .resizable()
//                .aspectRatio(contentMode: .fill)
//                .padding([.top, .bottom, .trailing])
//                .frame(width: 65, height: 65)
            VStack(alignment: .leading){
                Text(content.service.serviceName)
                    .font(.title3)
                    .bold()
                Text(FormatFactory.instance.getDateString(date: content.starts, includeYear: false, includeTime: true) + " at " + content.service.busName)
                    .font(.callout)
                    .font(.title3)
                if content.service.busAddress != nil{
                    Text(content.service.busAddress!)
                        .font(.body)
                }
                Text(String(content.status))
                    .font(.body)
                    .foregroundColor(Color.gray)
            }
            Spacer()
            Image(systemName: "arrow.uturn.right.circle.fill")
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(width: 50, height: 50)
                .padding([.top, .bottom, .trailing], 3.0)
                .foregroundColor(Color("NonaClassic"))
                .onTapGesture {
                    content.getLocation{ location in
                        location.openMapsAppWithDirections(destinationName: content.service.busName)
                    }
                }
        }
    }
}




struct BusinessHomePageView_Previews: PreviewProvider {
    static var previews: some View {
        BusinessHomePageView(bussinessListVM: BusinessListViewModel(isDemo: true), orderVM: OrderViewModel(isDemo: true))
        BusinessHomePageView(bussinessListVM: BusinessListViewModel(isDemo: true), orderVM: OrderViewModel(isDemo: true))
            .previewInterfaceOrientation(.landscapeRight)
            .previewDevice("iPad Pro (12.9-inch) (6th generation)")
    }
}
