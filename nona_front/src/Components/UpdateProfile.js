import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { Container } from "react-bootstrap"
import Row from 'react-bootstrap/Row';

export default function UpdateProfile() {
  const emailRef = useRef()
  const credentialRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { currentUser, MyUpdatePassword, MyUpdateEmail } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    const promises = []
    setLoading(true)
    setError("")

    if (emailRef.current.value !== currentUser.email) {
      promises.push(MyUpdateEmail(emailRef.current.value))
    }
    if (passwordRef.current.value && credentialRef.current.value) {
      promises.push(MyUpdatePassword(credentialRef.current.value, passwordRef.current.value))
    }

    Promise.all(promises)
      .then(() => {
        navigate("/")
      })
      .catch(() => {
        setError("Failed to update account")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <Container style = {{position: "absolute", top: "50%", left: "50%", maxWidth: "500px", transform: "translate(-50%, -50%)"}}>
      <Row>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                required
                defaultValue={currentUser.email}
              />
            </Form.Group>
            <Form.Group id="oldpassword">
              <Form.Label>Old Password(Minimum Length : 6)</Form.Label>
              <Form.Control
                type="password"
                ref={credentialRef}
                placeholder="Type old password"
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password(Minimum Length : 6)</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                placeholder="Type new password"
              />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation(Minimum Length : 6)</Form.Label>
              <Form.Control
                type="password"
                ref={passwordConfirmRef}
                placeholder="Re-type new password"
              />
            </Form.Group>
            <Button disabled={loading} style = {{marginTop: '1em'}} className="w-100" type="submit">
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
      </Row>
      <Row>
      <div className="w-100 text-center mt-2">
        <Link to="/">Cancel</Link>
      </div>
      </Row>
      </Container>

    </div>
  )
}
