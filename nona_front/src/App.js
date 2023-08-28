import React, {useState, useEffect} from "react"
import Signup from "./Components/Signup"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router, Route, Routes, useNavigate} from "react-router-dom"
import CompanyPage from "./CompanyPage"
import Mobile from "./Mobile"
import Login from "./Components/Login"
import ForgotPassword from "./Components/ForgotPassword"
import { useAuth } from "./contexts/AuthContext"
import MainPage from "./MainPage"
import Record from "./Record"
import AddService from "./AddService"
import Page2 from "./Page2"
import UserMainPage from "./UserMainPage"
import Appointment from "./Appointment"
import Service from "./Service"
import SubmitSuccess from "./SubmitSuccess"
import Cookies from 'js-cookie';
import Profile from "./Profile"

export default function App() {

  const navigate = useNavigate();
  const { certified } = useAuth();


  return (

    <div>
      <AuthProvider>
              <Routes>
                <Route exact path="/" element={<Login />}/>
                <Route path ="/CompanyPage" element = {<CompanyPage/>}>
                    <Route path ="MainPage" element = {<MainPage/>}/>
                    <Route path ="Record" element = {<Record/>}/>
                    <Route path ="AddService" element = {<AddService/>}/>
                    <Route path ="Appointment" element = {<Appointment/>}/>
                    <Route path ="Service" element = {<Service/>}/>
                    <Route path ="SubmitSuccess" element = {<SubmitSuccess/>}></Route>
                    <Route path ="profile" element = {<Profile/>}></Route>
                </Route>
                
                <Route path ="/Mobile" element = {<Mobile/>}>
                  <Route path ="MainPage" element = {<UserMainPage/>}/>
                  <Route path="Page2" element={<Page2 />}/>
                </Route>
                <Route path="/signup" element={<Signup />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/forgot-password" element={<ForgotPassword />}/>
              </Routes>
            </AuthProvider>

    </div>

  )
}
