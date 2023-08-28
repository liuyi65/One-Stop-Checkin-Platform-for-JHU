//
//  LocationManager.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-04-21.
//

import Foundation
import CoreLocation
import Combine
import UserNotifications
import MapKit

class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate, UNUserNotificationCenterDelegate {

    private let locationManager = CLLocationManager()
    private let notificationCenter = UNUserNotificationCenter.current()
    @Published var locationStatus: CLAuthorizationStatus?
    @Published var lastLocation: CLLocation?
    @Published var orders: [Int: Order] = [:]

    override init() {
        super.init()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestWhenInUseAuthorization()
        locationManager.requestAlwaysAuthorization()
        locationManager.startUpdatingLocation()
        locationManager.allowsBackgroundLocationUpdates = true
        let options: UNAuthorizationOptions = [.sound, .alert]
        notificationCenter.requestAuthorization(options: options) { result, _ in
            print("Notification Auth Request result: \(result)")
        }
        notificationCenter.delegate = self
    }

    func listeningOrder(order: Order) {
        if orders[order.id] != nil {
            return
        }
        print("listening!")
        order.getLocation { location in
            
            let region = CLCircularRegion(
                center: location,
                radius: 50,
                identifier: UUID().uuidString
            )
            region.notifyOnEntry = true
            
            let notificationContent = UNMutableNotificationContent()
            notificationContent.title = "Preparing for Check In"
            notificationContent.body = "Check in for " + order.service.serviceName + " at " + order.service.busName + "."
            notificationContent.sound = .default
            
            let trigger = UNLocationNotificationTrigger(
                region: region,
                repeats: false
            )
            
            
            let request = UNNotificationRequest(
                identifier: UUID().uuidString,
                content: notificationContent,
                trigger: trigger
            )
            
            self.notificationCenter.add(request) { error in
                if error != nil {
                    print("Error: \(String(describing: error))")
                }
            }
            print(location)
        }
        
        orders[order.id] = order
        
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        print(response)
        completionHandler()
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        print(notification)
        completionHandler(.sound)
    }
    
}

extension CLLocationCoordinate2D {
    func openMapsAppWithDirections(destinationName name: String) {
        let options = [MKLaunchOptionsDirectionsModeKey: MKLaunchOptionsDirectionsModeDriving]
        let placemark = MKPlacemark(coordinate: self, addressDictionary: nil)
        let mapItem = MKMapItem(placemark: placemark)
        mapItem.name = name // Provide the name of the destination in the To: field
        mapItem.openInMaps(launchOptions: options)
    }
}
