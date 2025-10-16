import "../App.css";
import { useState, useEffect, useContext } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { Navigate, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import UserContext from "../UserContext";

export default function Register() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const register = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.message === "Registered successfully") {
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        Swal.fire({
          title: "Registration Successful",
          icon: "success",
          iconColor: "#000",
          text: "Thank you for registering!",
          showConfirmButton: false,
          timer: 1500,
        });

        navigate("/login");
      } else if (data.message === "Invalid email format") {
        Swal.fire(
          "Invalid Email",
          "Please enter a valid email address.",
          "error"
        );
      } else if (data.message?.includes("Password")) {
        Swal.fire(
          "Weak Password",
          "Password should be at least 8 characters long.",
          "error"
        );
      } else {
        Swal.fire(
          "Error",
          data.message || "Something went wrong. Please try again later.",
          "error"
        );
      }
    } catch (err) {
      console.error("Registration error:", err);
      Swal.fire("Error", "Could not register. Try again later.", "error");
    }
  };

  useEffect(() => {
    setIsActive(
      email !== "" &&
        password !== "" &&
        confirmPassword !== "" &&
        password === confirmPassword
    );
  }, [email, password, confirmPassword]);

  if (user?.id) {
    return <Navigate to="/movies" />;
  }

  return (
    <Container fluid className="register-page">
      <Card className="register-card">
        <Card.Body>
          <h1 className="mb-4 text-center fw-bold">Create Account</h1>
          <Form onSubmit={register}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Re-enter your password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <div className="d-grid">
              <Button
                type="submit"
                className="btn-success py-2"
                disabled={!isActive}
              >
                Register
              </Button>
            </div>

            {/* 👇 Added this line to match the Login page */}
            <div className="text-center mt-3">
              <small className="text-muted">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-success fw-semibold text-decoration-none"
                >
                  Login here
                </Link>
              </small>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
