//
//  CategoryListView.swift
//  NoNa
//
//  Created by WYL on 2023/4/4.
//

import SwiftUI

struct CalendarListView: View {
    @ObservedObject var calendarCardVM: OrderViewModel
    
    var body: some View {
        let dates = Array(calendarCardVM.ordersByDate.keys.enumerated()).sorted(by: {$0.element < $1.element}).map({$0.element})
        
        ScrollView{
            VStack{
                calendarPageHeader()
                ForEach(dates, id: \.self){ date in
                    let orders = calendarCardVM.ordersByDate[date]
                    let dateString = FormatFactory.instance.getDateString(date: date)
                    dateBlock(vm: calendarCardVM, dateString: dateString, orders: orders!)
                }
            }.padding(.horizontal)
        }
        
        
    }
    
    func dateBlock(vm: OrderViewModel, dateString: String, orders: [Order]) -> some View{
            VStack(alignment: .leading){
                NonaDivider(text: dateString)
                ForEach(orders){ order in
                    let img = vm.getImageByOrder(order: order)
                    NavigationLink{
                        AppointmentsDetailView(appointmentsDetailVM: vm, orderId: order.id)
                    } label: {
                        calendarCard(content: order, serviceImage: img)
                    }.buttonStyle(.plain)
                    
                }
            }
        }
    
    func calendarPageHeader() -> some View{
        VStack{
            Text("My Appointments")
                .bold()
                .font(.largeTitle)
                .padding(.vertical)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
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



struct CalendarListView_Previews: PreviewProvider {
    static var previews: some View {
        CalendarListView(calendarCardVM: OrderViewModel(isDemo: true))
            .preferredColorScheme(.dark)
        CalendarListView(calendarCardVM: OrderViewModel(isDemo: true))
            .preferredColorScheme(.light)
    }
}
