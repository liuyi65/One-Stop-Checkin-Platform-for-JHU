//
//  PastAppointmentView.swift
//  NoNa
//
//  Created by WYL on 2023/4/6.
//

import SwiftUI

struct PastAppointmentView: View {
    @ObservedObject var pastAppointmentVM: OrderViewModel
    
    var body: some View {
        ScrollView{
            VStack{
                LazyVStack(alignment: .leading){
                    ForEach(pastAppointmentVM.orders) {order in
                        NavigationLink{
                            AppointmentsDetailView(appointmentsDetailVM: pastAppointmentVM, orderId: order.orderID)
                        } label: {
                            PastAppointmentCardView(content: order)
                        }.buttonStyle(.plain)
                    }
                }
            }.padding(.horizontal)
    
        }
        .onAppear{
            pastAppointmentVM.onLoad()
        }
        .navigationTitle("Past Appointments")
    }
    
    struct PastAppointmentCardView: View{
        var content:Order

        var body: some View{
            
            HStack{
                Image(systemName: "bag.circle.fill")
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .padding([.top, .bottom, .trailing])
                    .frame(width: 65, height: 65)
                VStack(alignment: .leading){
                    Text(content.service.serviceName)
                        .font(.title3)
                        .bold()
                    Text("$" + String(format: "%.2f", content.service.basePrice ?? 0) + " • " + content.status)
                        .font(.body)
                    Text(FormatFactory.instance.getDateString(date: content.starts, includeYear: false) + " • " + content.service.busName)
                        .font(.callout)
                        .font(.title3)
                }
                Spacer()
            }

        }
    }
}

struct PastAppointmentView_Previews: PreviewProvider {
    static var previews: some View {
        PastAppointmentView(pastAppointmentVM: OrderViewModel(isDemo: true))
            .preferredColorScheme(.dark)
        PastAppointmentView(pastAppointmentVM: OrderViewModel(isDemo: true))
            .preferredColorScheme(.light)
    }
}
