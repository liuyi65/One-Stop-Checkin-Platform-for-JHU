import React, { useRef } from "react";
import logo from './logo.svg';
import './App.css';
//import ThemeProvider from 'react-bootstrap/ThemeProvider'
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
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
import {PlusSquareOutlined, SettingOutlined} from "@ant-design/icons"
import { Col,Row, Divider,  Input, List, Rate,  Select, Space} from "antd";
import Search from "antd/es/input/Search";
import Title from "antd/es/typography/Title";
import board from "./assert/board.png"
import userPic from "./assert/userPic.jpg";
import share from "./assert/share.png";
import StickyBox from "react-sticky-box";
import MyVerticallyCenteredModal from './Modal'
import SlidingWindows from './Modal2'
import './style.css'
import useFetchServices from "./server/FetchServices";
import useFetchOrderedSlots from "./server/FetchOrderedSlots";

const MainPage = () =>{
  const [searchName, setSearchName] = useState('');
  const [curservice, setCurservice] = useState(0);

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
  };
  function handleButton(id){
    setModalShow(true)
    setCurservice(id);

  }
  const leftMenu = [
    {title: "hair cut"},
    {title: "Perm"},
    {title: "Modeling"},
    {title: "Records of all appointments"},
]

const [data, setData] = useState([]);
const [namemap, setNamemap] = useState([]);
const [pricemap, setPricemap] = useState([]);
const [descmap, setDescmap] = useState([]);
  // const [result, setResult] = useState([]);
  useEffect(() => {
      async function fetchValue() {
        let connector = BusServerConnector.getInstance()
        const result = await connector.get_services_with_all();

        // get service name
        const service_map = []
        for (let key in result) {
          const service = result[key];
          service_map[service['service_id']] = service['name']
        }
        setNamemap(service_map);
        // get service name
        const price_map = []
        for (let key in result) {
          const service = result[key];
          price_map[service['service_id']] = service['base_price']
        }
        setPricemap(price_map);
        // get service name
        const desc_map = []
        for (let key in result) {
          const service = result[key];
          desc_map[service['service_id']] = service['description']
        }
        setDescmap(desc_map);
        // console.log("testtest")
        // console.log(result)
        setResult(result)
        let record = [];
        let newData = [];
        for (let key in result) {
          const service = result[key];
          newData.push({ title: service.name});
        }
        setData(newData);
      }

    fetchValue();
  }, []);



const [week, setWeek] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);


   // const [cards, setCards] = useState([]);
   const [cards, setCards] = useState([]);
   const [modalShow, setModalShow] = useState(false);

    const [filter, setFilter] = useState(null);

    const handleFilterClick = (value) => {
      setFilter(value);
    };
  
    const filteredCards = filter
      ? cards.filter((card) => card.name === filter)
      : cards;
       // console.log(filter)

       const [appoitment, setAppoitment] = useState([])
       var [result, setResult] = useState();
       var [order, setOrder] = useState([]);
       var control = true;
   
   
       const sortItems = (option) => {
           let sortedRecords = [...appoitment];
   
           if (option === "Price") {
               sortedRecords.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
           }
           else if (option === "Time") {
               const weekDays = {
                   "monday": 1,
                   "tuesday": 2,
                   "wednesday": 3,
                   "thursday": 4,
                   "friday": 5,
                   "saturday": 6,
                   "sunday": 7,
               };
   
               sortedRecords.sort((a, b) => {
                   // Compare weekdays
                   const dayDiff = weekDays[a.weekday] - weekDays[b.weekday];
                   if (dayDiff !== 0) {
                       return dayDiff;
                   }
   
                   // Compare hours if weekdays are the same
                   const hourDiff = parseInt(a.hour) - parseInt(b.hour);
                   if (hourDiff !== 0) {
                       return hourDiff;
                   }
   
                   // Compare minutes if hours are the same
                   return parseInt(a.minute) - parseInt(b.minute);
               });
           }
           else if (option === "Name") {
               sortedRecords.sort((a, b) => a.name.localeCompare(b.name));
           }
           else if (option === "Slots") {
               sortedRecords.sort((a, b) => parseFloat(a.slot) - parseFloat(b.slot));
           }
           setAppoitment(sortedRecords);
       };
   
       
  // const [appoitment, setAppoitment] = useState([])

  var [order, setOrder] = useState();
  let connector = BusServerConnector.getInstance();
  let serviceList = useFetchServices();

  var [order, fetchOrderedSlots] = useFetchOrderedSlots();

  useEffect(() => {

    

    async function fetchValue() {
      const orders_by_service = await connector.get_all_orders();
      setOrder(orders_by_service)
      let newData = [];

      // const serv = await connector.get_services_with_all();
      console.log("serviceList is", serviceList)
      for (let i in serviceList) {

          let timmee = [
                {from: 9, to: 11, ordered: 0, available: 0},
                {from: 11, to: 13, ordered: 0, available: 0},
                {from: 13, to: 15, ordered: 0, available: 0},
                {from: 15, to: 17, ordered: 0, available: 0},
                {from: 17, to: 19, ordered: 0, available: 0},
                {from: 19, to: 21, ordered: 0, available: 0},
            ];
           const single_serv = serviceList[i];
          const res = serviceList.find(serv => serv.service_id == single_serv.service_id).available_slots;
          const imageURL = await connector.get_service_image(single_serv.service_id);
          let orderedSlots = await fetchOrderedSlots(single_serv.service_id);

        // // const timechart
        if(orderedSlots.length > 0) {
            for (let ind in orderedSlots) {
                let input = orderedSlots[ind].slice(0, 2);
                let entry = timmee.find(({from, to}) => input >= from && input < to);
                if (entry) {
                    entry.ordered = entry.ordered + 1;
                }
            }
        }
        if (res.length > 0) {
            for (let ind in res) {
                let input = res[ind];
                let entry = timmee.find(({from, to}) => input >= from && input < to);
                if (entry) {
                    entry.available = entry.available + 1;
                }
            }
        }
        // setTimeBar(timmee);
        console.log(timmee)
        const card  = {
            key: i,
            name:single_serv.name,
            order_id: single_serv.order_id,
            pic:imageURL,
            service_id: single_serv.service_id,
            price:single_serv.price,
            description:single_serv.description,
            timebar:timmee
        }
        // console.log(timmee)
        // console.log(card.timebar)

    newData.push(card)

  }

  setAppoitment(newData)

    }
    fetchValue();
  

  }, [serviceList]);


  const [searchInput, setSearchInput] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [weekdayCheck, setWeekdayCheck] = useState(true);

  const searchCheckbox = (searchValue) => {
    // console.log(weekdayCheck)
    if (weekdayCheck) {
      setWeekdayCheck(false);
      setSearchInput(searchValue)
      const filteredData = appoitment.filter((item) => {
           return Object.values(item).join('').toLowerCase().includes(searchValue.toLowerCase())
      })
      setFilteredResults(filteredData)
    }
    else{
      setWeekdayCheck(true);
      setSearchInput('')
      // console.log(checked)
      setFilteredResults(appoitment)
    }
  };


    
    return(
<div>      
        <div>
          <div className="breadcrumb-bar">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-md-8 col-12">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page" style={{fontSize:'20px'}}>Service</li>
                   
                  </ol>
                </nav>
                <h2 className="breadcrumb-title">One Stop Step In</h2>
              </div>
              {/*<div className="col-md-4 col-12 d-md-block d-none">*/}
              {/*  <div className="sort-by">*/}
              {/*    <span className="sort-title">Sort by</span>*/}
              {/*    <span className="sortby-fliter">*/}
              {/*    <select*/}
              {/*          className="select form-control"*/}
              {/*          onChange={(e) => sortItems(e.target.value)}*/}
              {/*      >*/}
              {/*        <option>Select</option>*/}
              {/*        <option className="sorting">Price</option>*/}
              {/*        <option className="sorting">Time</option>*/}
              {/*        <option className="sorting">Name</option>*/}
              {/*        <option className="sorting">Slots</option>*/}
              {/*      </select>*/}
              {/*    </span>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
          </div>
        </div>



        <div className="content">
          <div className="container-fluid">
            <div className="row">
              {/*  <div className="col-md-12 col-lg-2 col-xl-1"></div>*/}

              {/*  /!* /Search Filter *!/*/}
              <div style = {{display:"flex", justifyContent:"center", minWidth:'800px'   }}>
              <div className="col-md-12 col-lg-8 col-xl-9">

                  {appoitment.map((group) => {
                      // console.log('------')
                        return (
                            <div className="middle">
                                <div className="card">
                              <div className="card-body">
                                <div className="mentor-widget">
                                  <div className="user-info-left">
                                    <div className="mentor-img">
                                        {/*<h4 className="usr-name">{group.name}</h4>*/}
                                      <img src={group.pic} className="img-fluid" alt="User Image" />
                                    </div>
                                    <div className="user-info-cont">
                                      <h4 className="usr-name">{group.name}</h4>
                                        <p><span> Price: </span> <i className="far fa-comment" />${group.price} </p>
                                        <p><span> Description: </span> <i className="far fa-comment" />{group.description} </p>
                                    </div>
                                  </div>
                                  <div className="user-info-middle">
                                      <div style={{ height: '100%', display: 'flex', alignItems: 'right', justifyContent: 'right' }} className="mentor-details">
                                          <table style={{borderCollapse: 'collapse'}}>
                                                <thead>
                                                    <tr style={{textAlign: "center"}}>
                                                        {group.timebar.map(({from, to}) =>
                                                            (
                                                            <th key={`${from}-${to}`} style={{width: `${(to - from) * 10}%`}}>
                                                                {`${from}-${to}`}
                                                            </th>
                                                            ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        {group.timebar.map(({from, to, ordered, available}, id) => (
                                                            <td
                                                                key={id}
                                                                style={{
                                                                    backgroundColor: ordered==available ? 'rgb(126,161,238)' : 'rgb(237,231,231)',
                                                                    padding: 12,
                                                                    width: `${(to - from) * 10}%`
                                                                }}
                                                            >
                                                                {ordered}/{available}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                </tbody>
                                                </table>
                                      </div>


                                  </div>
                      {/* <div className="user-info-right">
                          <div className="mentor-details">

                          </div>

                      </div> */}
                        <div>
                            <div style={{paddingLeft:'50px'}} className="mentor-booking">
                                <button className="primary-button" onClick={() => handleButton(group.service_id)}>Details</button>
                            </div>
                        </div>

                    </div>
                  </div>
                </div>
                            </div>

                        )
                    })}
                <MyVerticallyCenteredModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                  id = {curservice}
                  name = {namemap[curservice]}
                  price = {pricemap[curservice]}
                  desc = {descmap[curservice]}
                />
              </div>
                  </div>
            </div>
          </div>
        </div>		
        {/* /Page Content */}
      </div>
  </div>

    );
};

export default MainPage;