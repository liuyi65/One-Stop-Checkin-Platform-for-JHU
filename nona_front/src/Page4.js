import logo from './logo.svg';
import './App.css';
//import ThemeProvider from 'react-bootstrap/ThemeProvider'
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav';
import DropdownButton from 'react-bootstrap/DropdownButton';
import NavDropdown from 'react-bootstrap/NavDropdown';
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
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import React, { useState } from 'react';
import CloseButton from 'react-bootstrap/CloseButton';
import Page5 from './Page5';
//&nbsp;

function Page4() {

    const [count, setCount] = useState(0);

    const handleIncrement = () => {
      setCount(count + 1);
    };
  
    const handleDecrement = () => {
      if (count > 0) {
        setCount(count - 1);
      }
    };
  


    const [disabled, setDisabled] = useState(false);

    const handleClick = () => {
      setDisabled(true);
    };

  return (
<div>
    <Card>
     <CloseButton onClick={handleClick}></CloseButton>
     {!disabled && (
          <Card.Img 
            variant="top" 
            src={logo} 
            
            alt="logo" 
            className="App-logo" 
            style={{ 
              width: '400px', 
              height: '200px', 
              backgroundColor: 'grey',
            }} 
          />
        )}
      <Card.Body>
        <Card.Title style = {{fontSize:'30px'}}>Service Name </Card.Title>
        <Card.Title>at Business Name </Card.Title>
        <ListGroup.Item>Sun, Month Date at 00:00
        </ListGroup.Item>
      </Card.Body>
    </Card>



    <Card style={{padding:"20px"}}>
    <Card.Text className="text-left" style={{fontSize:"25px", fontWeight: 'bold' }}> 
        Information
    </Card.Text>
    <Card.Text className="text-left" style={{fontSize:"14px", fontWeight: 'bold' }}> 
        Name : xxxx <br/> Mobile:000-000-0000<br/> example@example.com
    </Card.Text>
    </Card>

    <Card style={{padding:"20px"}}>
    <Card.Text className="text-left" style={{fontSize:"25px", fontWeight: 'bold' }}> 
        Additional Requirements
    </Card.Text>
    <Card.Text className="text-left" style={{fontSize:"14px", fontWeight: 'bold' }}> 
        Name : xxxx <br/> Mobile:000-000-0000<br/> example@example.com
    </Card.Text>
    <div style={{ }}>
    <Row>
      <Col xs = {5}>
      Options <br/> $3/item
      </Col>
      <Col xs = {7}>
      <img variant="top" src={logo} alt="Minus" style = {{width:"30px", height:"30px"}} onClick={handleDecrement} />
      <span>{count}</span>
      <img variant="top" src={logo} alt="Plus" style = {{width:"30px", height:"30px"}} onClick={handleIncrement} />
      </Col>
    </Row>
    </div>
    </Card>



  





    <Card style={{width: "100%"}}>
    <Card.Text style={{fontSize:"20px", fontWeight: 'bold',textAlign: 'right' , paddingRight:'50px' }}> 
       Estimated Price: $60
    </Card.Text>
    <Row style = {{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
<Link to="./Page5" className="btn d-flex align-items-center justify-content-center" style={{backgroundColor: '#C477FF', color: 'white', width: '90%', marginTop: '10px', borderRadius: '20px'}}>
  <ListGroup.Item action style={{ color: 'white', margin: 0 }}>Make Appointment</ListGroup.Item>
</Link>
</Row>
    </Card>
</div>

  );
}

export default Page4;