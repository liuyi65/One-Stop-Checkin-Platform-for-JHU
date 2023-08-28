//
//  NoNaApp.swift
//  NoNa
//
//  Created by Haoping Yu on 2023-03-05.
//

import SwiftUI
import FirebaseCore
import FirebaseAuth
import CoreGraphics
import CoreLocation
import BackgroundTasks
    


class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        FirebaseApp.configure()
        return true
    }
}



@main
struct NoNaApp: App {
    @Environment(\.scenePhase) private var phase
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    
    init(){
        taskRegistration()
    }

    let persistenceController = PersistenceController.shared
    @StateObject private var locationManager = LocationManager()

    var body: some Scene {
        WindowGroup {
            if UIDevice.current.userInterfaceIdiom == .pad{
                PadView().environment(\.managedObjectContext, persistenceController.container.viewContext)
                    .environmentObject(locationManager)
//                    .onAppear{
//                        taskRegistration()
//                    }
            } else {
                PhoneView().environment(\.managedObjectContext, persistenceController.container.viewContext)
                    .environmentObject(locationManager)
//                    .onAppear{
//                        taskRegistration()
//                    }
            }
        }.onChange(of: phase) { newPhase in
            switch newPhase {
            case .background:
                scheduleAppRefresh()
                print("backend")
            default: break
            }
        }
    }
    
    struct PadView: View {
        var body: some View {
            PhoneView()
                .navigationViewStyle(StackNavigationViewStyle())
        }
    }
    
    struct PhoneView: View {
        @EnvironmentObject private var locationManager: LocationManager
        
        var body: some View {
            NavigationView{
                let bussinessVM = BusinessListViewModel()
                let orderVM = OrderViewModel(past: false, locationManager: locationManager)
                TabView{
                    
                    BusinessHomePageView(bussinessListVM: bussinessVM, orderVM: orderVM)
                        .onAppear {
                            orderVM.onLoad()
                        }
                        .tabItem{
                            Label("Home", systemImage: "house")
                        }
                    CategoryListView(categoryVM: CategoryViewModel(), businessVM: bussinessVM)
                        .tabItem{
                            Label("Browse", systemImage: "list.bullet.rectangle.portrait.fill")
                        }
                    
                    
                    CalendarListView(calendarCardVM: orderVM)
                        .onAppear{
                            orderVM.onLoad()
                        }
                        .tabItem{
                            Label("Calendar", systemImage: "calendar.badge.clock")
                        }
                    AccountInfoView()
                        .tabItem{
                            Label("Account", systemImage: "person.crop.circle.fill")
                        }
                }.onAppear{
                    
                }
            }.navigationViewManager(for: "HomeRoot")
                .onAppear{
                }
        }
    }

}
// Testing:
// e -l objc -- (void)[[BGTaskScheduler sharedScheduler] _simulateLaunchForTaskWithIdentifier:@"com.magicspica.nona.fetchtask"]
extension NoNaApp {
    func scheduleAppRefresh() {
        let request = BGAppRefreshTaskRequest(identifier: "com.magicspica.nona.fetchtask")
        request.earliestBeginDate = Date(timeIntervalSinceNow: 10 * 60)
        do {
              try BGTaskScheduler.shared.submit(request)
           } catch {
              print("Could not schedule app refresh: \(error)")
           }
    }
    
    func taskRegistration(){
        BGTaskScheduler.shared.register(forTaskWithIdentifier: "com.magicspica.nona.fetchtask", using: nil) { task in
            if (Auth.auth().currentUser == nil){
                task.setTaskCompleted(success: true)
                self.scheduleAppRefresh()
                return
            }
            print("Start Back")
            Auth.auth().currentUser?.getIDToken{ token, _ in
                DataManager.instance.getOrderHistory(token: token!, past: false){ orders in
                    let preparedOrders = orders.filter{$0.status == "Ready"}
                    print(preparedOrders)
                    preparedOrders.forEach{ order in
                        locationManager.listeningOrder(order: order)
                    }
                    task.setTaskCompleted(success: true)
                    self.scheduleAppRefresh()
                }
            }
            
        }
    }
    
}
