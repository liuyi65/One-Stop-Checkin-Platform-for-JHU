//
//  CategoryListView.swift
//  NoNa
//
//  Created by WYL on 2023/4/4.
//

import SwiftUI
import FirebaseAuth

struct AccountInfoView: View {
    
    @State var signedIn: Bool = false
    @State var showAlertView: Bool = false
    
    var body: some View {
//        NavigationView{
            VStack{
                ScrollView{
                    if(signedIn){
                        accountPageHeader()
                        LazyVStack(alignment: .leading){
                            NavigationLink{
                                let orderVM = OrderViewModel(past: true)
                                PastAppointmentView(pastAppointmentVM: orderVM)
                            } label: {
                                AccountCardView()
                            }.buttonStyle(.plain)
                            NavigationLink{
                                let personalInfoVM = PersonalInfoViewModel()
                                PersonalInfoSwitchView(personalInfoVM: personalInfoVM)
                            } label: {
                                PersonalInfoView()
                            }.buttonStyle(.plain)
                            NavigationLink{
                                let chatVM = ChatViewModel()
                                HelpPageView(chatVM: chatVM, nameText: "")
                            } label: {
                                HelpView()
                            }.buttonStyle(.plain)
                            
                            
                        }
                        Divider()
                        signout
                        Divider()
                        
                    } else {
                        accountPageHeader()
                        NavigationLink {
                            LoginView()
                        } label: {
                            Text("Log in")
                        }
                    }
                }
            }
            .onAppear{
                signedIn = Auth.auth().currentUser != nil
            }
            .padding(.horizontal)
            .alert("Sign Out", isPresented: $showAlertView){
                Button("OK", role: .none) {
                    try! Auth.auth().signOut()
                    DataManager.instance.clearSelectedPerson()
                    signedIn = Auth.auth().currentUser != nil
                }
                Button("Cancel", role: .cancel){}
            }
//        }
//        .navigationViewStyle(StackNavigationViewStyle())
    }
    func accountPageHeader() -> some View{
        
        HStack{
            Text("Settings")
                .bold()
                .frame(maxWidth: .infinity, alignment: .leading)
            Spacer()
        }
        .font(.largeTitle)
        .padding(.vertical)
        

    }
    
    var signout: some View{
        Button{
            showAlertView = true
        } label: {
            Text("Sign Out")
                .foregroundColor(.red)
                .multilineTextAlignment(.center)
                .font(.title2)
        }
        
    }
    struct AccountCardView: View{
        var content:String = "Past Appointments"

        var body: some View{
            
            HStack{
                Image(systemName: "list.bullet.rectangle.portrait.fill")
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .padding([.top, .bottom, .trailing])
                    .frame(width: 40, height: 40)
                    .foregroundColor(Color("NonaHighlight"))
                VStack(alignment: .leading){
                    Text(content)
                        .font(.title3)
                        .bold()
                }
                Spacer()
            }
        }
    }

    struct HelpView: View{
        var content:String = "Help"

        var body: some View{
            
            HStack{
                Image(systemName: "questionmark.bubble.fill")
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .padding([.top, .bottom, .trailing])
                    .frame(width: 40, height: 40)
                    .foregroundColor(Color("NonaHighlight"))
                VStack(alignment: .leading){
                    Text(content)
                        .font(.title3)
                        .bold()
                }
                Spacer()
            }
        }
    }

    struct PersonalInfoView: View{
        var content:String = "Account Information"

        var body: some View{
            HStack{
                Image(systemName: "person.badge.shield.checkmark.fill")
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .padding([.top, .bottom, .trailing])
                    .frame(width: 40, height: 40)
                    .foregroundColor(Color("NonaHighlight"))
                VStack(alignment: .leading){
                    Text(content)
                        .font(.title3)
                        .bold()
                }
                Spacer()
            }
        }
    }

}


struct AccountInforView_Previews: PreviewProvider {
    static var previews: some View {
        AccountInfoView()
            .preferredColorScheme(.dark)
        AccountInfoView()
            .preferredColorScheme(.light)
    }
}
