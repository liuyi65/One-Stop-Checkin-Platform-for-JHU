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


const MyVerticallyCenteredModal = (props) => {
    let serviceList = useFetchServices();
    var [order, fetchOrderedSlots] = useFetchOrderedSlots();
    const [serviceFile, setFile] = useState(null);
    const service_id = props.id;
    const [showPicUploadSuccess, setShowPicUploadSuccess] = useState(0)
    const [name, setName] = useState(props.name)
    const [price, setPrice] = useState(props.price)
    const [desc, setDesc] = useState(props.desc)
    console.log("in service",service_id,props.name,props.price,props.desc);
    const [showUploadSuccess, setShowUploadSuccess] = useState(0)


    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };
    const handleDescChange = (event) => {
        setDesc(event.target.value);
    };
    const handleSubmit = (event) => {
      event.preventDefault();
        async function submitInfo() {
          const connector = BusServerConnector.getInstance();
          const response = await connector.upload_service_info(name, price, desc, service_id);

          if(response){
            setShowUploadSuccess(1);
            window.location.reload();
          }
          else{
            setShowUploadSuccess(2);
          }
          
        }
        submitInfo();
    }

    async function handleFileChange(event){
        console.log(event)
        let file = event.file.originFileObj;
        setFile(URL.createObjectURL(file));
        let connector = BusServerConnector.getInstance()
        let res = await connector.set_service_image(file, service_id);
        console.log('pic', res);
        setShowPicUploadSuccess(res);
        if(res == 1) window.location.reload();
      }
    var [timebar, setTimeBar] = useState([
        {from: 9, to: 11, ordered: 0, available: 0},
        {from: 11, to: 13, ordered: 0, available: 0},
        {from: 13, to: 15, ordered: 0, available: 0},
        {from: 15, to: 17, ordered: 0, available: 0},
        {from: 17, to: 19, ordered: 0, available: 0},
        {from: 19, to: 21, ordered: 0, available: 0},
    ]);
    useEffect( () => {
        console.log("ssssssssssssssssssssssssssssssssssssssssssss")
        // async function fetchData(){
        //     let res = serviceList.find(service => service.service_id == service_id).available_slots;
        //     //console.log('resssssssssssssss',orderedSlots);
        //     let orderedSlots = await fetchOrderedSlots(service_id);
    
            // let time = [
            //     {from: 9, to: 11, ordered: 0, available: 0},
            //     {from: 11, to: 13, ordered: 0, available: 0},
            //     {from: 13, to: 15, ordered: 0, available: 0},
            //     {from: 15, to: 17, ordered: 0, available: 0},
            //     {from: 17, to: 19, ordered: 0, available: 0},
            //     {from: 19, to: 21, ordered: 0, available: 0},
            // ];
            // if(orderedSlots.length > 0){
            //     for(let ind in orderedSlots){
            //         let input = orderedSlots[ind].slice(0,2);
            //         let entry = time.find(({ from, to }) => input >= from && input < to);
            //         entry.ordered = entry.ordered+1;
            //     }
            // }
            // if(res.length > 0){
            //     for(let ind in res){
            //         let input = res[ind];
            //         let entry = time.find(({ from, to }) => input >= from && input < to);
            //         entry.available = entry.available+1;
            //     }
            // }
            // setTimeBar(time);
            // console.log('bar', time);
        // }
        const fetchImage = async (service_id) => {
            let connector = BusServerConnector.getInstance()
            const image = await connector.get_service_image(service_id);
            console.log('dsad')
            setFile(image);
          };
        // fetchData();
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
          {props.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/*<div*/}
        {/*    style={{*/}
        {/*        height: 200,*/}
        {/*        border: "0.5px solid grey"*/}
        {/*    }}*/}
        {/*    > */}
        {/*    <Space>*/}
        {/*        <Row gutter={32}>*/}
        {/*            <Col span={12}>*/}
        {/*                <div style={{*/}
        {/*                    textAlign: "left",*/}
        {/*                    paddingLeft: 24*/}
        {/*                }}>*/}
        {/*                    <Row>*/}
        {/*                    <Title level={3} style={{marginTop: 16}}>Available time:</Title>*/}
        {/*                    </Row>*/}
        {/*                    <Row>*/}
        {/*                        <Col>*/}
        {/*                            <table style={{borderCollapse: 'collapse'}}>*/}
        {/*                                <thead>*/}
        {/*                                <tr style={{textAlign: "center"}}>*/}
        {/*                                    {timebar.map(({from, to}) => (*/}
        {/*                                        <th key={`${from}-${to}`} style={{width: `${(to - from) * 10}%`}}>*/}
        {/*                                            {`${from}-${to}`}*/}
        {/*                                        </th>*/}
        {/*                                    ))}*/}
        {/*                                </tr>*/}
        {/*                                </thead>*/}
        {/*                                <tbody>*/}
        {/*                                <tr>*/}
        {/*                                    {timebar.map(({from, to, ordered, available}, id) => (*/}
        {/*                                        <td*/}
        {/*                                            key={id}*/}
        {/*                                            style={{*/}
        {/*                                                backgroundColor: ordered==available ? 'rgb(233,136,136)' : 'rgb(237,231,231)',*/}
        {/*                                                padding: 12,*/}
        {/*                                                width: `${(to - from) * 10}%`*/}
        {/*                                            }}*/}
        {/*                                        >*/}
        {/*                                            {ordered}/{available}*/}
        {/*                                        </td>*/}
        {/*                                    ))}*/}
        {/*                                </tr>*/}
        {/*                                </tbody>*/}
        {/*                            </table>*/}
        {/*                        </Col>*/}
        {/*                        <Col>*/}
        {/*                            <div style={{marginLeft: 40}}>*/}
        {/*                                <Space direction={"vertical"}>*/}
        {/*                                    <div>*/}
        {/*                                        <Space>*/}
        {/*                                            <div style={{*/}
        {/*                                                backgroundColor: "rgb(233,136,136)",*/}
        {/*                                                width: 50,*/}
        {/*                                                height: 30*/}
        {/*                                            }}>*/}
        {/*                                            </div>*/}
        {/*                                            : Not Available*/}
        {/*                                        </Space>*/}
        {/*                                    </div>*/}
        {/*                                    <div>*/}
        {/*                                        <Space>*/}
        {/*                                            <div style={{*/}
        {/*                                                backgroundColor: "rgb(237,231,231)",*/}
        {/*                                                width: 50,*/}
        {/*                                                height: 30*/}
        {/*                                            }}>*/}
        {/*                                            </div>*/}
        {/*                                            : Available*/}
        {/*                                        </Space>*/}
        {/*                                    </div>*/}
        {/*                                </Space>*/}
        {/*                            </div>*/}
        {/*                        </Col>*/}
        {/*                    </Row>*/}
        {/*                </div>*/}
        {/*            </Col>*/}
        {/*        </Row>*/}

        {/*        */}

        {/*    </Space>*/}
        {/*</div>*/}
        <div
            style={{
                marginTop: 16,
                height: 230,
                border: "0.5px solid grey"
            }}
        > 
            <Row gutter={32}>
                <Col span={12}>

                    <div style={{
                        textAlign: "left",
                        paddingLeft: 24
                    }}>
                        <Row>
                        <Title level={3} style={{marginTop: 16}}>Change Picture:</Title>
                        </Row>
                        <div style={{minWidth:'740px', display: 'flex', justifyContent: 'center'}}>
                        <Space size={32}>
                            <img src={serviceFile} height={"120"}/>
                        <div className="upload-img">
                            <div style={{ backgroundColor: "rgb(126,161,238)"}} className="change-photo-btn">
                            <Upload name="avatar"
                                        
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        onChange={handleFileChange}
                                        >
                                <span><i className="fa fa-upload" /> Upload Service Photo</span>
                            </Upload>
                            {/* <input type="file" className="upload" /> */}
                            </div>
                            {showPicUploadSuccess == 1 && <div style={{fontWeight: 400, fontSize: "16px", minWidth: '120px'}}>Successfully Upload!</div>}
                            {showPicUploadSuccess == 2 && <div style={{fontWeight: 400, fontSize: "16px", minWidth: '120px'}}>Upload failed, please use pictures of size smaller than 1MB</div>}
                            <small className="form-text text-muted">Allowed JPG, GIF or PNG. Max size of 1MB</small>
                        </div>
                        </Space>
                        </div>
                    </div>
                </Col>
            </Row>


        </div>

        <div
            style={{
                marginTop: 16,
                height: 230,
                width: "100%",
                border: "0.5px solid grey"
            }}
        > 
            <Row gutter={32}>
                <Col span={12}>

                    <div style={{
                        textAlign: "left",
                        paddingLeft: 24
                    }}>
                        <Row>
                        <Title level={3} style={{marginTop: 16}}>Update Service Information:</Title>
                        </Row>
                        <div style={{minWidth:'740px', display: 'flex', justifyContent: 'center'}}>
                        <form onSubmit={handleSubmit}>
                            <div className="row form-row">
                                <div className="col-18 col-md-6">
                                    <div className="form-group">
                                    <label>Service Name</label>
                                    <input type="text" className="form-control" placeholder="Update Service Name" value={name} onChange={handleNameChange} />
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="form-group">
                                    <label>Base Price</label>
                                    <input type="text" className="form-control" placeholder="Update Price" value={price} onChange={handlePriceChange} />
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="form-group">
                                    <label>Description</label>
                                    <input type="text" className="form-control" placeholder="Update Description" value={desc} onChange={handleDescChange} />
                                    </div>
                                </div>
                                
                                <div className="col-12 col-md-6" style={{justifyContent: 'center'}}> 


                                    {/* <div style={{ marginTop:'20px',display: 'flex', alignItems: 'center' }} className="submit-section"></div> */}
                                    <button type="submit" style={{marginTop:'20px',textAlign:'center',alignItems: 'left' }} className="primary-button">Upload Changes</button>

                                    {showUploadSuccess == 1 && <div style={{fontWeight: 400, fontSize: "16px", minWidth: '120px'}}>Successfully Upload!</div>}

                                    {showUploadSuccess == 2 && <div style={{fontWeight: 400, fontSize: "16px", minWidth: '120px'}}>Upload failed, try again</div>}

                                </div>


                            </div>
                        </form>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>

      </Modal.Body>
    </Modal>
  );
}

export default MyVerticallyCenteredModal;