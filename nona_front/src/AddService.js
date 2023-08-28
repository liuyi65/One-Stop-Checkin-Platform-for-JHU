import React, { useRef } from "react";

import './App.css';
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
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import BusServerConnector from './ServerConnector';
import { useNavigate } from 'react-router-dom';
import userPic from "./assert/userPic.jpg";

import './style.css'
function AddService() {


  const navigate = useNavigate();
  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];




  const [service, setService] = useState("");
  const [day, setDay] = useState("Monday");
  const [times, setTimes] = useState([""]);
  const [price, setPrice] = useState("");
  const [info, setInfo] = useState("");
  const [card, setCard] = useState(null);
  const [hour, setHour] = useState(null);
  const [minute, setMinute] = useState(null);
  const [slot, setSlots] = useState("");
  const [state, setState] = useState('New York');
  // Inside your component
  const [email, setEmail] = useState('jonathandoe@example.com');
  const [phone, setPhone] = useState('');
  const [messageError, setMessageError] = useState('');


  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const validateInput = (value, isEmail) => {
    const testRegex = isEmail ?/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/ : /^[0-9]{3}-?[0-9]{3}-?[0-9]{4}$/;
    if (testRegex.test(value)) {
      setMessageError('');
    } else {
      const message = isEmail ? "email address format." : "phone number format."
      setMessageError('Please enter a valid ' + message);
    }
  };

  const handleEmailBlur = (event) => {
    validateInput(event.target.value, true);
  };

  const handlePhoneBlur = (event) => {
    validateInput(event.target.value, false);
  };

  const handleStateChange = (event) => {
    setState(event.target.value);
  };



    const handleServiceChange = (event) => {
      setService(event.target.value);
    };
  
    const handleDayChange = (event) => {
      setDay(event.target.value);
    };
  
    const handleTimeChange = (index, event) => {
      const newTime = event.target.value;
      const [hour, minute] = newTime.split(":");
 
      if (hour && minute) {
        const newTimes = [...times]
        newTimes[index] =  newTime;
        setTimes(newTimes);
      }
    };
  
    const handleAddTime = () => {
      setTimes([...times, ""]);
      setSlots([...slot, ""]);
    };

  const handleRemoveTime = () => {
    if (times.length > 1) {
      setTimes(times.slice(0, -1));
      setSlots(slot.slice(0, -1));
    }
  };
  
    const handlePriceChange = (event) => {
      setPrice(event.target.value);
    };
  
    const handleInfoChange = (event) => {
      setInfo(event.target.value);
    };

    
    const [submit, setSubmit] = useState(false)
    
    // const handleFormSubmit = (action) => {
      function handleFormSubmit(action){
      const ret = (event) => {
        async function fetchValue()  {
          event.preventDefault();
          // const { hour, minute } = selectedTime ? selectedTime : { hour:5, minute: 5 };
          const service_time = []
          for(let i in times){
            let time = times[i]
            const [hour, minute] = time.split(":");
            const time_dict = {"hour": hour,
                          "minute": minute,
                          "weekday": day,
                          "slots": slot[i]}
            console.log(time_dict + "output handleFormSubmit")
            service_time.push(time_dict)
          }
          const success = await BusServerConnector.getInstance().create_service(service, info, price, service_time)
          if(success){
            await BusServerConnector.getInstance().refresh_actual_time_slots(2)
            action()
          }
        }

        fetchValue();
      }
      return ret
    };


    return (
        <div>

    <div className="breadcrumb-bar">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-12 col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
              <li className="breadcrumb-item active" aria-current="page" style={{fontSize:'20px'}}>MainPage</li>
              <li className="breadcrumb-item active" aria-current="page" style={{fontSize:'20px'}}>AddService</li>
              </ol>
            </nav>
            <h2 data-testid="AddService" className="breadcrumb-title">AddService</h2>
          </div>
        </div>
      </div>
    </div>
    
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>          
      </div>
        <div className="content">
          <div className="container-fluid">
            <div className="row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="col-md-7 col-lg-8 col-xl-9">
                <div className="card">
                  <div className="card-body">
                    {/* Profile Settings Form */}
                    <form onSubmit={handleFormSubmit(() => {
                        navigate('../SubmitSuccess');
                      })}>
                      <div className="row form-row">
                        {/* <div className="col-12 col-md-12">
                          <div className="form-group">
                            <div className="change-avatar">
                              <div className="profile-img">
                                <img src={userPic} alt="User Image" />
                              </div>
                              <div className="upload-img">
                                <div className="change-photo-btn">
                                  <span><i className="fa fa-upload" /> Upload Photo</span>
                                  <input type="file" className="upload" />
                                </div>
                                <small className="form-text text-muted">Allowed JPG, GIF or PNG. Max size of 2MB</small>
                              </div>
                            </div>
                          </div>
                        </div> */}
                        <div className="col-12 col-md-6" style={{ marginBottom: '10px'}}>
                          <div className="form-group">
                            <label htmlFor="Main Service">Main Service*</label>
                            <input type="text" id = "Main Service" className="form-control" placeholder="Enter Service Name" value={service}
                                   onChange={handleServiceChange} required/>
                          </div>
                        </div>
                        <div className="col-12 col-md-6" style={{ marginBottom: '10px'}}>
                          <div className="form-group">
                            <label>Additional Service</label>
                            <input type="text" className="form-control" defaultValue="" />
                          </div>
                        </div>
                        <div className="col-12 col-md-6" style={{ marginBottom: '10px'}}>
                          <div className="form-group">
                            <label>Additional Service</label>
                            <div className="cal-icon">
                              <input type="text" className="form-control datetimepicker" defaultValue="" />
                            </div>
                          </div>
                        </div >
                        <div className="col-12 col-md-6" style={{ marginBottom: '10px'}}>
                          <div className="form-group">
                          <div>
                            <label htmlFor="Weekday">Weekday*</label>
                            <select id = "Weekday" className="form-control select" defaultValue="Choose..." value={day} onChange={handleDayChange}>
                              <option>Choose...</option>
                              <option>Monday</option>
                              <option>Tuesday</option>
                              <option>Wednesday</option>
                              <option>Thursday</option>
                              <option>Friday</option>
                              <option>Saturday</option>
                              <option>Sunday</option>
                            </select>
                          </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="form-group">
                            <label>Email Address*</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={handleEmailChange}
                                onBlur={handleEmailBlur}
                                required
                            />
                            {messageError && <small className="text-danger">{messageError}</small>}
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="form-group">
                            <label>Mobile*</label>
                            <input
                                type="tel"
                                className="form-control"
                                placeholder="123-456-7890"
                                value={phone}
                                onChange={handlePhoneChange}
                                onBlur={handlePhoneBlur}
                                required
                            />
                            {messageError && <small className="text-danger">{messageError}</small>}
                            {/*<input type="tel" pattern="[0-9]{3}-?[0-9]{3}-?[0-9]{4}" placeholder="123-456-7890"  className="form-control" required/>*/}
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-md-8 d-flex align-items-center">
                            <label
                                style={{
                                  fontWeight: 'bold',
                                  fontSize: '18px',
                                  color: '#333',
                                  letterSpacing: '1px',
                                }}
                            >
                              Times&Slots
                            </label>

                          </div>
                          <div className="col-md-4 d-flex justify-content-end align-items-center">
                            <button
                                type="button"
                                className="btn"
                                style={{ background: 'none', border: 'none', padding: 0}}
                                onClick={handleAddTime}
                            >
                              <svg
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  height="2em"
                                  width="2em"
                                  style={{ verticalAlign: 'middle' }}
                              >
                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12zm10-8a8 8 0 100 16 8 8 0 000-16z"
                                    clipRule="evenodd"
                                />
                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    d="M13 7a1 1 0 10-2 0v4H7a1 1 0 100 2h4v4a1 1 0 102 0v-4h4a1 1 0 100-2h-4V7z"
                                    clipRule="evenodd"
                                />
                              </svg>
                            </button>

                            <button
                                type="button"
                                className="btn"
                                data-testid="addtime"
                                style={{ background: 'none', border: 'none', padding: 0, marginLeft: '10px' }}
                                onClick={handleRemoveTime} 
                            >
                              <svg
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  height="2em"
                                  width="2em"
                                  style={{ verticalAlign: 'middle' }}
                              >
                                <path fill="currentColor" d="M8 11a1 1 0 100 2h8a1 1 0 100-2H8z" />
                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    d="M23 12c0 6.075-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1s11 4.925 11 11zm-2 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                    clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <hr />


                      {times.map((time, index) => (
                      <div key={index}>
                        <div className="col-12">
                          <div className="form-group" style={{ marginBottom: '10px'}}>
                              <label htmlFor={`time${index}`}>Times*: </label>
                              <input className="form-control" type="time" data-testid="testtime" id={`time${index}`} value={time}
                                     onChange={(event) => handleTimeChange(index, event)} required/>
                          </div>
                          <div className="form-group">
                            <label htmlFor={`slot${index}`}>Slots*: </label>
                            <input className="form-control" type="number" data-testid="testslot" min="0" id={`slot${index}`} value={slot[index]}
                                   onChange={(event) =>
                                       setSlots([...slot.slice(0, index), event.target.value, ...slot.slice(index + 1)])}
                                   required/>
                          </div>
                        </div>
                      </div>
                        ))}
                      {/*<button onClick={handleAddTime}>Add Time</button>*/}
                        <hr
                            style={{
                              borderTop: '5px solid #000',
                              borderRadius: '2px',
                              width: '95%',
                              marginLeft: 'auto',
                              marginRight: 'auto',
                              marginTop: '20px',
                              marginBottom: '20px',
                            }}
                        />

                        <div className="col-12" style={{ marginBottom: '10px'}}>
                          <div className="form-group">
                            <label>Address</label>
                            <input type="text" className="form-control" defaultValue="806 Twin Willow Lane" />
                          </div>
                        </div>
                        <div className="col-12 col-md-6" style={{ marginBottom: '10px'}}>
                          <div className="form-group">
                            <label>City</label>
                            <input type="text" className="form-control" defaultValue="Old Forge" />
                          </div>
                        </div>
                        <div className="col-12 col-md-6" style={{ marginBottom: '10px'}}>
                          <div className="form-group">
                            <label>State</label>
                            <select className="form-control" value={state} onChange={handleStateChange}>
                              {usStates.map((usState) => (
                                  <option key={usState} value={usState}>
                                    {usState}
                                  </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="form-group">
                             <label htmlFor="info">Service Information</label>
                             <input type="text" id = "info" className="form-control" placeholder="Any details of service" value={info} onChange={handleInfoChange} />
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="form-group">
                            <label htmlFor="price">Price*</label>
                            <input type="number" id="price" min="0" step='0.01' className="form-control" placeholder="Price in USD" value={price} onChange={handlePriceChange} />
                          </div>
                        </div>
                      </div>
                      <div className="submit-section" style={{ marginTop: '50px' }}>
                        <button style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: '10px',
                        }} type="submit" id = "submit" className="primary-button">Save Changes</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    );
  }
  
  export default AddService;