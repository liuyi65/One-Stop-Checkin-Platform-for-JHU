import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Row } from "react-bootstrap"
import { useAuth } from "../../context/AuthContext"
import { Link, useNavigate,NavLink  } from "react-router-dom"
import Dropdown from 'react-bootstrap/Dropdown';
import NavItem from 'react-bootstrap/NavItem';
// import NavLink from 'react-bootstrap/NavLink';
import { Container } from "react-bootstrap";
import { auth } from "./firebase";
import { setPersistence, browserLocalPersistence } from "firebase/auth";

export default function Signup() {
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup , setCertified} = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [isBusiness, setIsBusiness] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }
    //https://firebase.google.com/docs/auth/web/auth-state-persistence?hl=zh-cn#web-version-9_1
    //https://firebase.google.com/docs/auth/admin/verify-id-tokens?hl=zh-cn
    console.log(emailRef.current.value, passwordRef.current.value, passwordConfirmRef.current.value)

    try {
      setError("")
      setLoading(true)
      await setPersistence(auth, browserLocalPersistence)
      .then(() => {
        signup(emailRef.current.value, passwordRef.current.value).then((res) => {
          auth.currentUser.getIdToken(true).then((idtoken) => {
            // localStorage.setItem("usertoken", idtoken);
            console.log("sdddddddddddddd",idtoken);
            fetch('http://api.magicspica.com/api/users', {
              headers: {
                  'Content-Type' : 'application/json'
              },
              method: 'PUT', 
              body: JSON.stringify({"token":idtoken}) 
              }) 
              .then(res => {
                  console.log(res)
                  navigate("/HomePage")
              })
              .catch(error => {
                console.log('error', error);
                return setError("backend fail");
              });
          })
        }).catch((error) => {
          // Handle Errors here.
          
          console.log('what');
          return setError("Already have an account, change your email");
        });
      })
      .catch((error) => {
        // Handle Errors here.
        return setError("Failed to set persistence");
      });
      
      // if(isBusiness){
      //   navigate("/company")
      // }
      // else{
      //   navigate("/mobile")
      // }
    } catch {
      return setError("Failed to create an account, try again");
    }

    // auth.currentUser.getIdToken(true).then((idtoken) => {
    //   localStorage.setItem("usertoken", idtoken);
    //   console.log("sdddddddddddddd",idtoken);
    // })
    // fetch('http://api.magicspica.com/api/users', {
    //   headers: {
    //       'Content-Type' : 'application/json'
    //   },
    //   method: 'PUT', 
    //   body: JSON.stringify({"token":localStorage.getItem("usertoken")}) 
    //   }) 
    //   .then(res => {
    //       console.log(res)
    //       navigate("/mobile")
    //   })
    //   .catch(error => console.log('error', error));

    setLoading(false)
  }

  function handleSubmitBusiness(){
    setIsBusiness(!isBusiness);
    //console.log(isBusiness);
    //navigate("/company")
  }
  return (
    <>
    <div>
      {/* <Dropdown as={NavItem} style = {{minHeight:'30px'}}>
        <Dropdown.Toggle as={NavLink} style={{ fontSize: "1.2rem" }}>{`${isBusiness ? 'Business' : 'User'} Sign Up`}</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>{`${isBusiness ? 'User' : 'Business'} Sign Up`}</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown> */}
      <Container style = {{position: "absolute", top: "50%", left: "50%", maxWidth: "500px", transform: "translate(-50%, -50%)"}}>
        <Row>
          <Card>
            <Card.Body>
              <h1 style={{ fontSize: "2rem" }} className="text-center mb-2">User Sign Up</h1>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="name">
                  <Form.Label htmlFor="name-input">User Name</Form.Label>
                  <Form.Control id = "name-input" ref={nameRef} required />
                </Form.Group>
                <Form.Group id="email">
                  <Form.Label htmlFor="email-input">Email</Form.Label>
                  <Form.Control id = "email-input" ref={emailRef} required />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label htmlFor="pass-input">Password(Minimum Length : 6)</Form.Label>
                  <Form.Control type="password" id = "pass-input" ref={passwordRef} required />
                </Form.Group>
                <Form.Group id="password-confirm">
                  <Form.Label htmlFor="repass-input">Password Confirmation(Minimum Length : 6)</Form.Label>
                  <Form.Control type="password" id = "repass-input" ref={passwordConfirmRef} required />
                </Form.Group>
                <Button variant="primary" disabled={loading} style = {{marginTop: '1em'}} className="w-100" type="submit">
                  {loading ? 'Loading…' : 'Sign Up'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
          </Row>
        <Row>
        <div className="w-100 text-center mt-2">
          Already have an account? <NavLink to="/" style={{color: 'blue', textDecoration: 'underline'}}>Log In</NavLink >
        </div>
        </Row>  
      
      </Container>
      
    </div>
    </>
  )
}