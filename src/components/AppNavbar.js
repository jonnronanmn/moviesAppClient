import { useContext } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import UserContext from '../UserContext';

export default function AppNavbar() {
  const { user, unsetUser } = useContext(UserContext);

  const handleLogout = () => {
    unsetUser();
    localStorage.removeItem('token');
  };

  return (
    <Navbar expand="lg" className="navbar-dark custom-navbar" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🎬 Movie Hu
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {user.id ? (
              user.isAdmin ? (
                <>
                  <Nav.Link as={NavLink} to="/movies">Dashboard</Nav.Link>
                  <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/movies">Movies</Nav.Link>
                  <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
                </>
              )
            ) : (
              <>
                <Nav.Link as={NavLink} to="/movies">Movies</Nav.Link>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}