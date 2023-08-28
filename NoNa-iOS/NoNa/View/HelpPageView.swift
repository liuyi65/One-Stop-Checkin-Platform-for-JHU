//
//  HelpPage.swift
//  NoNa
//
//  Created by WYL on 2023/4/19.
//

import Foundation
import SwiftUI

struct HelpPageView: View{
    @ObservedObject var chatVM: ChatViewModel
    @State var nameText: String = ""
    
    var body: some View{
        VStack{
            ScrollView{
                //TODO
                ForEach(chatVM.chatList){chat in
                    chatCard(chatInfo: chat)
                        .aspectRatio(2/1, contentMode: .fit)
                }
            }
            Spacer()
            VStack{
                Divider()
                HStack{
                    Section{
                        TextField("Enter your question here", text: $nameText)
                            .padding(.leading)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                    }
                    
                    Spacer()
                    let text = chatVM.processing ? "Waiting" : "Send"
                    Text(text)
                        .fontWeight(.semibold)
                        .foregroundColor(Color.white)
                        .padding(.vertical, 4.0)
                        .frame(width: 80)
                        .nonaButton()
                        .frame(width: 80)
                        .padding(.horizontal)
                        .onTapGesture {
                            if(chatVM.processing){
                                return
                            }
                            chatVM.sendMessage(message: nameText)
                            nameText = ""
                        }
                        
                }
                .padding(/*@START_MENU_TOKEN@*/.bottom/*@END_MENU_TOKEN@*/)
            }
        }
    }
    
//    var background(chatInfo: Chat): some View {
//            if (chatInfo.position == .right) {
//                return Color.blue.opacity(0.25)
//            } else {
//                return Color.gray.opacity(0.25)
//            }
//        }
    
    func chatCard(chatInfo: Chat) -> some View{
        HStack{
            
            if (chatInfo.position == .right){
                Spacer()
            }
            let alignment = chatInfo.position == .right ? Alignment.trailing : .leading
            let color = chatInfo.position == .right ? Color("NonaClassic") : Color(UIColor.lightGray)
            HStack{
                Text(chatInfo.message)
                    .padding(.horizontal)
                    .padding(.vertical, 5)
                    .background(color)
                    .cornerRadius(5)
            }.frame(width: 300, alignment: alignment)
                
            if (chatInfo.position == .left){
                Spacer()
            }
            
        }
        .padding(.horizontal)
        
        
    }
}

struct HelpPageView_Previews: PreviewProvider {
    static var previews: some View {
        HelpPageView(chatVM: ChatViewModel(isDemo: true), nameText: "")
            .preferredColorScheme(.dark)
        HelpPageView(chatVM: ChatViewModel(isDemo: true), nameText: "")
            .preferredColorScheme(.light)
    }
}
