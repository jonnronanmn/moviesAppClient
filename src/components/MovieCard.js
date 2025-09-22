import '../App.css';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { _id, title, genre, year, description } = movie;

  const getGenreColor = (genre) => {
    switch (genre.toLowerCase()) {
      case 'horror': return '#ff4d4f';
      case 'action': return '#ffa500';
      case 'comedy': return '#00cc44';
      case 'drama': return '#1e90ff';
      case 'sci-fi': return '#aa00ff';
      default: return '#cccccc';
    }
  };

  const genreColor = getGenreColor(genre);

  return (
    <Card 
      className="movie-card h-100" 
      style={{ borderTop: `4px solid ${genreColor}`, boxShadow: `0 4px 15px ${genreColor}50` }}
    >
      <Card.Body className="movie-card-body">
        <div>
          <Card.Title className="movie-card-title">{title}</Card.Title>
          <Card.Subtitle 
            className="movie-card-subtitle" 
            style={{ color: genreColor }}
          >
            {genre} • {year}
          </Card.Subtitle>
          <Card.Text 
            className="movie-card-description" 
            style={{ color: '#222' }}
          >
            {description ? (description.length > 100 ? description.slice(0, 100) + "..." : description) : "No description available."}
          </Card.Text>
        </div>
        <Button 
          className="movie-card-btn mt-auto" 
          onClick={() => navigate(`/movies/${_id}`)}
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
}