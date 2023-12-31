
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Rating from "./Rating";
import ShowTimes from "../RestaurantPage/ShowTimes";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Card from 'react-bootstrap/Card';

const RestaurantPreview = ({restaurant, takeout = false}) =>{

    const [showRest, setShowRest] = useState(false)
    const navigate = useNavigate()
    const rate = restaurant?.rating
    const handleClick = (busi) => {
        console.log(busi);
        navigate(`/restaurants/${restaurant?.business_id}`, {state : {bid:busi.business_id, bname:busi.name, baddr:busi.address, brate:busi.rating, bdesc:busi.description}})
      }
    return (
            <div
            className="w-full max-w-screen-1xl m-auto bg-white h-100% font-outfit">
                {/* <Link to={{pathname: `/restaurants/${restaurant?.business_id}`,
                            state : {bid:restaurant.business_id, bname:restaurant.name, baddr:restaurant.address, brate:restaurant.rating, bdesc:restaurant.description} }}> */}
                    
                    <Card style={{ cursor: 'pointer' }} onClick = { () => handleClick(restaurant)}>
                    <Card.Body style={{ overflowWrap: 'break-word', padding:"50px"}}>
                            <Row>
                                <Card.Text className="text-center" style={{fontSize:"25px"}}> 
                                    {restaurant.name}
                                </Card.Text>
                            </Row>
                            <Row>
                                <Col xs={2} md={2} style={{ height: "150px" }}>
                                <Card.Img variant="top" src={"https://1000logos.net/wp-content/uploads/2017/03/Kfc_logo.png"} className="App-logo" alt="logo" style={{ maxWidth: '120%', maxHeight: '120%', width: 'auto', height: 'auto' }} />
                                </Col>
                                <Col xs={8} md={8} style={{ }}>
                                <Row className="justify-content-between">
                                {/* <Col xs ={8}>
                                <Card.Title style={{ fontSize: "20px" }}>Ice-cream bar</Card.Title>
                                </Col> */}
                                {/* <Col xs ={5}>
                                <Button className="d-flex align-items-center justify-content-center" style={{height: "20px", width: "150px", minWidth: 0, fontSize: "10px",marginRight: '30px'}}>Ready-for-check-in</Button>
                                </Col> */}
                                </Row>
                                <Row>
                                <Col xs ={8}>
                                <Card.Text>
                                    {restaurant.description}
                                </Card.Text>
                                </Col>
                                <Col xs ={4}>
                                <Card.Text>
                                    {restaurant.rating}
                                </Card.Text>
                                </Col>
                                </Row>
                                <Card.Text>
                                    {restaurant.address}
                                </Card.Text>
                                </Col>
                            </Row>
                            {/* <Row>
                            <Button style={{marginTop:"10px", borderRadius: "20px"}}>Check-in Now</Button>
                            </Row> */}
                        </Card.Body>
                    </Card>
                    {/* {!takeout &&
                        <ShowTimes
                        restaurant={restaurant}
                        />
                    }
                    {takeout &&
                        <div className="flex items-center space-x-2 w-40 h-9 border border-gray-300 rounded ml-4
                                        mt-5 text-red-500 text-sm font-medium hover:border-2 hover:border-red-600">
                            <svg
                            className="w-6 h-6 ml-2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            focusable="false"><g fill="none"
                            fill-rule="evenodd"><path d="M11.1923881,7.19238816 C13.8147448,7.19238816 16.4332749,7.88002892 19.0481719,9.24949945 C20.3663707,9.93987064 21.1923881,11.3049175 21.1923881,12.7929562 L21.1923881,15.1923882 C21.1923881,16.2969577 20.2969576,17.1923882 19.1923881,17.1923882 L15.8386797,17.1923882 C14.9458358,17.1923934 14.1611367,16.600599 13.9157119,15.74215 C13.5311739,14.3971097 13.051748,13.8597684 12.4435462,13.8590555 L12.2445137,13.8590532 C11.9797378,13.8590516 11.9797378,13.8590516 11.1923912,13.8590525 L10.5908984,13.8590535 L9.94238815,13.8590549 C9.36404307,13.8590549 8.89692488,14.3907007 8.48907223,15.7623886 C8.23683842,16.610715 7.45704835,17.1923882 6.57201858,17.1923882 L3.19238815,17.1923882 C2.08781864,17.1923882 1.19238815,16.2969577 1.19238815,15.1923882 L1.19238815,12.7929431 C1.19239394,11.3049036 2.0184157,9.93985867 3.33661714,9.24949272 C5.95150798,7.88002719 8.5700348,7.19238816 11.1923881,7.19238816 Z M3.19238815,12.7929469 L3.19238815,15.1923882 L6.57201858,15.1923839 C7.20290417,13.0705928 8.26739372,11.8590549 9.94238599,11.8590549 L10.5908946,11.8590535 L11.1923885,11.8590525 C11.9797362,11.8590516 11.9797362,11.8590516 12.2445326,11.8590532 L12.4447301,11.8590562 C14.1421938,11.8610438 15.2370999,13.0882166 15.8386738,15.1923882 L19.1923881,15.1923882 L19.1923881,12.7929562 C19.1923881,12.0489367 18.7793784,11.3664115 18.1202811,11.021227 C15.7828612,9.79707646 13.4802133,9.19238816 11.1923881,9.19238816 C8.90456585,9.19238816 6.60192098,9.79707492 4.26450398,11.0212224 C3.60540308,11.3664055 3.19239104,12.0489299 3.19238815,12.7929469 Z" fill="#2D333F" fill-rule="nonzero" transform="translate(11.192388, 12.192388) rotate(-135.000000) translate(-11.192388, -12.192388)"></path></g></svg>
                            <span>{restaurant?.phone_number}</span>
                        </div>
                    } */}
            </div>
    )

}

export default RestaurantPreview;