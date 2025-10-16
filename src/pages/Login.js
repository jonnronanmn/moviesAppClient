import "../App.css";
import { useState, useEffect, useContext } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { Navigate, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import UserContext from "../UserContext";

const API_URL = process.env.REACT_APP_API_URL;

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

  const retrieveUserDetails = async (token) => {
    try {
      const res = await fetch(`${API_URL}/users/details`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data?.user) {
        setUser({ id: data.user._id, isAdmin: data.user.isAdmin });
        navigate("/movies");
      } else {
        Swal.fire("Error", "Failed to load user details.", "error");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      Swal.fire("Error", "Could not fetch user details.", "error");
    }
  };

  const authenticate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.access) {
        localStorage.setItem("token", data.access);
        await retrieveUserDetails(data.access);
        Swal.fire({
          title: "Login Successful",
          icon: "success",
          iconColor: "#000",
          text: "Welcome back!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else if (data.error === "No Email Found") {
        Swal.fire("Email not found", "Check the email you provided.", "error");
      } else {
        Swal.fire(
          "Authentication failed",
          "Invalid email or password.",
          "error"
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire(
        "Error",
        "Something went wrong. Please try again later.",
        "error"
      );
    }

    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    setIsActive(email !== "" && password !== "");
  }, [email, password]);

  if (user?.id) {
    return <Navigate to="/movies" />;
  }

  return (
    <Container fluid className="register-page">
      <Card className="register-card">
        <Card.Body>
          <h1>Login</h1>
          <Form onSubmit={authenticate}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <div className="d-grid">
              <Button
                type="submit"
                className="btn-success py-2"
                disabled={!isActive}
              >
                Login
              </Button>
            </div>

            {/* 👇 Added this line */}
            <div className="text-center mt-3">
              <small className="text-muted">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-success fw-semibold text-decoration-none"
                >
                  Register here
                </Link>
              </small>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
