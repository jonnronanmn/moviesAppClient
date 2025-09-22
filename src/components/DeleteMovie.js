import { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function DeleteMovie({ movie, fetchData }) {
  const [loading, setLoading] = useState(false);

  const deleteMovie = async (movieId) => {
    if (!movieId) {
      return Swal.fire({
        title: 'Error',
        text: 'Movie ID is missing!',
        icon: 'error'
      });
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/movies/deleteMovie/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.message) {
        await Swal.fire('Deleted!', data.message, 'success');
        fetchData(); // refresh movie list after deletion
      } else {
        await Swal.fire('Error', data.error || 'Something went wrong!', 'error');
      }
    } catch (err) {
      console.error('Delete movie error:', err);
      Swal.fire('Error', 'An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!movie?._id) {
      return Swal.fire({
        title: 'Error',
        text: 'Movie ID is invalid!',
        icon: 'error'
      });
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      deleteMovie(movie._id);
    }
  };

  return (
    <Button
      variant="danger"
      size="sm"
      onClick={confirmDelete}
      className="mx-3"
      disabled={loading || !movie?._id}
    >
      {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Delete'}
    </Button>
  );
}