import { useState, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';

const API_BASE = process.env.REACT_APP_API_URL;

export default function AddMovie() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [director, setDirector] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/movies/addMovie`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title, description, director, year, genre }),
      });

      const data = await res.json();

      if (data.message && data.message.toLowerCase().includes('success')) {
        Swal.fire('Success!', data.message, 'success');
        navigate('/movies');
      } else {
        Swal.fire('Error!', data.message || 'Please try again', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error!', 'Something went wrong', 'error');
    }
  };

  return user?.isAdmin ? (
    <Container className="mt-5 add-movie-form">
      <h2>Add Movie</h2>
      <Form className="add-movie-form" onSubmit={handleAddMovie}>
        <Form.Group className="mb-2">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter movie title"
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter movie description"
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Director</Form.Label>
          <Form.Control
            type="text"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            required
            placeholder="Enter director name"
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Year</Form.Label>
          <Form.Control
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            placeholder="Enter release year"
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Genre</Form.Label>
          <Form.Control
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
            placeholder="Enter genre"
          />
        </Form.Group>

        <div className="text-center mt-3">
          <Button type="submit" className="mx-2" variant="success">
            Add Movie
          </Button>
          <Button variant="danger" className="mx-2" onClick={() => navigate('/movies')}>
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  ) : (
    <Navigate to="/movies" />
  );
}