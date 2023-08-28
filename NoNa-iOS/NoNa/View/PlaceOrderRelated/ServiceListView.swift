//
//  ServiceListView.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-05.
//

import SwiftUI

struct ServiceListView: View {
    @ObservedObject var detailVM: BusinessDetailViewModel
    
    var body: some View {
        ScrollView{
            
            VStack(alignment: .leading){
                ThumbnailHeader(items: [ThumbnailItem(image: detailVM.business.image)], minSize: 200)
                    .frame(minHeight: 200, maxHeight: 250)
                    .clipped()
                    .shadow(radius: 4, y:4)
                
                busDetail(detailVM.business)
                    .padding(.horizontal)
                
                
                LazyVStack(alignment: .leading){
                    NonaDivider(text: "Appointments")
                    ForEach(detailVM.services){ service in
                        NavigationLink(destination: {
                            let appointmentVM = AppointmentViewModel(service: service, business: detailVM.business)
                            AppointmentView(appointmentVM: appointmentVM)
                        }){
                            serviceItem(service, detailVM.getNearestAvailable(service: service))
                        }.buttonStyle(.plain)
//                            .disabled(detailVM.getNearestAvailable(service: service) == nil)
                    }
                }.padding(.horizontal)
            }.frame(maxWidth: .infinity, alignment: .leading)
        }
        .ignoresSafeArea(SafeAreaRegions.container, edges: Edge.Set.top)
    }
    
    func busDetail(_ business: Business) -> some View {
        VStack(alignment: .leading){
            Text(business.name)
                .font(.title)
                .fontWeight(.bold)
            if(business.address != nil){
                Text(business.address!)
                    .font(.body)
            }
        }
    }
    
    func serviceItem(_ service: Service, _ nextAvailable: String?) -> some View {
        HStack {
            let image = (service.image == nil) ? Image("DefaultThumbnailImage") : Image(uiImage: service.image!)
            image
                .resizable()
                .scaledToFill()
                .frame(width: 80, height: 80)
                .cornerRadius(10)
                .padding([.top, .bottom, .trailing], 6)
                
            VStack(alignment: .leading){
                Text(service.name)
                    .font(.title3)
                    .bold()
                Text(String(format: "%.2f", service.price ?? 0))
                    .font(.callout)
                Text((nextAvailable != nil) ? ("Next: " + nextAvailable!) : "Not Available")
                    .font(.body)
            }
            
            Spacer()
           
            if (nextAvailable != nil) {
                Text("Book")
                    .fontWeight(.medium)
                    .foregroundColor(Color.white)
                    .lineLimit(1)
                    .nonaButton()
                    .frame(width: 70)
            }
        }
        .frame(height: 80)
        .accessibilityIdentifier("ServiceListItem")
    }
}

struct ServiceListView_Previews: PreviewProvider {
    static var previews: some View {
        ServiceListView(detailVM: BusinessDetailViewModel(business: Business(busID: 1, name: "test", address: "22233 address", rating: 3.2, desc: "desc"), isDemo: true))
//        ServiceView(service: BusinessDetailViewModel(business: Business(busID: 1, name: "test", address: nil, rating: nil, desc: nil), isDemo: true).services[0])
//            .previewLayout(.sizeThatFits)
            
    }
}
