//
//  AccountSwitchView.swift
//  NoNa
//
//  Created by WYL on 2023/4/6.
//
import SwiftUI

struct PersonalInfoSwitchView: View {
    
    @ObservedObject var personalInfoVM: PersonalInfoViewModel
    var switching = false
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        ScrollView{
            VStack{
                LazyVStack(alignment: .leading){
                    ForEach(personalInfoVM.personInfo) {accountinfo in
                        accountSwitchCard(content: accountinfo)
                            .aspectRatio(2/1, contentMode: .fit)
                    }
                }
                NavigationLink{
                    PersonalInfoEditView(personalInfoVM: personalInfoVM)
                } label: {
                    Text("New Account")
                        .fontWeight(.semibold)
                        .foregroundColor(Color.white)
                        .padding(.vertical, 4.0)
                        .nonaButton()
                        .frame(width: 150)
                }
                
            }.padding(.horizontal)
        }
        .navigationTitle("Personal Information")
        

    }
    
    func accountSwitchCard(content: PersonalInformation) -> some View {
        HStack{
            HStack{
                VStack(alignment: .leading){
                    Text(content.name)
                        .font(.title3)
                        .bold()
                    Text(String(content.phone))
                        .font(.callout)
                    Text(String(content.email))
                        .font(.body)
                }
                Spacer()
            }.onTapGesture {
                if (switching){
                    personalInfoVM.selectPersonalInfo(person: content)
                    dismiss()
                }
            }
            
            NavigationLink{
                PersonalInfoEditView(infoid: content.infoID, personalInfoVM: personalInfoVM, nameText: content.name, phoneText: content.phone, emailText: content.email)
            } label: {
                Text("Modify")
                    .fontWeight(.semibold)
                    .foregroundColor(Color.white)
                    .padding(.vertical, 4.0)
                    .nonaButton()
                    .frame(width: 100)
            }.buttonStyle(.plain)
        }
        //            Divider().overlay(Color(cgColor: CGColor(red: 126.0/255, green: 161.0/255, blue: 238.0/255, alpha: 1)))
        
    }
    
}


struct AccountSwitchView_Previews: PreviewProvider {
    static var previews: some View {
        PersonalInfoSwitchView(personalInfoVM: PersonalInfoViewModel(isDemo: true))
            .preferredColorScheme(.dark)
        PersonalInfoSwitchView(personalInfoVM: PersonalInfoViewModel(isDemo: true))
            .preferredColorScheme(.light)
    }
}

