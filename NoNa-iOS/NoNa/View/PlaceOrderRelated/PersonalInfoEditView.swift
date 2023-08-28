//
//  PersonalInfoEditView.swift
//  NoNa
//
//  Created by WYL on 2023/4/6.
//

import SwiftUI

struct PersonalInfoEditView: View {
    var infoid: Int = -1
    var personalInfoVM: PersonalInfoViewModel
    @Environment(\.dismiss) private var dismiss
    @State var nameText: String = ""
    @State var phoneText: String = ""
    @State var emailText: String = ""
    var body: some View {
        
        ScrollView{
            VStack(alignment: .leading){
                Section{
                    TextField("Enter your Name Here", text: $nameText)
                        .keyboardType(.namePhonePad)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                } header: {
                    Text("Name")
                }
                divider
                Section{
                    TextField("Enter your Phone Number Here", text: $phoneText)
                        .keyboardType(.phonePad)
                } header: {
                    Text("Phone Number")
                }
                divider
                Section{
                    TextField("Enter your Email Address Here", text: $emailText)
                        .keyboardType(.emailAddress)
                } header: {
                    Text("Email Address")
                }
                divider
            
            }.padding(.horizontal)
        }.navigationTitle("Profile")
            .toolbar(){
                save
            }
            
            
    }
    
    var divider: some View{
        Divider().overlay(Color(cgColor: CGColor(red: 126.0/255, green: 161.0/255, blue: 238.0/255, alpha: 1)))
    }
    
    var save: some View{
        Button{
            if infoid != -1{
                personalInfoVM.editPersonalInfo(infID: infoid, name: nameText, email: emailText, phone: phoneText)
                
            } else {
                personalInfoVM.createPersonalInfo(name: nameText, email: emailText, phone: phoneText)
            }
            
            dismiss()
        } label: {
            Text("Save")
                .font(.title3)
        }
        
    }
    
}
































struct AccountEditView_Previews: PreviewProvider {
    static var previews: some View {
        PersonalInfoEditView(personalInfoVM: PersonalInfoViewModel(isDemo: true))
            .preferredColorScheme(.dark)
        PersonalInfoEditView(personalInfoVM: PersonalInfoViewModel(isDemo: true))
            .preferredColorScheme(.light)
    }
}
