import React, { useRef, useState } from "react"
import { Form, Card, Alert } from "react-bootstrap"
import { useAuth } from "../../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { signInWithGoogle } from "./firebase";
import { Container } from "react-bootstrap"
import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import { setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "./firebase";
import Button from 'react-bootstrap/Button';
import BusServerConnector from "../../ServerConnector";

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login,googleLogin, setCertified, certified} = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isBusiness, setIsBusiness] = useState(false);
  const navigate = useNavigate()


  async function handleSubmit(e) {
    e.preventDefault()
    try{
      setError("")
      setLoading(true)
      await setPersistence(auth, browserLocalPersistence)
      .then(() => {
        login(emailRef.current.value, passwordRef.current.value).then((res)=>{
          navigate("/HomePage")
          setCertified(true)
        }).catch((err) =>{
          setCertified(false);
          console.log(err);
          return setError("Check your password")
        })
      })
      .catch((error) => {
        // Handle Errors here.
        setCertified(false);
        return setError("Failed to set persistence")
      });
      
      } catch(error) {
        console.log(error)
        setCertified(false);
        return setError("Failed to log in")
      }
      // auth.currentUser.getIdToken(true).then((idtoken) => {
      //   localStorage.setItem("usertoken", idtoken);
      //   console.log("sdddddddddddddd",idtoken);
      // })

    setLoading(false)
  }

  // async function handleSubmitGoogle(e) {
  //   e.preventDefault()

    // try {
    //   setError("")
    //   setLoading(true)
    //   await login(null, null)
    //   setCertified(true)
    //   if(isBusiness){
    //     navigate("/company/MainPage")
    //   }
    //   else{
    //     navigate("/mobile")
    //   }
    // } catch(error) {
    //   console.log(error)
    //   setCertified(false);
    //   setError("Failed to log in")
    // }
    // setLoading(false)
  // }

  function handleSubmitBusiness(){
    setIsBusiness(!isBusiness);
    //navigate("/company")
  }


  return (
    <div data-testid="login-page">
      {/* <Dropdown as={NavItem} data-testid="town" style = {{minHeight:'30px'}}>
        <Dropdown.Toggle as={NavLink} style={{ fontSize: "1.2rem" }}>{'Business Log in'}</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick = {handleSubmitBusiness}>{`${isBusiness ? 'User' : 'Business'} Log In`}</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown> */}
      
    <Container style = {{position: "absolute", top: "50%", left: "50%", maxWidth: "500px", transform: "translate(-50%, -50%)"}}>
     <Row>
      <Card>
        <Card.Body>
          <h2 style={{ fontSize: "2rem" }} className="text-center mb-2">{'User Log in'}</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="name">
              <Form.Label htmlFor="name-input">Email</Form.Label>
              <Form.Control type="text" id = "name-input" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label htmlFor="password-input">Password(Minimum Length : 6)</Form.Label>
              <Form.Control type="password" id = "password-input" ref={passwordRef} required />
            </Form.Group>
            <Button variant="primary" disabled={loading} style = {{marginTop: '1em'}} className="w-100" type="submit">
              Log In
            </Button>
          </Form>
          {/* <Form onSubmit={handleSubmitGoogle}>
            <Button disabled={loading} style = {{marginTop: '1em'}} className="w-100" type="submit">
              Log In With Google
            </Button>
          </Form> */}
          
          <div className="w-100 text-center mt-3">
            {
              isBusiness ? null :(<Link to="/forgot-password" style={{color: 'blue', textDecoration: 'underline'}}>Forgot Password?</Link>)
            }
            
          </div>
        </Card.Body>
      </Card>
    </Row>

      </Container>
    </div>
  )
}