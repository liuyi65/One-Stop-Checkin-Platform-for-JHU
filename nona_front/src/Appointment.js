import React, {Component} from 'react';
import StickyBox from "react-sticky-box";
import {Link} from 'react-router-dom';
import userPic from "./assert/user1.jpg";
import {useState, useEffect} from "react";
import BusServerConnector from './ServerConnector';
import {useLocation} from "react-router-dom";
import './style.css'
import useFetchServices from "./server/FetchServices";

function Appointment() {
    const [data, setData] = useState([]);
    const [week, setWeek] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);

    const [nameMap, setCurNameMap] = useState({});
    const [priceMap, setCurPriceMap] = useState({});
    const [descMap, setCurDescMap] = useState({});
    var [order, setOrder] = useState();
    const [selectedOption, setSelectedOption] = useState('');
    const handleCheckboxChange = (e) => {
        const value = e.target.value;

        setSelectedOption(value === selectedOption ? '' : value);
        searchCheckbox(value);
    };
    let connector = BusServerConnector.getInstance()
    useEffect(() => {
        async function fetchValue() {
            connector = BusServerConnector.getInstance()
            // const orders_by_service = await connector.get_all_orders_by_service(parseInt(2));
            const orders_by_service = await connector.get_all_orders();
            setOrder(orders_by_service)
            const serv = await connector.get_services_with_all();
          // get service name
          const service_map = []
          for (let key in serv) {
            const service = serv[key];
            service_map[service['service_id']] = service['name']
          }
          setCurNameMap(service_map);
          // get base price of each service
          const price_map = []
          for (let key in serv) {
            const service = serv[key];
            price_map[service['service_id']] = service['base_price']
          }
          setCurPriceMap(price_map);
          // get description of each service
          const desc_map = []
          for (let key in serv) {
            const service = serv[key];
            desc_map[service['service_id']] = service['description']
          }
          setCurDescMap(desc_map);
            let newData = [];
            for (let i in orders_by_service) {
                const service = orders_by_service[i];
                const card = {
                    key: i,
                    order_id: service.order_id,
                    status: service.status === 'Confirmed' ? '1' : service.status === 'Ready' ? '2' : service.status === 'Progressing' ? '3' :
                        service.status === 'Waiting' ? '4' : service.status === 'Cancelled' ? '5' : service.status === 'Completed' ? '6' : '7',
                    time_slot_id: service.time_slot_id,
                    service_id: service.service_id,
                    starts: service.starts,
                    email: service.email,
                    name: service.name,
                    service_name:service_map[service.service_id],
                    phone: service.phone,
                    comment: service.comment,
                    price:price_map[service.service_id]
                }
                if(card.status === '6' || card.status === '7'){
                    continue;
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
    const [searchInput, setSearchInput] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);

    const searchItems = (searchValue) => {
    setSearchInput(searchValue)
    console.log(searchInput)
    if (searchValue !== '') {
            const filteredData = data.filter((item) => {
                 return Object.values(item).join('').toLowerCase().includes(searchValue.toLowerCase())
            })
            setFilteredResults(filteredData)
    }
    else{
            setFilteredResults(data)
    }
  };
    const [weekdayCheck, setWeekdayCheck] = useState("");
    const searchCheckbox = (searchValue) => {
    if (weekdayCheck !== searchValue) {
      setWeekdayCheck(searchValue);
      setSearchInput(searchValue)
      const filteredData = data.filter((item) => {
           return Object.values(item).join('').toLowerCase().includes(searchValue.toLowerCase())
      })
      setFilteredResults(filteredData)
    }
    else{
      setWeekdayCheck("");
      setSearchInput('')
      // console.log(checked)
      setFilteredResults(data)
    }
  };
    const [currentSortingKey, setCurrentSortingKey] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");
    const handleSort = (sortingKey) => {
        const newSortDirection =
            currentSortingKey === sortingKey && sortDirection === "asc"
                ? "desc"
                : "asc";
        setCurrentSortingKey(sortingKey);
        setSortDirection(newSortDirection);

        const sortedData = [...data].sort((a, b) => {
            if (a[sortingKey] < b[sortingKey]) {
                return newSortDirection === "asc" ? -1 : 1;
            }
            if (a[sortingKey] > b[sortingKey]) {
                return newSortDirection === "asc" ? 1 : -1;
            }
            return 0;
        });

        setData(sortedData);
    };


    const renderTableHeader = (columnName, sortingKey) => {
        const isCurrentSortingKey = sortingKey === currentSortingKey;
        return (
            <th
                onClick={() => handleSort(sortingKey)}
                style={{cursor: "pointer"}}
            >
                <div className="header-container">
                    {columnName}
                    <div className="arrows-container">
          <span
              className={`arrow arrow-up ${
                  isCurrentSortingKey && sortDirection === "asc" ? "arrow-red" : ""
              }`}
          ></span>
                        <span
                            className={`arrow arrow-down ${
                                isCurrentSortingKey && sortDirection === "desc"
                                    ? "arrow-red"
                                    : ""
                            }`}
                        ></span>
                    </div>
                </div>
            </th>
        );
    };

    const handleStatusQuickChange = async (id, status) => {
        let newStatus;
        if(parseInt(status) == 1){
            newStatus = parseInt(status)+1;
        }else if (parseInt(status) == 2) {
            newStatus = parseInt(status)+1;
        } else if (parseInt(status) == 3) {
            newStatus = parseInt(status)+3;
        } else{
            newStatus = parseInt(status)
        } 
    
            console.log("ssss")


        let updatedquickstatus;
        if (newStatus == "1") {
            updatedquickstatus = "Confirmed";
        } else if (newStatus == "2") {
            updatedquickstatus = "Ready";
        } else if (newStatus == "3") {
            updatedquickstatus = "Progressing";
        } else if (newStatus == "6") {
            updatedquickstatus = "Completed";
        }
        console.log(status)
        console.log(newStatus)
        try {
          console.log("sssssssssssss")
          const response = await connector.change_order_state(id, updatedquickstatus);
           if (response && response.status === "success") {
            setData(prevData => {
                const newData = prevData.map((item) => {
                if (item.order_id == id) {
                    return {
                    ...item,
                    status: newStatus,
                    };
                } else {
                    return item;
                }
                });
                return newData;
            });
          } else {
            console.log('Error updating order status on the server');
          }
        } catch (error) {
          console.error('Error calling change_order_state:', error);
        }
        window.location.reload();
      };

    const handleStatusChange = async (customer, status) => {
        let updatedStatus;
        if (status == "Confirmed") {
            updatedStatus = "1";
        } else if (status == "Ready") {
            updatedStatus = "2";
        } else if (status == "Progressing") {
            updatedStatus = "3";
        } else if (status == "Waiting") {
            updatedStatus = "4";
        } else if (status == "Cancelled") {
            updatedStatus = "5";
        } else if (status == "Completed") {
            updatedStatus = "6";
        } else {
            updatedStatus = "7";
        }
        console.log(updatedStatus)
        try {
            console.log("sssssssssssss")
            console.log(customer.order_id)
            console.log(status)
            const response = await connector.change_order_state(customer.order_id, status);
            if (response && response.status === 'success') {
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
            } else {
                console.log('Error updating order status on the server');
            }
        } catch (error) {
            console.error('Error calling change_order_state:', error);
        }
        window.location.reload();
    };

    const [customer, setCustomer] = useState({
        name: '',
        phone: '',
        comment: '',
        status: '',
        key: '',
        order_id: '',
        time_slot_id: '',
        service_id: '',
        starts: '',
        email: '',
        startsTime: '',
        startsDate: '',
    });
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const handlecustomer = (item) => {
        setSelectedCustomerId(item.order_id);
        setCustomer(item);

    };

    useEffect(() => {
        if (selectedCustomerId) {
            const selectedCustomer = data.find(
                (item) => item.order_id === selectedCustomerId
            );

            if (selectedCustomer) {
                setCustomer(selectedCustomer);
            }
        } else {
            setCustomer({
                name: '',
                phone: '',
                comment: '',
                status: '',
                key: '',
                order_id: '',
                time_slot_id: '',
                service_id: '',
                starts: '',
                email: '',
                startsTime: '',
                startsDate: '',
            });
        }
    }, [data, selectedCustomerId]);
    let serviceList = useFetchServices();
    const [service, setService] = useState([]);
    useEffect(() => {
        let temp = [];
        for(let i in serviceList){
            const single_serv = serviceList[i];
            temp.push(single_serv.name);
        }
        setService(temp);

    }, [service]);

    return (
        <div>
            <div className="breadcrumb-bar">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-md-12 col-12">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item active" aria-current="page"
                                        style={{fontSize: '20px'}}>MainPage
                                    </li>
                                    {/* <li className="breadcrumb-item active" aria-current="page"
                                        style={{fontSize: '20px'}}>Appointment
                                    </li> */}

                                </ol>
                            </nav>
                            <h2 className="breadcrumb-title">MainPage</h2>
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
                                <div className="profile-sidebar" style={{minHeight: "1600px"}}>
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
                                            <div className="user-info-cont" style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-end'
                                            }}>
                                                <select
                                                    className="form-select"
                                                    onChange={(e) => handleStatusChange(customer, e.target.value)}
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>Select status</option>
                                                    <option value="Confirmed" style={{color: 'green'}}>Confirm</option>
                                                    <option value="Ready" style={{color: 'blue'}}>Ready</option>
                                                    <option value="Progressing" style={{color: 'purple'}}>Progressing
                                                    </option>
                                                    <option value="Waiting" style={{color: 'orange'}}>Waiting</option>
                                                    <option value="Cancelled" style={{color: 'red'}}>Cancelled</option>
                                                    <option value="Completed" style={{color: 'darkgreen'}}>Completed
                                                    </option>
                                                    <option value="Missed" style={{color: 'gray'}}>Missed</option>
                                                </select>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="card search-filter">
                              <div className="card-header">
                                <h4 className="card-title mb-0">Search Filter</h4>
                              </div>
                              <div className="card-body">
                                <div className="filter-widget">
                                  <div className="cal-icon">
                                    <input type="text" className="form-control datetimepicker" placeholder="Search Key Words" onChange={(e) => searchItems(e.target.value)}/>
                                  </div>
                                </div>
                                <div className="filter-widget">
                                  <h4>Weekday</h4>
                                  {week.map((week)=>{
                                    return(
                                      <div key = {week}>
                                        <input type="checkbox" name="week"  checked={week === selectedOption} value={week} onChange={handleCheckboxChange} />
                                        <span className="checkmark" /> {week}
                                      </div>
                                    )
                                  })}
                                </div>
                                <div className="filter-widget">
                                  <h4>Select Service</h4>

                                    {service.map((name) => {
                                      return (
                                          <div>
                                              <input type="checkbox" name="week" checked={name === selectedOption} value={name} onChange={handleCheckboxChange} />
                                              <span className="checkmark"/> {name}
                                          </div>
                                        )
                                    })}
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
                                                    {renderTableHeader("CUSTOMER LISTS", "name")}
                                                    {renderTableHeader("SCHEDULED DATE", "startsDate")}
                                                    {renderTableHeader("SCHEDULED TIMINGS", "startsTime")}
                                                    {renderTableHeader("SERVICE ID", "service_id")}
                                                    {renderTableHeader("SLOT ID", "time_slot_id")}
                                                    {renderTableHeader("STATUS", "status")}
                                                    {renderTableHeader("QUICK CHANGE", "status")}
                                                </tr>
                                                </thead>
                                                <tbody>
                                                     {searchInput.length > 0 ? (

                                                        filteredResults.map((item) => {
                                                            return (

                                                            <>
                                                                <tr className={selectedCustomerId === item.order_id ? "selected-row" : ""} onClick={() => handlecustomer(item)}>
                                                                    <td>
                                                                        <h2 className="table-avatar">
                                                                            <Link className="avatar avatar-sm mr-2"><img
                                                                                className="avatar-img rounded-circle"
                                                                                src={userPic} alt="User Image"/></Link>
                                                                            <Link to={{state: {name: item.name}}}
                                                                                  onClick={() => handlecustomer(item)}>{item.name}<span>{item.email}</span></Link>
                                                                        </h2>
                                                                    </td>
                                                                    <td>{item.startsDate}</td>
                                                                    <td className="text-lg-center"><span
                                                                        className="pending">{item.startsTime}</span></td>
                                                                    <td className="text-lg-center">{item.service_name}</td>
                                                                    <td className="text-lg-center">{item.time_slot_id}</td>
                                                                    <td className="text-left" onClick={() => {
                                                                handleStatusQuickChange(customer.order_id, item.status);
                                                                }}>
                                                                        
                                                                    {item.status == "1" ? (
                                                                        <span style={{color: 'green'}}>
                                                                        <i className="far fa-eye"/> Confirm
                                                                        </span>
                                                                    ) : item.status == "2" ? (
                                                                        <span style={{color: 'blue'}}>
                                                                        <i className="far fa-eye"/> Ready
                                                                        </span>
                                                                    ) : item.status == "3" ? (
                                                                        <span style={{color: 'purple'}}>
                                                                        <i className="far fa-eye"/> Progressing
                                                                        </span>
                                                                    ) : item.status == "4" ? (
                                                                        <span style={{color: 'orange'}}>
                                                                        <i className="far fa-eye"/> Waiting
                                                                        </span>
                                                                    ) : item.status == "5" ? (
                                                                        <span style={{color: 'red'}}>
                                                                        <i className="far fa-eye"/> Cancelled
                                                                        </span>
                                                                    ) : item.status == "6" ? (
                                                                        <span style={{color: 'limegreen'}}>Completed</span>
                                                                    ) : (
                                                                        <span style={{color: 'black'}}>Missed</span>
                                                                    )}
                                                                    </td>
                                                                </tr>
                                                            </>
                                                                   )})
                                                                ) : (
                                                           data.map((item) => {
                                                                return (
                                                            <>
                                                        <tr className={selectedCustomerId === item.order_id ? "selected-row" : ""} onClick={() => handlecustomer(item)}>
                                                            <td>
                                                                <h2 className="table-avatar">
                                                                    <Link className="avatar avatar-sm mr-2"><img
                                                                        className="avatar-img rounded-circle"
                                                                        src={userPic} alt="User Image"/></Link>
                                                                    <Link to={{state: {name: item.name}}}
                                                                          onClick={() => handlecustomer(item)}>{item.name}<span>{item.email}</span></Link>
                                                                </h2>
                                                            </td>
                                                            <td>{item.startsDate}</td>
                                                            <td className="text-lg-center"><span
                                                                className="pending">{item.startsTime}</span></td>
                                                            <td className="text-lg-center">{item.service_name}</td>
                                                            <td className="text-lg-center">{item.time_slot_id}</td>
                                                            <td className="text-left" onClick={() => {
                                                                handleStatusQuickChange(customer.order_id, item.status);
                                                                }}>
                                                                {item.status == "1" ? (
                                                                    <span style={{color: 'green'}}><i
                                                                        className="far fa-eye"/>
                                    Confirm   </span>
                                                                ) : item.status == "2" ? (
                                                                    <span style={{color: 'blue'}}><i
                                                                        className="far fa-eye"/>
                                    Ready   </span>
                                                                ) : item.status == "3" ? (
                                                                    <span style={{color: 'purple'}}><i
                                                                        className="far fa-eye"/>
                                    Progressing   </span>
                                                                ) : item.status == "4" ? (
                                                                    <span style={{color: 'orange'}}><i
                                                                        className="far fa-eye"/>
                                    Waiting   </span>
                                                                ) : item.status == "5" ? (
                                                                    <span style={{color: 'red'}}><i
                                                                        className="far fa-eye"/>
                                    Cancelled   </span>
                                                                ) : item.status == "6" ? (
                                                                    <span
                                                                        style={{color: 'limegreen'}}>Completed</span>
                                                                ) : (
                                                                    <span style={{color: 'black'}}>Missed</span>
                                                                )}
                                                            </td>


                                                            <td className="text-left" onClick={() => {
                                                                handleStatusQuickChange(customer.order_id, item.status);
                                                                }}>
                                                               
                                                                {item.status == "1" ? (
                                                                    <button className="appointment-button" style={{color: 'white'}}><i
                                                                        className="far fa-eye"/>
                                   Ready   </button>
                                                                ) : item.status == "2" ? (
                                                                    <button className="appointment-button" style={{color: 'white'}}><i
                                                                        className="far fa-eye"/>
                                    Progressing   </button>
                                                                ) : item.status == "3" ? (
                                                                    <button  className="appointment-button"style={{color: 'white'}}><i
                                                                        className="far fa-eye"/>
                                     Completed   </button>
                                                                ) : item.status == "4" ? (
                                                                    <button  className="appointment-button"style={{color: 'white'}}><i
                                                                        className="far fa-eye"/>
                                   </button>
                                                                ) : item.status == "5" ? (
                                                                    <button style={{color: 'red'}}><i
                                                                        className="far fa-eye"/>
                                    </button>
                                                                ) : item.status == "6" ? (
                                                                    <button
                                                                        style={{color: 'limegreen'}}>Completed</button>
                                                                ) : (
                                                                    <button style={{color: 'black'}}>Missed</button>
                                                                )}
                                                            </td>
                                                         
                                                        </tr>
                                                    </>
                                                        )
                                                           }))}
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


export default Appointment;