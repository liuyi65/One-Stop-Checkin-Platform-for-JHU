//
//  AppointmentsDetailView.swift
//  NoNa
//
//  Created by WYL on 2023/4/11.
//

import SwiftUI

struct AppointmentsDetailView: View {
    @Environment(\.navigationManager) var nvmanager
    @ObservedObject var appointmentsDetailVM: OrderViewModel
    var orderId: Int;

    var body: some View {
        let order = appointmentsDetailVM.getOrderByID(orderId);
        
        ScrollView{
            VStack{
                
                appointmentsDetailPageHeader(order: order!, image: appointmentsDetailVM.getImageByOrder(order: order!))
                    .padding(.bottom)
                
                VStack(alignment: .leading){
                    
                    if (order!.service.busPhone != nil){
                        HStack{
                            Image(systemName: "phone.fill")
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(width: 25, height: 25)
                                .padding([.top, .bottom, .trailing], 1.0)
                                .foregroundColor(Color("NonaClassic"))
                            Button(action: {
                                let phoneNumberformatted = "tel://" + order!.service.busPhone!
                                guard let url = URL(string: phoneNumberformatted) else { return }
                                UIApplication.shared.open(url)
                            }){
                                Text(order!.service.busPhone!)
                            }
                            Spacer()
                        }
                    } else{
                        
                    }
                    HStack{
                        Image(systemName: "clock.fill")
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(width: 25, height: 25)
                            .padding([.top, .bottom, .trailing], 1.0)
                            .foregroundColor(Color("NonaClassic"))
                        Text(FormatFactory.instance.jsonDateFormatter.string(from: order!.starts))
                        Spacer()
                    }
                    if (order!.service.busAddress != nil){
                        HStack{
                            Image(systemName: "mappin.circle.fill")
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(width: 25, height: 25)
                                .padding([.top, .bottom, .trailing], 1.0)
                                .foregroundColor(Color("NonaClassic"))
                            Text(order!.service.busAddress!)
                        }
                        Spacer()
                        
                    }
                }.padding([.horizontal, .bottom])
                
                if(order!.status == "Ready"){
                    NavigationLink{
                        CheckInView(orderVM: appointmentsDetailVM, orderId: order!.orderID)
                    } label: {
                        Text("Check In")
                            .fontWeight(.semibold)
                            .foregroundColor(Color.white)
                            .padding(.vertical, 4.0)
                            .nonaButton()
                            .frame(width: 350)
                    }
                }
                
                Text("Reorder")
                    .fontWeight(.semibold)
                    .foregroundColor(Color.white)
                    .padding(.vertical, 4.0)
                    .nonaButton()
                    .frame(width: 350)
                    .onTapGesture{
                        nvmanager.wrappedValue.popToRoot(tag: "BusHomeView")
                    }

                NavigationLink{
                    let chatVM = ChatViewModel()
                    HelpPageView(chatVM: chatVM, nameText: "")
                } label: {
                    Text("Get Help")
                        .fontWeight(.semibold)
                        .foregroundColor(Color.white)
                        .padding(.vertical, 4.0)
                        .nonaButton()
                        .frame(width: 350)
                }.buttonStyle(.plain)
            }
        }
        .onAppear{
            appointmentsDetailVM.onLoad()
        }.navigationTitle("Order Detail for order number " + String(order!.id))
        
    }
    
    func formatDate(date: Date) -> String {
            let formatter = DateFormatter()
            formatter.dateFormat = "dd MMM yyyy"
            return formatter.string(from: date)
        }
    
    var divider: some View{
        Divider().overlay(Color(cgColor: CGColor(red: 126.0/255, green: 161.0/255, blue: 238.0/255, alpha: 1)))
    }
    
    
    struct appointmentsDetailPageHeader: View{
        var order: Order
        var image: UIImage?
        
        var body: some View{
            VStack(alignment: .leading){
                ThumbnailHeader(items: [ThumbnailItem(image: image)], minSize: 200)
                    .frame(minHeight: 200, maxHeight: 250)
                    .clipped()
                    .shadow(radius: 4, y: 4)
                Text(order.service.serviceName + " at " + order.service.busName)
                    .bold()
                    .font(.title2)
                    .padding([.top, .leading])
                    .frame(maxWidth: .infinity, alignment: .leading);
                
                Text("$" + String(format: "%.2f", order.service.basePrice ?? 0) + " • " + order.status)
                    .font(.body)
                    .multilineTextAlignment(.leading)
                    .padding(.leading)
                
            }
        }
    }

}

struct AppointmentsDetailView_Previews: PreviewProvider {
    static var previews: some View {
        AppointmentsDetailView(appointmentsDetailVM: OrderViewModel(isDemo: true), orderId: 2)
            .preferredColorScheme(.dark)
        AppointmentsDetailView(appointmentsDetailVM: OrderViewModel(isDemo: true), orderId: 2)
            .preferredColorScheme(.light)
    }
}

