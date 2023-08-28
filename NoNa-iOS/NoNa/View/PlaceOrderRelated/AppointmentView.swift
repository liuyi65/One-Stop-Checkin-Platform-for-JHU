//
//  AppointmentView.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-15.
//

import SwiftUI
import FirebaseAuth

struct AppointmentView: View {
    @ObservedObject var appointmentVM: AppointmentViewModel
    @State private var loggedIn = false
    var body: some View {
        let dates = Array(appointmentVM.availableTimes.keys.enumerated()).sorted(by: {$0.element < $1.element}).map({$0.element})
        ZStack(alignment:.bottom){
            
            ScrollView{
                LazyVStack(alignment: .leading){
                    ThumbnailHeader(items: [ThumbnailItem(image: appointmentVM.service.image)], minSize: 200)
                        .frame(minHeight: 200, maxHeight: 250)
                        .clipped()
                        .shadow(radius: 4, y: 4)
                    
                    serviceDetail(appointmentVM.service)
                        .padding(.horizontal)
                    
                    NonaDivider(text: "Available Time Slots")
                    
                    ForEach(dates, id: \.self){ date in
                        let timeSlots = appointmentVM.availableTimes[date]
                        let dateString = FormatFactory.instance.getDateString(date: date)
                        dateBlock(dateString: dateString, timeSlots: timeSlots!)
                    }
                }
            }
            if appointmentVM.selectedTime != nil{
                confirmSection()
            }
        }
        .ignoresSafeArea(SafeAreaRegions.container, edges: Edge.Set.top)
        .onAppear{
            appointmentVM.onLoad()
            loggedIn = Auth.auth().currentUser != nil
        }
    }
    
    func confirmSection() -> some View{
        let selected = appointmentVM.selectedTime?.originalTime
        let placeText = "Confirm for " + FormatFactory.instance.getDateString(date: selected ?? Date(), includeYear: false) + " " + FormatFactory.instance.getTimeString(date: selected ?? Date())!
        
        return NavigationLink {
            if (loggedIn){
                OrderPlaceView(orderPlaceVM:OrderPlaceViewModel(business: appointmentVM.business, service: appointmentVM.service, time: appointmentVM.selectedTime!))
            } else {
                LoginView()
            }
        }
        label: {
            Text(placeText)
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(Color.white)
                .lineLimit(1)
                .padding(.all, 6)
                .nonaButton()
                .padding(.horizontal)
                .accessibilityIdentifier("AppointmentConfirmButton")
        }.buttonStyle(.plain)
    }
    
    func serviceDetail(_ service: Service) -> some View {
        VStack(alignment: .leading){
            Text(service.name)
                .font(.title)
                .fontWeight(.bold)
            if(service.desc != nil){
                Text(service.desc!)
                    .font(.body)
            }
        }
    }
    
    func dateBlock(dateString: String, timeSlots: [AvailableTime]) -> some View{
        VStack(alignment: .leading, spacing: 0){
            Text(dateString)
                .font(.title2)
                .fontWeight(.semibold)
                .padding(.horizontal)
            ScrollView(.horizontal){
                HStack(spacing: 8){
                    ForEach(timeSlots){ slot in
                        timeBlock(timeSlot: slot, selected: $appointmentVM.selectedTime)
                    }
                }.padding([.horizontal])
                    .padding(.top, 5)
            }
        }
    }
    
    func timeBlock(timeSlot: AvailableTime, selected: Binding<AvailableTime?>) -> some View {
        Text(FormatFactory.instance.getTimeString(date: timeSlot.originalTime)!)
            .foregroundColor(Color.white)
            .padding(.all, 4)
            .nonaButton(selected: selected.wrappedValue == timeSlot)
            .onTapGesture {
                selected.wrappedValue = selected.wrappedValue == timeSlot ? nil : timeSlot
            }
            .accessibilityIdentifier("AppointmentTimeButton")
        
    }
}



struct AppointmentView_Previews: PreviewProvider {
    static var previews: some View {
        AppointmentView(appointmentVM: AppointmentViewModel())
    }
}
