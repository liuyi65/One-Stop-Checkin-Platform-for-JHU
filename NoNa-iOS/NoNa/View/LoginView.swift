//
//  LoginView.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-17.
//

import SwiftUI
import FirebaseAuth

struct LoginView: View {
    @State private var email: String = ""
    @State private var pswd: String = ""
    @State private var available = false
    @State private var processing = false
    @State private var errorMessage = ""
    @Environment(\.dismiss) private var dismiss
    var body: some View {
        ZStack{
            if (processing){
                ProgressView()
                .padding(.all)
            }
            loginView()
        }
    }
    
    func loginView() -> some View {
        VStack(alignment: .leading){
            Text("Log in / Register")
                .font(.title)
                .fontWeight(.semibold)
            
            VStack(alignment: .leading, spacing: 2){
                Text("Email")
                TextField("Email Address", text: $email)
                    .textFieldStyle(.roundedBorder)
                    .keyboardType(.emailAddress)
                    .textInputAutocapitalization(.never)
            }.padding(.top)
            
            VStack(alignment: .leading, spacing: 2){
                Text("Password")
                SecureField("Password", text: $pswd)
                    .textFieldStyle(.roundedBorder)
            }
            Text(errorMessage)
                .foregroundColor(.red)
            
            
            Text("Log In")
                .foregroundColor(Color.white)
                .fontWeight(.semibold)
                .padding(.all, 6)
                .nonaButton()
                .onTapGesture {
                    checkPassword()
                    if(!available){
                        return
                    }
                    processing = true
                    login()
                }
                .accessibilityIdentifier("LogInConfirmButton")
            
            Text("Register")
                .foregroundColor(Color.white)
                .fontWeight(.semibold)
                .padding(.all, 6)
                .nonaButton()
                .onTapGesture {
                    checkPassword()
                    if(!available){
                        return
                    }
                    processing = true
                    register()
                    
                }
        }.padding(.horizontal)
    }
    
    func checkPassword(){
        if(email.isEmpty){
            available = false
            errorMessage = "Invalid Email"
            return
        }
        
        if(pswd.count < 6){
            available = false
            errorMessage = "Invalid Password"
            return
        }
        
        available = true
        errorMessage = ""
    }
    
    func login(){
        Auth.auth().signIn(withEmail: email, password: pswd){ token, error in
            if (error != nil){
                available = false
                errorMessage = error!.localizedDescription
                processing = false
                return
            }
            available = true
            errorMessage = ""
            processing = false
            dismiss()
        }
    }
    
    func register(){
        Auth.auth().createUser(withEmail: email, password: pswd) { authResult, error in
            if (error != nil){
                available = false
                errorMessage = error!.localizedDescription
                processing = false
                return
            }
            authResult?.user.getIDToken() { token, error in
                if (error != nil){
                    available = false
                    errorMessage = error!.localizedDescription
                    processing = false
                    return
                }
                DataManager.instance.createUser(token: token!){ success, value in
                    if (!success){
                        available = false
                        errorMessage = value
                        processing = false
                        return
                    }
                    login()
                    processing = false
                }
            }
        }
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView()
    }
}
