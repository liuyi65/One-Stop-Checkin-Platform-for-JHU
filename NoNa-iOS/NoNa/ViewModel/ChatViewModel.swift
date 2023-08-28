//
//  ChatViewModel.swift
//  NoNa
//
//  Created by WYL on 2023/4/21.
//

import Foundation
import FirebaseAuth
import Combine

class ChatViewModel: ObservableObject{
    @Published var chatList: [Chat] = []
    @Published var processing = false
    var cancellable: AnyCancellable?
    
    
    init(isDemo: Bool = false) {
        if (isDemo){
            chatList.append(Chat(message: "asd", position: .right))
            chatList.append(Chat(message: "Hello, test run Hi there, this is a demo testsssss Hi there, this is a demo testsssssHi there, this is a demo testsssss Hi there, this is a demo testsssss Hi there, this is a demo testsssss Hi there, this is a demo testsssss Hi there, this is a demo testsssss", position: .left))
            return
        }
    }
    func sendMessage(message: String){
        processing = true
        chatList.append(Chat(message: message, position: .right))
        Auth.auth().currentUser!.getIDToken{token, error in
            self.cancellable = DataManager.instance.callChatBot(token: token!, message: message){ botMessage in
                self.chatList.append(Chat(message: botMessage, position: .left))
                self.processing = false
            }
        }
    }
    
    deinit{
        cancellable?.cancel()
    }
}
