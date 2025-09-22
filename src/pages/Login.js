import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import UserContext from '../UserContext';

const API_BASE = process.env.REACT_APP_API_URL;

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);

  const retrieveUserDetails = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/users/details`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data?.user) {
        setUser({ id: data.user._id, isAdmin: data.user.isAdmin });
        navigate('/movies');
      } else {
        Swal.fire('Error', 'Failed to load user details.', 'error');
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
      Swal.fire('Error', 'Could not fetch user details.', 'error');
    }
  };

  const authenticate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.access) {
        localStorage.setItem('token', data.access);
        await retrieveUserDetails(data.access);
        Swal.fire({
          title: 'Login Successful',
          icon: 'success',
          text: 'Welcome to The Movie Hub!',
          showConfirmButton: false,
          timer: 1200,
        });
      } else if (data.error === 'No Email Found') {
        Swal.fire('Email not found', 'Check the email you provided.', 'error');
      } else {
        Swal.fire('Authentication failed', 'Check your login details.', 'error');
      }
    } catch (err) {
      console.error('Login error:', err);
      Swal.fire('Error', 'Something went wrong. Please try again later.', 'error');
    }
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    setIsActive(email !== '' && password !== '');
  }, [email, password]);

  if (user?.id) return <Navigate to="/movies" />;

  return (
    <div className="login-page">
      <Container className="d-flex justify-content-center align-items-center flex-column">
        <h2 className="text-center mb-4" style={{ color: '#fff' }}>Login</h2>
        <Form onSubmit={authenticate} style={{ width: '300px' }}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#fff' }}>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ color: '#fff' }}>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </Form.Group>

          <div className="d-grid">
            <Button type="submit" variant="primary" disabled={!isActive}>
              Log In
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}