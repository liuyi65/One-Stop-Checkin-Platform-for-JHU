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
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import React, { useState } from 'react';
import CloseButton from 'react-bootstrap/CloseButton';
//&nbsp;
import Page3 from './Page3';
function Page2() {

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
        <Card.Title>Business Name
                <br/>
            Category <br/>
            4.7/5.0
        </Card.Title>
        
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>0000 Address St, City, MD</ListGroup.Item>
        <ListGroup.Item>999 miles from you</ListGroup.Item>
        <ListGroup.Item>Open 00:00 -23:00 Mon, Tue, Wed, Thu, Fri, Sat, Sun</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Row>
            <Col xs = {5}>
        <Button style={{ padding: '10px 20px', width:"110%"}}> Direction</Button>
        </Col>
            <Col xs = {5}>
        <Button style={{ padding: '10px 20px', width:"120%" }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Call&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button>
        </Col>
        </Row>
      </Card.Body>
    </Card>
 


   
    <Card.Text className="text-left" style={{fontSize:"35px", fontWeight: 'bold' }}> 
        Appointment
    </Card.Text>
    <Card style={{ maxWidth: "800px", maxHeight:"150px",padding:"50px"}}>
     <Row>
     
      </Row> 
    <Row noGutters>
  <Col xs={2} md={2} style={{ height: "150px" }}>
    <Card.Img variant="top" src={logo} className="App-logo" alt="logo" style={{ maxWidth: '120%', maxHeight: '120%', width: 'auto', height: 'auto' }} />
  </Col>
  <Col xs={8} md={8} style={{ }}>
  <Row className="justify-content-between">
        <Col xs={8}>
          <Card.Title 
            style={{ 
              fontSize: '20px',
              margin: 0, 
              padding: 0,
              display: 'inline-block',
              verticalAlign: 'middle'
            }}
          >
            1
          </Card.Title>
        </Col>
      </Row>
  <Row>
<Row>
    <Col xs ={8}>
    <Card.Text>
        Vanilla ice cream 
    </Card.Text>
    </Col>
    <Col xs={4}>
          <Link to="/Page3" className="btn d-flex align-items-center justify-content-center" style={{backgroundColor: '#C477FF', color: 'white',height: '20px', 
              width: '60px', 
              minWidth: 0, 
              fontSize: '10px', 
              margin: 0,
              marginRight: '30px'}}>
  <ListGroup.Item action style={{ color: 'white' }}>Link 3</ListGroup.Item>
</Link>
    </Col>
    </Row>
    <Col xs ={4}>
    </Col>
  </Row>
  
  </Col>
</Row>

</Card>

<Card style={{ maxWidth: "800px", maxHeight:"150px",padding:"50px"}}>
     <Row>
     
      </Row> 
    <Row noGutters>
  <Col xs={2} md={2} style={{ height: "150px" }}>
    <Card.Img variant="top" src={logo} className="App-logo" alt="logo" style={{ maxWidth: '120%', maxHeight: '120%', width: 'auto', height: 'auto' }} />
  </Col>
  <Col xs={8} md={8} style={{ }}>
  <Row className="justify-content-between">
        <Col xs={8}>
          <Card.Title 
            style={{ 
              fontSize: '20px',
              margin: 0, 
              padding: 0,
              display: 'inline-block',
              verticalAlign: 'middle'
            }}
          >
            1
          </Card.Title>
        </Col>
      </Row>
  <Row>
<Row>
    <Col xs ={8}>
    <Card.Text>
        Vanilla ice cream 
    </Card.Text>
    </Col>
    <Col xs={4}>
          <Link to="/Page3" className="btn d-flex align-items-center justify-content-center" style={{backgroundColor: '#C477FF', color: 'white',height: '20px', 
              width: '60px', 
              minWidth: 0, 
              fontSize: '10px', 
              margin: 0,
              marginRight: '30px'}}>
  <ListGroup.Item action style={{ color: 'white' }}>Link 3</ListGroup.Item>
</Link>
    </Col>
    </Row>
    <Col xs ={4}>
    </Col>
  </Row>
  
  </Col>
</Row>

</Card>

</div>
  );
}

export default Page2;