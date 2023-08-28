//
//  CheckInResultView.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-04-03.
//

import SwiftUI

struct CheckInResultView: View {
    @ObservedObject var checkedInVM: CheckInViewModel
    @Environment(\.navigationManager) var nvmanager
    @State var success = false
    var body: some View {
        VStack{
            if(success){
                Spacer()
                successMark()
                Spacer()
                orderDetail()
//                Spacer()
//                Text("Please wait a while. We will notice you when everything is ready.")
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
            } else {
                VStack{
                    ProgressView().padding(.all)
                    Text("Please Wait...")
                }.onAppear{
                    checkedInVM.checkIn {
                        success = true
                    }
                }
            }
        }
    }
    
    func orderDetail() -> some View{
        VStack(alignment: .leading){
            VStack(alignment: .leading, spacing: 0){
                Text(FormatFactory.instance.jsonDateFormatter.string(from: checkedInVM.order.starts))
                    .font(.body)
                    .fontWeight(.semibold)
                Text(checkedInVM.order.service.serviceName + " at " + checkedInVM.order.service.busName)
                    .font(.body)
                    .fontWeight(.semibold)
                    .padding(.bottom)
                if(checkedInVM.order.service.busAddress != nil){
                    Text(checkedInVM.order.service.busAddress!)
                }
            }.padding(.bottom)
            VStack(alignment: .leading, spacing: 2){
                Text(checkedInVM.order.customerName)
                    .font(.headline)
                Text(checkedInVM.order.phoneNumber)
                Text(checkedInVM.order.bookerEmail)
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
            Text("Check-In Successful")
                .font(.title)
                .fontWeight(.semibold)
        }
    }
}

struct CheckInResultView_Previews: PreviewProvider {
    static var previews: some View {
        CheckInResultView(checkedInVM: CheckInViewModel())
    }
}
