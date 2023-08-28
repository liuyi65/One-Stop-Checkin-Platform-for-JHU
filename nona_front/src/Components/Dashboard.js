import React, { useState } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate  } from "react-router-dom"
import { Container } from "react-bootstrap"
import Row from 'react-bootstrap/Row';

export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout, certified, setCertified} = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    setError("")

    try {
      await logout()
      setCertified(false);
      console.log(certified)
      navigate("/login")
    } catch {
      setError("Failed to log out")
      setCertified(true);
    }
  }

  return (
    <div>
      <Container style = {{position: "absolute", top: "50%", left: "50%", maxWidth: "500px", transform: "translate(-50%, -50%)"}}>
      <Row>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {currentUser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      </Row>
      <Row>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
      </Row>
      
      </Container>

    </div>
  )
}
