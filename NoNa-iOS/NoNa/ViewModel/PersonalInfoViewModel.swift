//
//  PersonalInfoViewModel.swift
//  NoNa
//
//  Created by WYL on 2023/4/7.
//

import Foundation
import FirebaseAuth
import Combine

class PersonalInfoViewModel: ObservableObject{
    @Published var personInfo: [PersonalInformation] = []
    var cancellable: AnyCancellable?
    
    init(isDemo: Bool = false){
        if (isDemo){
            personInfo.append(PersonalInformation(infoID: 1001, name: "Yinglong", phone: "8000001234", email: "wyl@gmail.com"))
            personInfo.append(PersonalInformation(infoID: 1234, name: "Customer_name", phone: "8822882288", email: "exmaple@example.com"))
            return
        }
        onLoad()
    }
    func onLoad(selectLast: Bool = false){
        Auth.auth().currentUser!.getIDToken{ token, error in
            self.cancellable = DataManager.instance.getAllPerson(token: token!){ personalInfo in
                self.personInfo = personalInfo
                if (DataManager.instance.getSelectedPerson() == nil && !self.personInfo.isEmpty){
                    DataManager.instance.setSelectedPerson(personInfo: self.personInfo.first!)
                }
                if(selectLast){
                    DataManager.instance.setSelectedPerson(personInfo: self.personInfo.last!)
                }
            }
        }
        
    }
    
    func editPersonalInfo(infID: Int, name: String, email: String, phone: String){
        Auth.auth().currentUser!.getIDToken{token, error in
            self.cancellable = DataManager.instance.modifyPersonInfo(token: token!, infID: infID, name: name, email: email, phone: phone){err in
                self.onLoad()
            }
        }
    }
    
    func createPersonalInfo(name: String, email:String, phone: String){
        Auth.auth().currentUser!.getIDToken{token, error in
            self.cancellable = DataManager.instance.createPersonalInfo(token: token!, name: name, email: email, phone: phone){err in
                print(err)
                self.onLoad(selectLast: true)
            }
        }
    }
    
//    func deletePersonalInfo(infID: Int){
//        Auth.auth().currentUser!.getIDToken{token, error in
//            DataManager.instance.deletePersonInfo(token: token!, infoID: infID){err in
//                print(err)
//                self.onLoad()
//            }
//            
//        }
//    }
    
    func selectPersonalInfo(person: PersonalInformation){
        DataManager.instance.setSelectedPerson(personInfo: person)
    }
    
    deinit{
        if cancellable != nil{
            cancellable!.cancel()
        }
    }
}
