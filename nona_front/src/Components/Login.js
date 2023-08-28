import React, { useRef, useState,useEffect } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../firebase";
import Cookies from 'js-cookie';
import BusServerConnector from "../ServerConnector";
import '../App.css'


export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login,googleLogin, setCertified, certified} = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isBusiness, setIsBusiness] = useState(false);
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const sessionCookie = Cookies.get("firebaseSession");
    if (sessionCookie) {
      setLoggedIn(true);
    }
  }, []);


  async function handleSubmit(e) {
    e.preventDefault()
    if (loggedIn) {
      navigate("/CompanyPage/MainPage");
    }
    try {
      setError("")
      setLoading(true)
      await setPersistence(auth, browserLocalPersistence)
      .then(() => {
        login(emailRef.current.value, passwordRef.current.value).then(() => {
          auth.currentUser.getIdToken(true).then((idtoken) => {
            BusServerConnector.getInstance().set_api_key(idtoken).then(()=>{
              let api_key = BusServerConnector.getInstance().get_api_key()
              console.log("api_key",api_key)
              if(api_key != null){
                Cookies.set('firebaseSession', auth.currentUser.refreshToken, { expires: 1 });
                navigate("/CompanyPage/MainPage")
              } else {
                setError("Not a business user, try user login")
              }
            })
          }).catch((error) => {
            setCertified(false);
            return setError("Failed to get user token.");
          })
        }).catch((error) => {
          setCertified(false);
          return setError("Wrong email or password");
        })
      });
      setCertified(true)
    } catch(error) {
      console.log(error)
      setCertified(false);
      return setError("Failed to log in")
    }
    setLoading(false)
  }

  return (
    <div>
      <div  >
        <div className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
          {/* Login Tab Content */}
          <div className="account-content">
            <div className="account-box">
              <div className="login-right">
                <div className="login-header">
                  <h3>Login <span>Nona</span></h3>
                  <p className="text-muted">Access to our website</p>
                </div>
                 {error && <Alert variant="danger">{error}</Alert>}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="Email Address" className="form-control-label">Email Address</label>
                    <input data-testid="emai" type="email" className="form-control" id = "Email Address" ref={emailRef} required/>
                  </div>
                  <div className="form-group">
                    <label className="form-control-label" htmlFor="Password Input">Password(Minimum Length : 6)</label>
                    <div className="pass-group">
                      <input data-testid="pass" type="password" className="form-control pass-input" id = "Password Input" ref={passwordRef} required />
                      <span className="fas fa-eye toggle-password" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Link className="forgot-link" to="/forgot-password">Forgot Password ?</Link>
                  </div>
                  <Button disabled={loading} style = {{marginTop: '1em'}} className="w-100" type="submit">
                    Log In
                  </Button>
                  {/* <button className="btn btn-primary login-btn" type="submit">Login</button> */}
                  {/* <div className="text-center dont-have">Don’t have an account? Register</div> */}
                </form>
              </div>
            </div>
          </div>
          {/* /Login Tab Content */}
        </div>
      </div>      
    </div>
  )
}