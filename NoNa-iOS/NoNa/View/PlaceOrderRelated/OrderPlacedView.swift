//
//  OrderPlacedView.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-17.
//

import SwiftUI
import NavigationViewKit

struct OrderPlacedView: View {
    @Environment(\.navigationManager) var nvmanager
    @ObservedObject var orderPlaceVM: OrderPlaceViewModel
    @State var success = false
    var body: some View {
        ZStack{
            if !success{
                VStack{
                    ProgressView().padding(.all)
                    Text("We are confirming your appointment...")
                }.onAppear{
                    orderPlaceVM.placeOrder{
                        success = true
                    }
                }
            } else {
                VStack{
                    Spacer()
                    successMark()
                    Spacer()
                    orderDetail()
                    Spacer()
                    Text("Done")
                        .font(.title2)
                        .fontWeight(.semibold)
                        .foregroundColor(Color.white)
                        .lineLimit(1)
                        .padding(.all, 6)
                        .nonaButton()
                        .padding(.horizontal)
                        .onTapGesture{
                            nvmanager.wrappedValue.popToRoot(tag: "HomeRoot")
                        }
                    Spacer()
                }
            }
        }
        .navigationBarBackButtonHidden()
    }
    
    func orderDetail() -> some View{
        VStack(alignment: .leading){
            VStack(alignment: .leading, spacing: 0){
                Text(orderPlaceVM.service.name)
                    .font(.title2)
                    .fontWeight(.semibold)
                Text("at " + orderPlaceVM.business.name)
                    .font(.title2)
                    .fontWeight(.semibold)
                    .padding(.bottom)
                Text(FormatFactory.instance.jsonDateFormatter.string(from: orderPlaceVM.time!.originalTime))
                    .font(.body)
            }.padding(.bottom)
            VStack(alignment: .leading, spacing: 2){
                Text(orderPlaceVM.customerInfo!.name)
                    .font(.headline)
                Text(orderPlaceVM.customerInfo!.phone)
                Text(orderPlaceVM.customerInfo!.email)
            }
        }
    }
    
    func successMark() -> some View {
        VStack{
            Image(systemName: "checkmark.circle.fill")
                .resizable()
                .frame(width: 100, height: 100)
                .foregroundColor(Color.green)
                .padding(.all)
            Text("You are all set!")
                .font(.title)
                .fontWeight(.semibold)
        }
    }
}

struct OrderPlacedView_Previews: PreviewProvider {
    static var previews: some View {
        OrderPlacedView(orderPlaceVM: OrderPlaceViewModel())
    }
}
