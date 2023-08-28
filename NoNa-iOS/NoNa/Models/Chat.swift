//
//  Chat.swift
//  NoNa
//
//  Created by WYL on 2023/4/21.
//

import Foundation

struct Chat: Identifiable{
    var id = UUID()
    
    enum BubblePosition {
        case left
        case right
    }
    var message: String
    var position: BubblePosition
    
    init(message: String, position: BubblePosition) {
        self.message = message
        self.position = position
    }
}
