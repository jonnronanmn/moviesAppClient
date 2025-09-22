import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import EditMovie from './EditMovie';
import DeleteMovie from './DeleteMovie';

export default function AdminView({ moviesData, fetchData }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const moviesArr = moviesData.map((movie) => (
      <tr key={movie._id}>
        <td>{movie.title}</td>
        <td>{movie.description}</td>
        <td>{movie.actors}</td>
        <td>{movie.director}</td>
        <td>{movie.year}</td>
        <td>{movie.genre}</td>
        <td
          className="text-center"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            alignItems: 'center'
          }}
        >
          <EditMovie movie={movie._id} fetchData={fetchData} />
          {/* Pass the whole movie object */}
          <DeleteMovie movie={movie} fetchData={fetchData} />
        </td>
      </tr>
    ));
    setMovies(moviesArr);
  }, [moviesData, fetchData]);

  return (
    <div className="admin-dashboard" style={{ color: '#fff', padding: '2rem' }}>
      <div className="text-center mb-5">
        <h1 style={{ color: '#fff' }}>Admin Dashboard</h1>
        <Link to="/addMovie" className="btn btn-primary">Add Movie</Link>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr className="text-center">
            <th>Name</th>
            <th>Description</th>
            <th>Actors</th>
            <th>Director</th>
            <th>Year</th>
            <th>Genre</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{movies}</tbody>
      </Table>
    </div>
  );
}