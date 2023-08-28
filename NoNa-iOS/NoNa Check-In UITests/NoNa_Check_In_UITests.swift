//
//  NoNa_Check_In_UITests.swift
//  NoNa Check-In UITests
//
//  Created by WYL on 2023/5/6.
//

import XCTest

final class NoNa_Check_In_UITests: XCTestCase {

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.

        // In UI tests it is usually best to stop immediately when a failure occurs.
        continueAfterFailure = false

        // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func testExample() throws {
        // UI tests must launch the application that they test.
        let app = XCUIApplication()
        app.launch()

        // Use XCTAssert and related functions to verify your tests produce the correct results.
        
        XCTAssert(app.staticTexts["We found these amazing places for you"].exists)
        
        let tabBar = app.tabBars["Tab Bar"]
        tabBar.buttons["Browse"].tap()

        XCTAssert(app.staticTexts["All Categories"].exists)

        let calendarButton = tabBar.buttons["Calendar"]
        calendarButton.tap()

        let accountButton = tabBar.buttons["Account"]
        accountButton.tap()

        tabBar.buttons["Home"].tap()
        app.buttons["Search"].tap()


        app.textFields.firstMatch.tap()

        app.keys["A"].tap()
        app.keys["b"].tap()
        app.keys["c"].tap()

        let backButton = app.navigationBars.buttons.element(boundBy: 0)
        backButton.tap()

        
        
        app.descendants(matching: .any)["BusinessHomeItem"].firstMatch.tap()
        sleep(5)
        app.descendants(matching: .any)["ServiceListItem"].firstMatch.tap()
        sleep(5)
        app.descendants(matching: .any)["AppointmentTimeButton"].firstMatch.tap()
        app.descendants(matching: .any)["AppointmentConfirmButton"].firstMatch.tap()
        

        app.textFields["Email Address"].tap()
        app.keys["h"].tap()
        app.keys["y"].tap()
        app.keys["u"].tap()
        app.keys["t"].tap()
        app.keys["e"].tap()
        app.keys["s"].tap()
        app.keys["t"].tap()
        app.keys["@"].tap()
        app.keys["e"].tap()
        app.keys["x"].tap()
        app.keys["a"].tap()
        app.keys["m"].tap()
        app.keys["p"].tap()
        app.keys["l"].tap()
        app.keys["e"].tap()
        app.keys["."].tap()
        app.keys["c"].tap()
        app.keys["o"].tap()
        app.keys["m"].tap()

        app.secureTextFields["Password"].tap()
        app.keys["p"].tap()
        app.descendants(matching: .any)["LogInConfirmButton"].firstMatch.tap()
        XCTAssert(app.staticTexts["Invalid Password"].exists)
        app.secureTextFields["Password"].tap()
        app.keys["a"].tap()
        app.keys["s"].tap()
        app.keys["s"].tap()
        app.keys["w"].tap()
        app.keys["o"].tap()
        app.keys["r"].tap()
        app.keys["d"].tap()
        app.descendants(matching: .any)["LogInConfirmButton"].firstMatch.tap()
        app.descendants(matching: .any)["AppointmentConfirmButton"].firstMatch.tap()
        
        app.descendants(matching: .any)["PersonalInfoSwitcher"].firstMatch.tap()
        app.buttons["New Account"].tap()
        backButton.tap()
        backButton.tap()
        backButton.tap()
        backButton.tap()
        backButton.tap()
        
        
        tabBar.buttons["Browse"].tap()
        app.buttons["Restaurant"].tap()
        backButton.tap()
        
        tabBar.buttons["Account"].tap()
        app.buttons["Past Appointments"].tap()
        backButton.tap()
        app.buttons["Account Information"].tap()
        backButton.tap()
        app.buttons["Help"].tap()
        app.textFields["Enter your question here"].tap()
        app.keys["H"].tap()
        app.keys["e"].tap()
        app.keys["l"].tap()
        app.keys["l"].tap()
        app.keys["o"].tap()
        app.staticTexts["Send"].tap()
        
        backButton.tap()
        app.buttons["Sign Out"].tap()
        app.alerts["Sign Out"].buttons["OK"].tap()

        
    }

//    func testLaunchPerformance() throws {
//        if #available(macOS 10.15, iOS 13.0, tvOS 13.0, watchOS 7.0, *) {
//            // This measures how long it takes to launch your application.
//            measure(metrics: [XCTApplicationLaunchMetric()]) {
//                XCUIApplication().launch()
//            }
//        }
//    }
}
