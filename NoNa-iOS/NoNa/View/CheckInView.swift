//
//  CheckInView.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-04-03.
//

import SwiftUI
import MapKit

struct CheckInView: View {
    @ObservedObject var orderVM: OrderViewModel
    @Environment(\.dismiss) private var dismiss
    
    var orderId: Int
    var order: Order
    
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 37.334_900, longitude: -122.009_020),
        latitudinalMeters: 750,
        longitudinalMeters: 750
    )
    @State private var places: [IdentifiablePlace] = []
    
    init(orderVM: OrderViewModel, orderId: Int) {
        self.orderVM = orderVM
        self.orderId = orderId
        self.order = orderVM.getOrderByID(orderId)!
    }
    
    var body: some View {
        VStack{
            Map(coordinateRegion: $region, showsUserLocation: true, annotationItems: places) { place in
                MapMarker(coordinate: place.location)
            }
                .frame(maxWidth: .infinity, maxHeight: 250)
            
            VStack(){
                Spacer()
                Text("Ready to Check-in")
                    .font(.title)
                    .fontWeight(.bold)
                Spacer()
                orderDetail()
                Spacer()
                Text("Would you like to check in now?")
                Spacer()
            }
            
            NavigationLink{
                CheckInResultView(checkedInVM: CheckInViewModel(order: order))
            } label: {
                Text("Check-In Now")
                    .font(.title2)
                    .fontWeight(.semibold)
                    .foregroundColor(Color.white)
                    .lineLimit(1)
                    .padding(.all, 6)
                    .nonaButton()
                    .padding(.horizontal)
            }
            Button{
                dismiss()
            } label: {
                Text("Not Yet")
            }
            Spacer()
            
        }
        .ignoresSafeArea(SafeAreaRegions.container, edges: Edge.Set.top)
        .onAppear{
            order.getLocation{ location in
                region.center = location
                
                places.append(IdentifiablePlace(location: location))
            }
        }
        
    }
    
    func orderDetail() -> some View{
        VStack(alignment: .leading){
            
            VStack(alignment: .leading, spacing: 0){
                Text(FormatFactory.instance.jsonDateFormatter.string(from: order.starts))
                    .font(.body)
                    .fontWeight(.semibold)
                Text(order.service.serviceName + " at " + order.service.busName)
                    .font(.body)
                    .fontWeight(.semibold)
                    .padding(.bottom)
                if(order.service.busAddress != nil){
                    Text(order.service.busAddress!)
                }
            }.padding(.bottom)
            VStack(alignment: .leading, spacing: 2){
                Text(order.customerName)
                    .font(.headline)
                Text(order.phoneNumber)
                Text(order.bookerEmail)
            }
        }
    }
}

struct CheckInView_Previews: PreviewProvider {
    static var previews: some View {
        CheckInView(orderVM: OrderViewModel(isDemo: true), orderId: 3)
    }
}
