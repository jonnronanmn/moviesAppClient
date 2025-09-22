import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const API_BASE = process.env.REACT_APP_API_URL;

export default function EditMovie({ movie, fetchData }) {
  const [movieId, setMovieId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [actors, setActors] = useState('');
  const [director, setDirector] = useState('');
  const [year, setYear] = useState(0);
  const [genre, setGenre] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const openEdit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/movies/getMovie/${movie}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (!res.ok) throw new Error(`Failed to fetch movie: ${res.status}`);

      const data = await res.json();
      const movieData = data.movie || data; // handle response structure
      setMovieId(movieData._id);
      setTitle(movieData.title);
      setDescription(movieData.description);
      setActors(movieData.actors || '');
      setDirector(movieData.director);
      setYear(movieData.year);
      setGenre(movieData.genre);

      setShowEdit(true);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to fetch movie data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const closeEdit = () => {
    setShowEdit(false);
    setTitle('');
    setDescription('');
    setActors('');
    setDirector('');
    setYear(0);
    setGenre('');
  };

  const editMovie = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/movies/updateMovie/${movieId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title,
          director,
          year: Number(year),
          description,
          genre,
          actors,
        }),
      });

      const data = await res.json();

      if (data.message === 'Movie updated successfully') {
        Swal.fire('Success!', 'Movie Successfully Updated', 'success');
        closeEdit();
        fetchData();
      } else {
        Swal.fire('Error!', data.message || 'Please try again', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error!', 'Something went wrong. Please try again.', 'error');
    }
  };

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        onClick={openEdit}
        className="mx-3"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Edit'}
      </Button>

      <Modal show={showEdit} onHide={closeEdit}>
        <Form className="edit-movie-form" onSubmit={editMovie}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Movie</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Director</Form.Label>
              <Form.Control
                type="text"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Actors</Form.Label>
              <Form.Control
                type="text"
                value={actors}
                onChange={(e) => setActors(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Genre</Form.Label>
              <Form.Control
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="success" type="submit">
              Update
            </Button>
            <Button variant="secondary" onClick={closeEdit}>
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}