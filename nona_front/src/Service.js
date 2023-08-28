import userPic from "./assert/userPic.jpg";
import Title from "antd/es/typography/Title";
import {Button, Col, Divider, Form, Input, List, Rate, Row, Select, Space} from "antd";
import SearchBar from "./SearchBar";
import Search from "antd/es/input/Search";
import {PlusSquareOutlined, SettingOutlined} from "@ant-design/icons";
import board from "./assert/board.png";
import share from "./assert/share.png";
import hair_pic_1 from "./assert/hair-pic-1.png";
import hair_pic_2 from "./assert/hair-pic-2.png";
import star from "./assert/star.png";
import book from "./assert/book.png";
import books from "./assert/books.png";
import {useEffect, useState} from "react";
import share_w from "./assert/share-w.png";
import TextArea from "antd/es/input/TextArea";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import Tab from 'react-bootstrap/Tab';
import useFetchServices from "./server/FetchServices"

import BusServerConnector from "./ServerConnector"
import ListGroup from 'react-bootstrap/ListGroup';
import useFetchOrderedSlots from "./server/FetchOrderedSlots";



const Employee = (props) => {
    var [curservice, setCurservice] = useState(0);
    let serviceList = useFetchServices();
    const [serviceFile, setFile] = useState(null);
    var [orderedSlots, fetchOrderedSlots] = useFetchOrderedSlots();
    
  const handleFileChange = (event) => {
    console.log(event)
    let file = event.file.originFileObj;
    setFile(URL.createObjectURL(file));
    let connector = BusServerConnector.getInstance()
    connector.set_service_image(file, curservice);
  }
    var [timebar, setTimeBar] = useState([
        {from: 9, to: 11, ordered: 0, available: 0},
        {from: 11, to: 13, ordered: 0, available: 0},
        {from: 13, to: 15, ordered: 0, available: 0},
        {from: 15, to: 17, ordered: 0, available: 0},
        {from: 17, to: 19, ordered: 0, available: 0},
        {from: 19, to: 21, ordered: 0, available: 0},
    ]);

    useEffect(() => {
        async function fetchData(){
            if(curservice!=0){
                let res = serviceList.find(service => service.service_id == curservice).available_slots;
                //console.log('resssssssssssssss',orderedSlots);
                let orderedSlots = await fetchOrderedSlots(curservice);

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
        }
        const fetchImage = async () => {
            try {
                var requestOptions = {
                    method: 'GET',
                    redirect: 'follow'
                  };
              const response = await fetch(`http://api.magicspica.com/file/image/services/${curservice}`, requestOptions)
              if (response.ok) {
                const imageData = await response.blob();
                setFile(URL.createObjectURL(imageData));
              } else {
                console.error('Failed to fetch image');
                setFile(null);
              }
            } catch (error) {
              console.error('Failed to fetch image', error);
            }
          };
        fetchImage();
        fetchData();
        
    }, [curservice],[orderedSlots])
    useEffect(() => {
        if (serviceList.length > 0) {
          setCurservice(serviceList[0].service_id);
        }
    }, [serviceList]);
    const handleClick = (event) => {
        let id = event.currentTarget.getAttribute('href');
        id = id.substring(1);
        setCurservice(id);
        console.log('curr service',id);
      }
    const data = [
        {
            name: "Jason",
            job: "Hair Stylist",
            subTitle: "Good at flat head and explosive head",
            pic: userPic,
            point: 4,
            record: 45,
            total: 456,
            hireDate: "5/8/2006",
            desc: "You could enjoy shampoo and haircut for the basic meal.",
            additional: [
                {title: "Advanced shampoo", price: "2.99$", info: "Using advanced instead of normal shampoo."},
                {title: "Shave", price: "3.99$", info: "Trim facial beard."},
                {title: "Perm", price: "14.99$", info: ""}
            ],
            time: [
                {from: 9, to: 11, price: "21USD", free: 0},
                {from: 11, to: 13, price: "22USD", free: 1},
                {from: 13, to: 15, price: "23USD", free: 0},
                {from: 15, to: 17, price: "24USD", free: 1},
                {from: 17, to: 19, price: "45USD", free: 0},
                {from: 19, to: 21, price: "46USD", free: 2},
            ],
            evaluation: [
                {title: "Not very good", rate: 3, time: "12 hours ago"},
                {title: "Great but a bit expensive", rate: 3, time: "1 days ago"},
                {title: "qweqwe Nd", rate: 5, time: "12 hours ago"},
                {title: "qwe qwewe Greaensive", rate: 3, time: "1 days ago"},
            ],
            relevantPic: [
                hair_pic_1,
                hair_pic_2
            ],
            chat: [
                {type: "left", message: "Hello, jack. Nice to meet you.", pic: userPic},
                {type: "right", message: "I will be late for 10 minutes", pic: userPic},
                {type: "left", message: "OK", pic: userPic},
            ]
        },
    ]

    const [info, setInfo] = useState(data[0])

    const leftMenu = [
        {title: "Jason"},
        {title: "Mark"},
        {title: "Roby"},
    ]

    return (
        <div>
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link2">
            <div style={{padding: 16}}>
                <Row gutter={64}>
                    <Col span={5}>
                        <div style={{
                            paddingTop: 75,
                            paddingLeft: 8
                        }}>

                            <div style={{
                                marginTop: 24,
                            }}>

                            <ListGroup role="servicetype">
                                {serviceList.map((service) => (
                                    <ListGroup.Item action href={`#${service.service_id}`} onClick={handleClick} active={curservice == service.service_id}>
                                    {service.name}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            </div>
                        </div>
                    </Col>
                    <Col span={17} style={{textAlign: "center"}}>
                        {/* <div
                            style={{
                                marginTop: 32,
                                backgroundColor: "rgb(235, 248, 255)",
                                height: 200
                            }}
                        >
                            <Row>
                                <Col>
                                    <div style={{
                                        marginTop: 18,
                                        marginLeft: 12,
                                        textAlign: "left",
                                        paddingRight: 40,
                                        width: 200
                                    }}>
                                        <div style={{
                                            color: "rgb(87, 87, 87)",
                                            fontSize: 18,
                                            fontWeight: "bold"
                                        }}>
                                            {info.name}
                                        </div>
                                        <div style={{
                                            color: "rgb(12, 129, 246)",
                                            fontSize: 17,
                                            fontWeight: "bold",
                                            marginTop: 8
                                        }}>
                                            {info.job}
                                        </div>
                                        <div style={{
                                            color: "rgb(130, 130, 130)",
                                            fontSize: 14,
                                            marginTop: 8
                                        }}>
                                            {info.subTitle}
                                        </div>
                                        <div style={{
                                            textAlign: "right",
                                            marginTop: 12,
                                            marginRight: 24
                                        }}>
                                            <img src={info.pic} height={60} alt={"pic"}/>
                                        </div>
                                    </div>
                                </Col>
                                <Col>
                                    <div style={{
                                        marginTop: 64
                                    }}>
                                        <div style={{display: "flex"}}>
                                            <img src={star} height={20} alt={"star"}/>
                                            <span style={{paddingLeft: 8}}>{info.point} / 5 point</span>
                                        </div>
                                        <div style={{display: "flex", marginTop: 8}}>
                                            <img src={book} height={20} alt={"book"}/>
                                            <span style={{paddingLeft: 8}}>{info.record} records last day</span>
                                        </div>
                                        <div style={{display: "flex", marginTop: 8}}>
                                            <img src={books} height={20} alt={"books"}/>
                                            <span style={{paddingLeft: 8}}>{info.total} in total</span>
                                        </div>
                                        <div style={{display: "flex", marginTop: 8}}>
                                            <span style={{paddingLeft: 28}}>Hire date: {info.hireDate}</span>
                                        </div>
                                    </div>
                                </Col>
                                <Col style={{height: "100%"}}>
                                    <Divider
                                        type={"vertical"}
                                        style={{
                                            marginTop: 50,
                                            height: 120,
                                            borderInlineStart: "1px solid rgb(0, 0, 0)"
                                        }}
                                    />
                                </Col>
                                <Col>
                                    <div style={{
                                        marginTop: 64,
                                        marginLeft: 24,
                                        fontSize: 16,
                                        color: "rgb(92, 92, 92)"
                                    }}>
                                        <div style={{display: "flex", marginTop: 8}}>
                                            Service description: {info.desc}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div> */}
                        <div
                            style={{
                                marginTop: 16,
                                height: 220,
                                border: "0.5px solid grey"
                            }}
                        >
                            <div style={{
                                textAlign: "left",
                                paddingLeft: 24
                            }}>
                                <Title level={4} style={{marginTop: 16}}>Service Information</Title>
                            </div>
                            <div style={{textAlign: "left", paddingLeft: 24}}>
                                <Row>
                                Name : {serviceList.find(service => service.service_id == curservice)?.name}
                                </Row>
                                <Row>
                                Price : {serviceList.find(service => service.service_id == curservice)?.price}
                                </Row>
                                <Row>
                                Description : {serviceList.find(service => service.service_id == curservice)?.description}
                                </Row>
                                {/* <Space>
                                    <Space direction={"horizontal"} style={{textAlign: "left", whiteSpace: "pre"}}>
                                        Name : {serviceList.find(service => service.service_id == curservice)?.name}
                                    </Space>
                                    
                                    <Space direction={"horizontal"} style={{textAlign: "left", whiteSpace: "pre"}}>
                                    Price : {serviceList.find(service => service.service_id == curservice)?.price}
                                    </Space>
                                    <Space direction={"horizontal"} style={{textAlign: "left", whiteSpace: "pre"}}>
                                    Description : {serviceList.find(service => service.service_id == curservice)?.description}
                                    </Space>
                                </Space> */}

                            </div>
                            <div style={{
                                textAlign: "left",
                                paddingLeft: 24,
                                paddingTop: 8
                            }}>
                                <Space>
                                    Available time:
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
                                    <div style={{marginLeft: 40}}>
                                        <Space direction={"vertical"}>
                                            <div>
                                                <Space>
                                                    <div style={{
                                                        backgroundColor: "rgb(233,136,136)",
                                                        width: 50,
                                                        height: 30
                                                    }}>
                                                    </div>
                                                    : Not Available
                                                </Space>
                                            </div>
                                            <div>
                                                <Space>
                                                    <div style={{
                                                        backgroundColor: "rgb(237,231,231)",
                                                        width: 50,
                                                        height: 30
                                                    }}>
                                                    </div>
                                                    : Available
                                                </Space>
                                            </div>
                                        </Space>
                                    </div>
                                </Space>
                            </div>
                        </div>
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
                                        <Title level={3} style={{marginTop: 16}}>Relevant information</Title>
                                        </Row>
                            
                                            
                                        
                                        
                                        <Space size={32}>
                                            {/* {info.relevantPic.map((item, k) => {
                                                return (
                                                    <img src={item} alt={k.toString()} height={"120"}/>
                                                )
                                            })} */}
                                                {/* <form onSubmit={handleSubmit}>
                                                    <input type="file" onChange={handleFileChange} />
                                                    {<PlusOutlined/>}
                                                </form> */}
                                            <img src={serviceFile} height={"120"}/>
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            onChange={handleFileChange}
                                            >
                                            {<PlusOutlined />}
                                        </Upload>
                                        </Space>
                                    </div>
                                </Col>
                            </Row>


                        </div>
                        {/* <div
                            style={{
                                marginTop: 16,
                                height: 320,
                                border: "0.5px solid grey"
                            }}
                        >
                            <div style={{
                                textAlign: "left",
                                paddingLeft: 24
                            }}>
                                <Title level={4} style={{marginTop: 16}}>Connection with Customer</Title>
                            </div>
                            <div>
                                {info.chat.map((item) => {
                                    return (
                                        <div style={{marginTop: 12}}>
                                            <Row>
                                                <Col span={2}>
                                                    {item.type === "left" && (
                                                        <img src={item.pic} alt={"pic"} height={40}/>
                                                    )}
                                                </Col>
                                                <Col span={20}>
                                                    <div style={{
                                                        backgroundColor: "rgb(217, 217, 217)",
                                                        height: "40px",
                                                        textAlign: item.type,
                                                        padding: 8,
                                                        fontSize: 16,
                                                        fontWeight: "bold"
                                                    }}>
                                                        {item.message}
                                                    </div>
                                                </Col>
                                                <Col span={2}>
                                                    {item.type === "right" && (
                                                        <img src={item.pic} alt={"pic"} height={40}/>
                                                    )}
                                                </Col>
                                            </Row>
                                        </div>
                                    )
                                })}
                            </div>
                            <div style={{marginLeft: 64, marginRight: 64, marginTop: 8}}>
                                <Row gutter={8}>
                                    <Col span={20}>
                                        <TextArea style={{height: 60}} placeholder={"Please type information"} />
                                    </Col>
                                    <Col span={4}>
                                        <Button size={"large"} style={{
                                            height: 60, backgroundColor: "rgb(228,228,228)",
                                            fontWeight: "bold"
                                        }} block>
                                            Send
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </div> */}
                    </Col>
                </Row>
            </div>
            </Tab.Container>
        </div>
    )
}

export default Employee
