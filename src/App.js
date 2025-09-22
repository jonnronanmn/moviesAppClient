import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AppNavbar from './components/AppNavbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Movies from './pages/Movies';
import MovieView from './pages/MovieView';
import AddMovie from './pages/AddMovie';
import { UserProvider } from './UserContext';

const API_BASE = process.env.REACT_APP_API_URL;

function App() {
  const [user, setUser] = useState({ id: null, isAdmin: null });

  const unsetUser = () => {
    localStorage.removeItem("token");
    setUser({ id: null, isAdmin: null });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_BASE}/users/details`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser({ id: data.user._id, isAdmin: data.user.isAdmin });
        else unsetUser();
      })
      .catch(err => {
        console.error("Error fetching user details:", err);
        unsetUser();
      });
    }
  }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Navigate to="/movies" />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:movieId" element={<MovieView />} />
          <Route path="/register" element={user.id ? <Navigate to="/movies" /> : <Register />} />
          <Route path="/login" element={user.id ? <Navigate to="/movies" /> : <Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route 
            path="/addMovie" 
            element={user.isAdmin ? <AddMovie /> : <Navigate to="/movies" />} 
          />
          <Route path="*" element={<Navigate to="/movies" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;