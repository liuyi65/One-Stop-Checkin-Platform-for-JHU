import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
//import ThemeProvider from 'react-bootstrap/ThemeProvider'
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';
import Form from 'react-bootstrap/Form';
import {Router, Route, Switch, Link,Redirect, Routes,useNavigate  } from 'react-router-dom';
import {Layout, Space} from "antd";
import {Content, Header} from "antd/es/layout/layout";
import facebook from "./assert/facebook.png"
import nona_logo from "./assert/nona_logo.png"
import message from "./assert/message.png"
import notice from "./assert/notice.png"
import user from "./assert/user.png"
import Record from "./Record"
import SubmitSuccess from "./SubmitSuccess"
import MainPage from "./MainPage"
import AddService from "./AddService"
import Appointment from "./Appointment"
import Service from "./Service"
import BusServerConnector from './ServerConnector';
import Title from "antd/es/typography/Title";
import SearchBar from "./SearchBar";

import Profile from "./Profile"

export default function CompanyPage() {
    const navigate = useNavigate();
    const menu = [
        { key: "./CompanyPage/MainPage", label: "Service" },
        { key: "./CompanyPage/Appointment", label: "Mainpage" },
        // { key: "./CompanyPage/Testtt", label: "User's contact" },
        { key: "./CompanyPage/Record", label: "Records" },
        { key: "./CompanyPage/AddService", label: "Add More Service" },
        { key: "./CompanyPage/Profile", label: "Profile" },
        // {
        //     key: "/",
        //     label: "Log Out",
        //     onClick: () => {
        //         BusServerConnector.getInstance().remove_api_key()
        //         navigate("/")
        //     },
        // },
    ];


  return (
  <>
  <Layout>
      <Header style={{
          backgroundColor: "rgb(255, 255, 255)",
          fontSize: "16px",
          textAlign: "center"
      }}>
          <div>
              <span style={{float: "left"}}>
              <img src={nona_logo} height={32} alt={"LOGO"}/>
              </span>
              <span>
                  {menu.map((item) => {
                     if (item.onClick) {
                        return (
                            <button
                                key={item.label}
                                onClick={item.onClick}
                                style={{
                                    backgroundColor: "rgb(255, 130, 77)",
                                    color: "rgb(255, 255, 255)",
                                    border: "none",
                                    marginLeft:'50px',
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    fontSize: "20px",
                                    maxHeight: "40px",
                                }}
                            >
                                {item.label}
                            </button>
                        );
                    }else{
                      return (
                          <a
                              style={{
                                  paddingLeft: 24,
                                  fontSize:'20px',
                                  color: "rgb(0, 0, 0)",
                              }}
                              onClick={()=>{
                                  navigate(`/${item.key}`)
                              }}
                          >
                              {item.label}
                          </a>
                      )
                    }
                  })}
                  
              </span>
              <Space style={{float: "right", paddingTop: 4, paddingLeft: 90}}>
                  <img src={notice} height={24} alt={"notice"}/>
                  <img src={user} height={20} style={{paddingLeft: 8}} alt={"user"}/>
                  <div
                      style={{
                          backgroundColor: "white",
                          borderRadius: "20px",
                          color: "rgb(0, 0, 0)",
                          marginLeft: 8,
                          fontWeight: "bolder",
                          paddingLeft: 6,
                          paddingRight: 6,
                          paddingTop: 3,
                          paddingBottom: 3,
                          height: 24,
                          lineHeight: 1.4,
                          marginBottom: 6
                      }}
                  >
                    <button
                        className="logout-button"
                        onClick={() => {
                            BusServerConnector.getInstance().remove_api_key();
                            navigate("/");
                        }}
                        >
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            d="M8.51428 20H4.51428C3.40971 20 2.51428 19.1046 2.51428 18V6C2.51428 4.89543 3.40971 4 4.51428 4H8.51428V6H4.51428V18H8.51428V20Z"
                            fill="currentColor"
                            />
                            <path
                            d="M13.8418 17.385L15.262 15.9768L11.3428 12.0242L20.4857 12.0242C21.038 12.0242 21.4857 11.5765 21.4857 11.0242C21.4857 10.4719 21.038 10.0242 20.4857 10.0242L11.3236 10.0242L15.304 6.0774L13.8958 4.6572L7.5049 10.9941L13.8418 17.385Z"
                            fill="currentColor"
                            />
                        </svg>
                        </button>


                  </div>
              </Space>
              <span style={{float: "right", marginTop: 4}}>
                  <img src={facebook} height={24} alt={"facebook"}/>
                  <img src={message} height={24} style={{paddingLeft: 8}} alt={"message"}/>
              </span>
          </div>
      </Header>
  </Layout>
<Routes>
    <Route path ="MainPage" element = {<MainPage/>}/>
    <Route path ="Record" element = {<Record/>}/>
    <Route path ="AddService" element = {<AddService/>}/>
    <Route path ="Appointment" element = {<Appointment/>}/>
    <Route path ="Service" element = {<Service/>}/>
    <Route path ="SubmitSuccess" element = {<SubmitSuccess/>}/>
    <Route path ="Profile" element = {<Profile/>}/>
</Routes>




</>

  );
}

