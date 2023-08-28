import React, { Component } from 'react';
import StickyBox from "react-sticky-box";
import { Link } from 'react-router-dom';
import userPic from "./assert/user1.jpg";
import { useState, useEffect } from "react";
import BusServerConnector from './ServerConnector';
import { useLocation } from "react-router-dom";
import './style.css'
function BookingsMentee (){



  const [data, setData] = useState([])
  var [order, setOrder] = useState();
  useEffect(() => {
    async function fetchValue() {
      let connector = BusServerConnector.getInstance()
    

      const orders_by_service = await connector.get_all_orders_by_service(parseInt(1));
      setOrder(orders_by_service)
      let newData = [];
  for (let i in orders_by_service) {
    const service = orders_by_service[i];
    const card  = {
      key: i,
      order_id: service.order_id,
      status: service.status === 'Confirmed' ? '1' : service.status === 'Pending' ? '2' : '3',
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

const handleStatusChange = (customer, status) => {
  let updatedStatus;
  if (status === "checkin") {
    updatedStatus = "1";
  } else if (status === "pending") {
    updatedStatus = "2";
  } else if (status === "rejected") {
    updatedStatus = "3";
  }


  const newData = data.map((item) => {
    if (item.order_id == customer.order_id) {
      return {
        ...item,
        status: updatedStatus,
      };
    } else {
      return item;
    }

  });

  setData(newData);

};

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
       return ( 
         <div>
          <div className="breadcrumb-bar">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-md-12 col-12">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page" style={{fontSize:'20px'}}>MainPage</li>
                  <li className="breadcrumb-item active" aria-current="page" style={{fontSize:'20px'}}>Appointment</li>
  
                  </ol>
                </nav>
                <h2 className="breadcrumb-title">Appointment</h2>
              </div>
            </div>
          </div>
        </div>
         {/* /Breadcrumb */}
         {/* Page Content */}
         <div className="content">
           <div className="container-fluid">
             <div className="row">
               {/* Sidebar */}
               <div className="col-md-5 col-lg-4 col-xl-3">
                  <StickyBox offsetTop={20} offsetBottom={20}>
                    <div className="profile-sidebar" style={{height:"620px"}}>
                      <div className="user-widget">
                        <div className="pro-avatar">NONA</div>
                        <div className="user-info-cont">
                          <h4 className="usr-name">{customer.name}</h4>
                          <p className="mentor-type">{customer.phone}</p>
                        </div>
                        <div className="user-info-cont">
                          <h4 className="usr-name">Extra Requirement: {customer.comment}</h4>

                        </div>
                        <div className="user-info-cont">
                        <div className="user-info-cont" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <span className="btn btn-sm bg-info-light" onClick={() => {
                            handleStatusChange(customer, "checkin");
                          }}>
                            CHECK-IN   
                          </span>
                          <span className="pending" style={{ cursor: 'pointer' }} onClick={() => {
                            handleStatusChange(customer, "pending");
                          }}>
                            PENDING
                          </span>
                          <span className="reject" style={{ cursor: 'pointer' }}  onClick={() => {
                            handleStatusChange(customer, "rejected");
                          }}>
                            REJECTED
                          </span>
                        </div>
                        </div>
                      </div>
                    </div>
                  </StickyBox>
                </div>
               {/* /Sidebar */}
               {/* Booking summary */}
               <div className="col-md-7 col-lg-8 col-xl-9">
                 <h3 className="pb-3">Booking Summary</h3>
                 {/* Mentee List Tab */}
                 <div className="tab-pane show active" id="mentee-list">
                   <div className="card card-table">
                     <div className="card-body">
                       <div className="table-responsive">
                         <table className="table table-hover table-center mb-0">
                           <thead>
                             <tr>
                               <th>CUSTOMER LISTS</th>
                               <th>SCHEDULED DATE</th>
                               <th className="text-center">SCHEDULED TIMINGS</th>
                               <th className='text-center'>SERVICE ID</th>
                               <th className='text-center'>SLOT ID</th>
                               <th className="text-center">STATUS</th>

                 
                             </tr>
                           </thead>
                           <tbody>
                           {/* {data.map((item) => {
                                  return (
                                      <>
                                          <span style={{fontSize: 20, color: "rgb(86,86,86)"}}>
                                            <span style={{paddingLeft: 8}}>{item.order_id}</span>
                                            <span style={{paddingLeft: 8}}>{item.starts}</span>
                                          </span>
                                      </>
                                  )
                                })} */}
                                {data.map((item) => {
                                  return (
                                      <>
                                    <tr>
                                      <td>
                                        <h2 className="table-avatar">
                                          <Link className="avatar avatar-sm mr-2"><img className="avatar-img rounded-circle" src={userPic} alt="User Image" /></Link>
                                          <Link to={{ state: { name: item.name } } }  onClick={() => handlecustomer(item)}>{item.name}<span>{item.email}</span></Link>		
                                        </h2>
                                      </td>
                                      <td>{item.startsDate}</td>
                                      <td className="text-center"><span className="pending">{item.startsTime}</span></td>
                                      <td className="text-center">{item.service_id}</td>
                                      <td className="text-center">{item.time_slot_id}</td>
                                      <td className="text-center">
                                      {item.status == "1" ? (
                                        <span className="btn btn-sm bg-info-light"><i className="far fa-eye" />
                                        CHECK-IN   </span>
                                      ) : item.status == "2" ? (
                                        <span className="pending">PENDING</span>
                                      ) : (
                                        <span className="reject">REJECTED</span>
                                      )}
                                    </td>
                                    </tr>
                                      </>
                                  )
                                })}
                           </tbody>
                         </table>		
                       </div>
                     </div>
                   </div>
                 </div>
                 {/* /Mentee List Tab */}
               </div>
               {/* /Booking summary */}
             </div>
           </div>
         </div>		
         {/* /Page Content */}
       </div>
       );
    }
 
 
 export default BookingsMentee;
