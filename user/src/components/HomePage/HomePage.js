import React, { useEffect, useState } from "react";
import FindTableBar from "./FindTableBar";
import RestaurantPreview from "./RestaurantPreview";
import { Link } from "react-router-dom";
import BottomSticky from "./BottomSticky";
import FetchRestaurants from "../server/FetchRestaurants";
import Button from 'react-bootstrap/Button'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Card from 'react-bootstrap/Card';
import Holder from 'holderjs';
import Form from 'react-bootstrap/Form';

import Carousel from 'react-bootstrap/Carousel';
import Container from 'react-bootstrap/Carousel';

const HomePage = ()=> {
    const restaurants = FetchRestaurants();
    const [index, setIndex] = useState(0);

    const handleSelect = () => {
      setIndex((index+1)%3);
    };
    return (
        <div>
            {/* <div className="flex flex-col items-center justify-center h-60
                         text-white bg-gradient-to-r from-gdblue to-glblue">
                <h1 className="font-semibold text-5xl"
                >Find your table for any occasion</h1>
                <div className="flex space-x-5">
                    <FindTableBar type ="edit" status={false} />
                    <Link to="/nearest">
                        <button className="bg-red-600 w-36 h-10 border
                                        border-red-600 rounded text-sm mt-7"
                        >Let's go</button>
                    </Link>
                </div>
            </div> */}
            <Carousel variant="dark" activeIndex={index} style = {{width:"100%", height:'auto', marginBottom :'2em'}} onSelect={handleSelect}>
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src="https://1000logos.net/wp-content/uploads/2017/03/Kfc_logo.png"
                    alt="First slide"
                    style={{ width: '100%', height: '300px' }}
                    />
                    <Carousel.Caption>
                    <h3>First slide label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src="https://1000logos.net/wp-content/uploads/2017/03/Kfc_logo.png"
                    alt="Second slide"
                    style={{ width: '100%', height: '300px' }}
                    />

                    <Carousel.Caption>
                    <h3>Second slide label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src="https://1000logos.net/wp-content/uploads/2017/03/Kfc_logo.png"
                    alt="Third slide"
                    style={{ width: '100%', height: '300px' }}
                    />

                    <Carousel.Caption>
                    <h3>Third slide label</h3>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                    </p>
                    </Carousel.Caption>
                </Carousel.Item>
                </Carousel>
    
            <Row>
            <Col xs = {9}>
            <Form.Control type="text" placeholder="Text information" style={{ padding: '10px' }} />
            </Col>
            <Col xs = {3}>
            <Button> Search</Button>
            </Col>
            </Row>
            <div className="max-w-7xl mx-auto mt-10 pb-24">
                <div className="flex pb-4 border-b items-center">
                    <p className="font-medium text-2xl"
                    >For You</p>
                </div>
                <div className="flex space-x-5 mt-5 m-auto mb-12 overflow-auto pt-4">
                    {restaurants?.map((restaurant, idx) =>{
                        return <Container fluid><Row><Col lg={12}><RestaurantPreview restaurant={restaurant} key={idx}/></Col></Row></Container>
                    })
                    }
                    {/* <Row><Col style = {{width :'auto'}}><RestaurantPreview style = {{width :'auto'}} restaurant={restaurants.slice(1)} key={1}/></Col></Row> */}
                </div>
                <BottomSticky />
            </div>

        </div>
    )
}
export default HomePage;