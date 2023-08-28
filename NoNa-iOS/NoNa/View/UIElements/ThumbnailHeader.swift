//
//  ThumbnailHeader.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-13.
//

import SwiftUI

struct ThumbnailItem: Identifiable {
    let id = UUID()
    var image: UIImage? = nil
    var description: String? = nil
    var textYOffset: CGFloat = 20
}

struct ThumbnailHeader: View {
    var items: [ThumbnailItem]
    var minSize: CGFloat = 300
    
    
    var body: some View {
        if items.count > 1{
            TabView{
                ForEach(items) { item in
                    ZStack(alignment: .leading){
                        let image = item.image == nil ? Image("DefaultThumbnailImage") : Image(uiImage: item.image!)
                        image
                            .resizable()
                            .frame(minWidth: minSize, minHeight: minSize, maxHeight: minSize)
                            .aspectRatio(contentMode: .fill)
                        if (item.description != nil){
                            Text(item.description!)
                                .font(.largeTitle)
                                .fontWeight(.heavy)
                                .foregroundColor(Color.white)
                                .padding(.all)
                                .offset(y: item.textYOffset)
                        }
                    }
                }
            }.tabViewStyle(.page)
        } else {
            let item = items[0]
            ZStack(alignment: .leading){
                let image = item.image == nil ? Image("DefaultThumbnailImage") : Image(uiImage: item.image!)
                image
                    .resizable()
                    .frame(minWidth: minSize, minHeight: minSize)
                    .aspectRatio(contentMode: .fill)
                    
                if (item.description != nil){
                    Text(item.description!)
                        .font(.largeTitle)
                        .fontWeight(.heavy)
                        .foregroundColor(Color.white)
                        .padding(.all)
                        .offset(y: item.textYOffset)
                }
            }
        }
            
    }
}

struct ThumbnailHeader_Previews: PreviewProvider {
    static var previews: some View {
        ThumbnailHeader(items: [ThumbnailItem(description: "We found these amazing places for you"), ThumbnailItem()]).previewLayout(.sizeThatFits)
    }
}
