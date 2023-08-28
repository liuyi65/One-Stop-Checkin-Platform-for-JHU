import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../../context/AuthContext"
import { Link } from "react-router-dom"
import { Container } from "react-bootstrap"
export default function ForgotPassword() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { resetPassword } = useAuth()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      setLoading(true)
      console.log(emailRef.current.value)
      await resetPassword(emailRef.current.value, passwordRef.current.value)
      setMessage("Check your inbox for further instructions")
    } catch {
      setError("Failed to reset password")
    }

    setLoading(false)
  }

  return (
    <>
    <Container style = {{position: "absolute", top: "50%", left: "50%", maxWidth: "500px", transform: "translate(-50%, -50%)"}}>
      <Card>
        <Card.Body>
          <h2 style={{ fontSize: "2rem" }} className="text-center mb-2">Password Reset</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Button disabled={loading} style = {{marginTop: '1em'}} className="w-100" type="submit">
              Reset Password
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/" style={{color: 'blue', textDecoration: 'underline'}}>Back to Login</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup" style={{color: 'blue', textDecoration: 'underline'}}>Sign Up</Link>
      </div>
      </Container>
    </>
  )
}
