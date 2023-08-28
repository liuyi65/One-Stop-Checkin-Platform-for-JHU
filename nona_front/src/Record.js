import React, {useEffect, useState} from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Card from 'react-bootstrap/Card';
import logo from './logo.svg';
import Container from 'react-bootstrap/Container';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import useFetchServices from "./server/FetchServices"
import useFetchRecords from "./server/FetchRecords"
import StickyBox from "react-sticky-box";
import { Link } from 'react-router-dom';
import userPic from "./assert/user1.jpg";
import BusServerConnector from './ServerConnector';
import { useLocation } from "react-router-dom";
import './style.css'
function Record (){
const [data, setData] = useState([])
  var [order, setOrder] = useState();
  let connector = BusServerConnector.getInstance()
  useEffect(() => {
    async function fetchValue() {
      connector = BusServerConnector.getInstance()
      const orders_by_service = await connector.get_all_orders();
      setOrder(orders_by_service)
      let newData = [];
  for (let i in orders_by_service) {
    const service = orders_by_service[i];
    const card  = {
      key: i,
      order_id: service.order_id,
      status: service.status === 'Confirmed' ? '1' : service.status === 'Ready' ? '2' :service.status === 'Progressing' ? '3' :
      service.status === 'Waiting' ? '4' :service.status === 'Cancelled' ? '5' :service.status === 'Completed' ? '6' : '7',
      time_slot_id: service.time_slot_id,
      service_id: service.service_id,
      starts: service.starts,
      email: service.email,
      name:service.name,
      phone:service.phone,
      comment:service.comment,
    }
    const startsParts = service.starts.split(", ");
    card.startsTime = startsParts[1].split(" ")[1];
    card.startsDate = startsParts[0] + " " + startsParts[1].split(" ")[0]
    newData.push(card) 
  }

  setData(newData)

    }
fetchValue();
}, []);


const [customer, setCustomer] = useState({
  name: '',
  phone: '',
  comment:'',
  status:'',
  key: '',
  order_id: '',
  status: '',
  time_slot_id: '',
  service_id: '',
  starts: '',
  email: '',
  name:'',
  phone:'',
  comment:'',
  startsTime:'',
  startsDate:'',
});

  const handlecustomer = (item) => {
    setCustomer(item);
    
  };

  useEffect(() => {
    if (data.length > 0) {
      setCustomer({
        order_id:data[0].order_id,
        name: data[0].name,
        phone: data[0].phone,
        comment: data[0].comment,
        status: data[0].status,
      });
    }
  }, [data]);



  var [services, setServices] = useState();
  var [currecords, setCurrecords] = useState([]);
  var [allrecords, fetchRecords] = useFetchRecords([]);
  let serviceList = useFetchServices();

  useEffect(() => {
    console.log("service", serviceList);
    setServices(serviceList);

    fetchRecords(serviceList);
    console.log("all", allrecords);
  },[serviceList]);

  const handleClick = (event) => {
    let id = event.currentTarget.getAttribute('href');
    id = id.substring(1);
    console.log('href',id)

    setCurrecords(allrecords[id]);
    console.log('curr',allrecords[id])
  }

    return(
  <div>
    <div>
      <div className="breadcrumb-bar">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-12 col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                <li className="breadcrumb-item active" aria-current="page" style={{fontSize:'20px'}}>MainPage</li>
                <li className="breadcrumb-item active" aria-current="page" style={{fontSize:'20px'}}>Record</li>
                </ol>
              </nav>
              <h2 className="breadcrumb-title">Record</h2>
            </div>
          </div>
        </div>
      </div>
       <div className="content">
         <div className="container-fluid">
           <div className="row">
             <div className="col-md-5 col-lg-4 col-xl-3">
                <StickyBox offsetTop={20} offsetBottom={20}>
                  <div className="profile-sidebar" >
                    <div className="user-widget">
                      <div className="pro-avatar">NONA</div>
                      <div className="user-info-cont">
                        <h4 className="usr-name">{customer.name}</h4>
                        <p className="mentor-type">{customer.phone}</p>
                      </div>
                      <div className="user-info-cont">
                        <h4 className="usr-name">Extra Requirement: {customer.comment}</h4>
                        {serviceList.map((service) => (
                        <ListGroup.Item action href={`#${service.service_id}`} onClick={handleClick}  style={{ border: "1px solid #ccc",
                        borderRadius: "10px",
                        backgroundColor: "#f8f9fa",
                        color: "#212529",
                        fontWeight: "bold",
                        padding: "10px",
                        marginBottom: "10px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        transition: "box-shadow 0.3s ease",
                        cursor: "pointer", }}>
                        {service.name}
                      </ListGroup.Item>
                      ))}
                      </div>
                    </div>
                  </div>
                </StickyBox>
              </div>
              
             <div className="col-md-7 col-lg-8 col-xl-9">
               <h3 className="pb-3">Booking Summary</h3>
              
                      
                  <div className="tab-pane show active" id="mentee-list">
                   <div className="card card-table">
                     <div className="card-body">
                       <div className="table-responsive">
                         <table className="table table-hover table-center mb-0">
                           <thead>
                             <tr>
                               <th className="text-center">Customer Name</th>
                               <th className="text-center">Status</th>
                               <th className="text-center">Date</th>
                               <th className="text-center">Detail Information</th>
                             </tr>
                           </thead>
                           <tbody>
                         {
                            currecords && currecords.length > 0 ? (
                              currecords.map((record) => {
                                
                                if (!record.key) {
                                  console.log('1')
                                  return <div> <h1 style={{ fontSize: '4442px' }}>No record found</h1></div>;
                                }

                                return  <>
                          
                              
                              <tr>
                                <td className="text-center">{record.description.name}</td>
                                <td className="text-center">{record.status}</td>
                                <td className="text-center">{record.starts}</td>   
                                <td style={{ textAlign: 'left' }}>
                                <div className="text-center">
                                  <Accordion style={{ overflow: 'hidden' }}>
                                    <Accordion.Header>Customer's information</Accordion.Header>
                                    <Accordion.Body style={{ height: '0px', transition: 'height 0.3s' }}>
                                      <div style={{ marginTop: '-10px' }}>
                                        email: {record.description.email}, phone: {record.description.phone}, comment: {record.description.comment}
                                      </div>
                                    </Accordion.Body>
                                  </Accordion>
                                </div>
                                </td>
                              </tr>
                                </>
                              })
                            ): (
                              <div><h1 style={{ fontSize: '22px', textAlign:'right'}}>No record found</h1></div>
                            )
                          }
                         </tbody>
                         </table>		
                       </div>
                     </div>
                   </div>
                 </div>  
             </div>
           </div>
         </div>
       </div>		
     </div>
        <div data-testid="record-page">
    </div>
  </div>
    );
}

export default Record;