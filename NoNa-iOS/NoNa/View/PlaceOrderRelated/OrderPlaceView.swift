//
//  OrderPlaceView.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-16.
//

import SwiftUI

struct OrderPlaceView: View {
    @ObservedObject var orderPlaceVM: OrderPlaceViewModel
    var body: some View {
        ZStack(alignment: .bottom){
            ScrollView{
                VStack(alignment: .leading){
                    ThumbnailHeader(items: [ThumbnailItem(image: orderPlaceVM.service.image)], minSize: 200)
                        .frame(minHeight: 200, maxHeight: 250)
                        .clipped()
                        .shadow(radius: 4, y: 4)
                    orderDetail()
                        .padding(.horizontal)
                    NonaDivider(text: "Information")
                    NavigationLink{
                        PersonalInfoSwitchView(personalInfoVM: PersonalInfoViewModel(), switching: true)
                    } label: {
                        customerInfo()
                            .padding(.horizontal)
                    }.buttonStyle(.plain)
                    
                    NonaDivider(text: "Comments")
                    customerComments()
                        .padding(.horizontal)
                }
                
            }
            if(orderPlaceVM.customerInfo != nil){
                confirm()
            }
        }
        .onAppear{
            orderPlaceVM.onLoad()
        }
        .ignoresSafeArea(SafeAreaRegions.container, edges: Edge.Set.top)
    }
    
    func customerComments() -> some View {
        ZStack{
            if #available(iOS 16.0, *) {
                TextField("Comments", text: $orderPlaceVM.comments)
                    .lineLimit(5...10)
                    .textFieldStyle(.roundedBorder)
            } else {
                // Fallback on earlier versions
                TextField("Comments", text: $orderPlaceVM.comments)
                    .textFieldStyle(.roundedBorder)
            }
        }
    }
    
    func customerInfo() -> some View {
        HStack{
            VStack(alignment: .leading, spacing: 2){
                Text(orderPlaceVM.customerInfo?.name ?? "")
                    .font(.headline)
                Text(orderPlaceVM.customerInfo?.phone ?? "Please fill out the contact information.")
                Text(orderPlaceVM.customerInfo?.email ?? "")
            }
            Spacer()
            Image(systemName: "chevron.right")
                .foregroundColor(.secondary)
        }
        .accessibilityIdentifier("PersonalInfoSwitcher")
    }
    
    func orderDetail() -> some View {
        VStack(alignment: .leading, spacing: 0){
            Text(orderPlaceVM.service.name)
                .font(.title)
                .fontWeight(.bold)
            Text("at " + orderPlaceVM.business.name)
                .font(.title2)
                .fontWeight(.semibold)
                .padding(.bottom)
            Text(FormatFactory.instance.jsonDateFormatter.string(from: orderPlaceVM.time!.originalTime))
                .font(.body)
        }
    }
    
    func confirm() -> some View{
        NavigationLink {
            OrderPlacedView(orderPlaceVM: orderPlaceVM)
        }
        label: {
            Text("Confirm")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(Color.white)
                .lineLimit(1)
                .padding(.all, 6)
                .nonaButton()
                .padding(.horizontal)
        }.buttonStyle(.plain)
        
//            .simultaneousGesture(TapGesture().onEnded{
//                print("tapped")
//            })
    }
}

struct OrderPlaceView_Previews: PreviewProvider {
    static var previews: some View {
        OrderPlaceView(orderPlaceVM: OrderPlaceViewModel())
    }
}
