import { useState, useEffect, useContext } from 'react';
import { Container, Button, Row, Col, Badge, Card, Spinner, Form, Pagination } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import CommentCard from '../components/CommentCard';

export default function MovieView() {
  const { movieId } = useParams();
  const { user } = useContext(UserContext);

  const [movie, setMovie] = useState({});
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  // Genre color
  const getGenreColor = (genre) => {
    switch (genre?.toLowerCase()) {
      case 'horror': return 'danger';
      case 'action': return 'warning';
      case 'comedy': return 'success';
      case 'drama': return 'primary';
      case 'sci-fi': return 'purple';
      default: return 'secondary';
    }
  };

  // Fetch movie
  const fetchMovie = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/movies/getMovie/${movieId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.movie.comments) data.movie.comments.reverse(); // newest first
      setMovie(data.movie);
    } catch (err) {
      console.error('Error fetching movie:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add comment
  const addComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/movies/addComment/${movieId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ comment })
      });
      const data = await res.json();

      if (data.message === 'Comment added successfully') {
        const updatedMovie = { ...data.movie, comments: data.movie.comments.slice().reverse() };
        setMovie(updatedMovie);
        setComment('');
        setCurrentPage(1); // reset pagination
      } else {
        Swal.fire('Error', data.message || 'Failed to add comment', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Something went wrong', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => { fetchMovie(); }, [movieId]);

  if (loading) return <div className="spinner-container"><Spinner animation="border" /></div>;

  // Pagination logic
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = movie.comments?.slice(indexOfFirstComment, indexOfLastComment) || [];
  const totalPages = Math.ceil((movie.comments?.length || 0) / commentsPerPage);

  return (
    <Container className="pt-5 pb-5">
      <Row className="justify-content-center">
        {/* Left: Movie Details */}
        <Col lg={6} className="mb-4">
          <Card className="movie-view-card shadow-sm border-0">
            <Card.Body>
              <Row>
                <Col md={4} className="text-center mb-3 mb-md-0">
                  <img
                    src={movie.poster || "https://cdn-icons-png.freepik.com/512/2798/2798007.png"}
                    alt={movie.title}
                    className="movie-img"
                  />
                </Col>
                <Col md={8}>
                  <div className="movie-title">{movie.title}</div>
                  <div className="movie-genre-year">
                    <Badge bg={getGenreColor(movie.genre)}>{movie.genre}</Badge>
                    <span>{movie.year}</span>
                  </div>
                  <div className="movie-description">{movie.description}</div>
                  <div className="movie-director"><strong>Director:</strong> {movie.director}</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Right: Comments */}
        <Col lg={5}>
          <h4 className="mb-3" style={{ color: '#ffcc00' }}>Comments</h4>

          {user.id && (
            <Form onSubmit={addComment} className="mb-4">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={submitting}
                className="form-control mb-2"
              />
              <div className="d-flex justify-content-end">
                <Button type="submit" className="btn-success" disabled={submitting}>
                  {submitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </Form>
          )}

          {currentComments.length > 0
            ? currentComments.map(c => (
                <CommentCard
                  key={c._id}
                  commentProp={{ ...c, username: c.userId?.username || 'Anonymous' }}
                />
              ))
            : <p className="text-muted">No comments yet</p>
          }

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-3">
              <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
              {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={currentPage === idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          )}
        </Col>
      </Row>
    </Container>
  );
}