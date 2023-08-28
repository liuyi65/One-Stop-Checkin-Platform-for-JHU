import logo from './logo.svg';
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
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import React, { useState } from 'react';
import Page2 from "./Page2"
import Page3 from "./Page3"
import Page4 from './Page4';
import Page5 from './Page5';
import BusServerConnector from './ServerConnector';
import UserMainPage from "./UserMainPage"
export const connector = BusServerConnector.getInstance();

function Mobile() {

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <div>
      <Nav fill variant="tabs" defaultActiveKey="/home">
            <Nav.Link as={Link} to="MainPage" style={{ marginLeft: '200px' }}>Main Page</Nav.Link>
      </Nav>

      <Routes>
          <Route path ="MainPage" element = {<UserMainPage/>}/>
      </Routes>


{/* <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <img
          variant="top" src={logo} className="App-logo" alt="logo" style={{ width: 'auto', height: 'auto' }}
        />
        <Carousel.Caption style={{ color: 'black' }}>
          <h1>First Picture want to<br/>
              add something
          </h1>
  
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
         variant="top" src={logo} className="App-logo" alt="logo" style={{ width: 'auto', height: 'auto' }}
        />

        <Carousel.Caption style={{ color: 'black' }}>
        <h1>Second Picture want to<br/>
              add something
          </h1>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          variant="top" src={logo} className="App-logo" alt="logo" style={{ width: 'auto', height: 'auto' }}
        />

        <Carousel.Caption style={{ color: 'black' }}>
        <h1>Third Picture want to<br/>
              add something
          </h1>
        </Carousel.Caption>
      </Carousel.Item>
       </Carousel> */}


       {/* <div style={{ position: 'fixed',  top: '90vh', left: 0, right: 0, zIndex: 999,display: 'flex', 
      justifyContent: 'space-between',  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',  }}>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
      <Button>Button 4</Button>
    </div> */}


      {/* <Row>
        <Col xs = {9}>
        <Form.Control type="text" placeholder="Text information" style={{ padding: '10px' }} />
        </Col>
        <Col xs = {3}>
        <Button> Search</Button>
        </Col>
      </Row>
      
   

    <Card style={{ maxWidth: "800px",padding:"50px"}}>
     <Row>
     <Card.Text className="text-center" style={{fontSize:"25px"}}> 
        --Upcoming Appointment--
    </Card.Text>
      </Row> 
    <Row noGutters>
  <Col xs={2} md={2} style={{ height: "150px" }}>
    <Card.Img variant="top" src={logo} className="App-logo" alt="logo" style={{ maxWidth: '120%', maxHeight: '120%', width: 'auto', height: 'auto' }} />
  </Col>
  <Col xs={8} md={8} style={{ }}>
  <Row className="justify-content-between">
    <Col xs ={8}>
    <Card.Title style={{ fontSize: "20px" }}>Ice-cream bar</Card.Title>
    </Col>
    <Col xs ={5}>
    <Button className="d-flex align-items-center justify-content-center" style={{height: "20px", width: "150px", minWidth: 0, fontSize: "10px",marginRight: '30px'}}>Ready-for-check-in</Button>
    </Col>
  </Row>
  <Row>
    <Col xs ={8}>
    <Card.Text>
        Vanilla ice cream 
    </Card.Text>
    </Col>
    <Col xs ={4}>
    <Card.Text>
        at 00:00
    </Card.Text>
    </Col>
  </Row>
    <Card.Text>
      544 Union ave, Williamsbury-North side      <br/>
      3 miles
    </Card.Text>
  </Col>
</Row>
<Row>
<Button style={{marginTop:"10px", borderRadius: "20px"}}>Check-in Now</Button>
</Row>
</Card>






<Card style={{ maxWidth: "800px",padding:"50px"}}>
     <Row>
     <Card.Text className="text-center" style={{fontSize:"25px"}}> 
        --Business near By--
    </Card.Text>
      </Row> 
    <Row noGutters>
  <Col xs={2} md={2} style={{ height: "150px" }}>
    <Card.Img variant="top" src={logo} className="App-logo" alt="logo" style={{ maxWidth: '120%', maxHeight: '120%', width: 'auto', height: 'auto' }} />
  </Col>
  <Col xs={8} md={8} style={{ }}>
  <Row className="justify-content-between">
    <Col xs ={8}>
    <Card.Title style={{ fontSize: "20px" }}>Ice-cream bar</Card.Title>
    </Col>
    <Col xs ={5}>
    <Button className="d-flex align-items-center justify-content-center" style={{height: "20px", width: "150px", minWidth: 0, fontSize: "10px",marginRight: '30px'}}>Booked</Button>
    </Col>
  </Row>
  <Row>
    <Col xs ={8}>
    <Card.Text>
        Vanilla ice cream 
    </Card.Text>
    </Col>
    <Col xs ={4}>
    <Card.Text>
        at 00:00
    </Card.Text>
    </Col>
  </Row>
    <Card.Text>
      544 Union ave, Williamsbury-North side      <br/>
      3 miles
    </Card.Text>
  </Col>
</Row>
<Row>
<Button style={{marginTop:"10px", borderRadius: "20px"}}>Check-in Now</Button>
</Row>
</Card> */}

    {/* <Card>
    <Card.Img variant="top" src={logo} className="App-logo" alt="logo" style={{ width: 'auto', height: 'auto' }} />
    <Card.Body className="text-center" style={{ overflowWrap: 'break-word' }}>
    <Card.ImgOverlay>
      <Card.Text style={{marginTop:"60px", fontSize: "2.5rem"}}>
      We found these <br />
      amazing place for you
      </Card.Text>
      </Card.ImgOverlay>
      <Form.Control type="text" placeholder="Search" style={{ width: '300px', padding: '10px', margin: '0 auto', display: 'block' }} />
    </Card.Body>
  </Card> */}
</div>

  );
}

export default Mobile;