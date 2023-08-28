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
import Page4 from './Page4';
//&nbsp;

function Page3() {

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
            className="App-logo" 
            alt="logo" 
            style={{ 
              width: '400px', 
              height: '200px', 
              backgroundColor: 'grey',
            }} 
          />
        )}
      <Card.Body>
        <Card.Title>Service Name </Card.Title>
        <ListGroup.Item>0000 Address St, City, MD 0000 Address St, City, MD
        0000 Address St, City, MD0000 Address St, City, MD0000 Address St, City, MD
        0000 Address St, City, MD0000 Address St, City, MD0000 Address St, City, MD
        </ListGroup.Item>
        
      </Card.Body>
    </Card>
    <Card.Text className="text-left" style={{fontSize:"35px", fontWeight: 'bold' }}> 
        Appointment
    </Card.Text>
    <div>
    <h1>Today</h1>
    <Form.Group as={Col} controlId="formGridState">
          <Form.Select defaultValue="Choose..." style={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
            <option>Time Available</option>
            <option>8:00</option>
            <option>10:00</option>
            <option>12:00</option>
          </Form.Select>
        </Form.Group>

        <h1>Sun, Month Date</h1>
    <Form.Group as={Col} controlId="formGridState">
          <Form.Select defaultValue="Choose..." style={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
            <option>Time Available</option>
            <option>8:00</option>
            <option>10:00</option>
            <option>12:00</option>
          </Form.Select>
        </Form.Group>

        <h1>Sun, Month Date</h1>
    <Form.Group as={Col} controlId="formGridState">
          <Form.Select defaultValue="Choose..." style={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
            <option>Time Available</option>
            <option>8:00</option>
            <option>10:00</option>
            <option>12:00</option>
          </Form.Select>
        </Form.Group>
    </div>
    <Card style={{width: "100%"}}>
    <Card.Text style={{fontSize:"20px", fontWeight: 'bold',textAlign: 'right' , paddingRight:'50px' }}> 
       Estimated Price: $60
    </Card.Text>
    <Row style = {{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
<Link to="./Page4" className="btn d-flex align-items-center justify-content-center" style={{backgroundColor: '#C477FF', color: 'white', width: '90%', marginTop: '10px', borderRadius: '20px'}}>
  <ListGroup.Item action style={{ color: 'white', margin: 0 }}>Confirm</ListGroup.Item>
</Link>
</Row>
    </Card>
</div>

  );
}

export default Page3;