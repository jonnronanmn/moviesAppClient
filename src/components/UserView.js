import { Container } from "react-bootstrap";
import MovieCard from "./MovieCard";

export default function UserView({ moviesData }) {
  return (
    <Container fluid className="px-5 py-4">
      <h1 className="page-title">Explore Movies and TV Shows</h1>
      <div className="movie-grid">
        {moviesData.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </Container>
  );
}
