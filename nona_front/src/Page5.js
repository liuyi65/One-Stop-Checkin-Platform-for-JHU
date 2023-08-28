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
//&nbsp;

function Page5() {

  return (
<div>
    <Card>
          <Card.Img 
            variant="top" 
            src={logo} 
            
            alt="logo" 
            className="App-logo" 
            style={{ 
              width: '400px', 
              height: '200px', 
            }} 
          />
      <Card.Body>
      <Card.Title className="text-center" style={{ fontSize: '30px' }}>You are all set!</Card.Title>
        <Card.Title>00:00 Mon, Month Date <br/>Service Name at Business Name <br/><br/></Card.Title>
        <ListGroup.Item>0000 Address St, City, MD <br/><br/><br/></ListGroup.Item>
        <Card.Title> Name </Card.Title>
        <ListGroup.Item>0000-000-0000<br/> example@eample.com</ListGroup.Item>
      </Card.Body>
      <Row style = {{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
<Link to="./Page5" className="btn d-flex align-items-center justify-content-center" style={{backgroundColor: '#C477FF', color: 'white', width: '90%', marginTop: '10px', borderRadius: '20px'}}>
  <ListGroup.Item action style={{ color: 'white', margin: 0 }}>Finish</ListGroup.Item>
</Link>
</Row>
    </Card>



    
</div>

  );
}

export default Page5;