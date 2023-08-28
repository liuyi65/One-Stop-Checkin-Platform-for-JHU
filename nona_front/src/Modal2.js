import Modal from 'react-bootstrap/Modal';
import React, { useEffect, useState } from "react";
import './style.css'
import useFetchServices from "./server/FetchServices"
import {Button, Col, Divider, Form, Input, List, Rate, Row, Select, Space} from "antd";
import BusServerConnector from "./ServerConnector"
import Title from "antd/es/typography/Title";
import useFetchOrderedSlots from "./server/FetchOrderedSlots";
import { message, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';


const SlidingWindows = (props) => {
    let serviceList = useFetchServices();
    var [order, fetchOrderedSlots] = useFetchOrderedSlots();
    const [serviceFile, setFile] = useState(null);
    const service_id = props.id;
    
    const [name, setName] = useState(props.name)
    const [price, setPrice] = useState(props.price)
    const [desc, setDesc] = useState(props.desc)
    console.log("in service",service_id,props.name,props.price,props.desc);

    var [timebar, setTimeBar] = useState([
        {from: 9, to: 11, ordered: 0, available: 0},
        {from: 11, to: 13, ordered: 0, available: 0},
        {from: 13, to: 15, ordered: 0, available: 0},
        {from: 15, to: 17, ordered: 0, available: 0},
        {from: 17, to: 19, ordered: 0, available: 0},
        {from: 19, to: 21, ordered: 0, available: 0},
    ]);
    useEffect( () => {
        async function fetchData(){
            let res = serviceList.find(service => service.service_id == service_id).available_slots;
            console.log('resssssssssssssss',orderedSlots);
            let orderedSlots = await fetchOrderedSlots(service_id);
    
            let time = [
                {from: 9, to: 11, ordered: 0, available: 0},
                {from: 11, to: 13, ordered: 0, available: 0},
                {from: 13, to: 15, ordered: 0, available: 0},
                {from: 15, to: 17, ordered: 0, available: 0},
                {from: 17, to: 19, ordered: 0, available: 0},
                {from: 19, to: 21, ordered: 0, available: 0},
            ];
            if(orderedSlots.length > 0){
                for(let ind in orderedSlots){
                    let input = orderedSlots[ind].slice(0,2);
                    let entry = time.find(({ from, to }) => input >= from && input < to);
                    entry.ordered = entry.ordered+1;
                }
            }
            if(res.length > 0){
                for(let ind in res){
                    let input = res[ind];
                    let entry = time.find(({ from, to }) => input >= from && input < to);
                    entry.available = entry.available+1;
                }
            }
            setTimeBar(time);
            console.log('bar', time);
        }
        const fetchImage = async (service_id) => {
            let connector = BusServerConnector.getInstance()
            const image = await connector.get_service_image(service_id);
            console.log('dsad')
            setFile(image);
          };
        fetchData();
        fetchImage(service_id);
        setName(props.name);
        setPrice(props.price);
        setDesc(props.desc);
    },[serviceList,service_id]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {/*Modal heading*/}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
            style={{
                height: 200,
                border: "0.5px solid grey"
            }}
            > 
            <Space>
                <Row gutter={32}>
                    <Col span={12}>
                        <div style={{
                            textAlign: "left",
                            paddingLeft: 24
                        }}>
                            <Row>
                            <Title level={3} style={{marginTop: 16}}>Available time:</Title>
                            </Row>
                            <Row>
                                <Col>
                                    <table style={{borderCollapse: 'collapse'}}>
                                        <thead>
                                        <tr style={{textAlign: "center"}}>
                                            {timebar.map(({from, to}) => (
                                                <th key={`${from}-${to}`} style={{width: `${(to - from) * 10}%`}}>
                                                    {`${from}-${to}`}
                                                </th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            {timebar.map(({from, to, ordered, available}, id) => (
                                                <td
                                                    key={id}
                                                    style={{
                                                        backgroundColor: ordered==available ? 'rgb(233,136,136)' : 'rgb(237,231,231)',
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
                                </Col>

                            </Row>
                        </div>
                    </Col>
                </Row>
            </Space>
        </div>


      </Modal.Body>
    </Modal>
  );
}

export default SlidingWindows;