import { Card } from 'react-bootstrap';

export default function CommentCard({ commentProp }) {
  const { comment, userId, timeAgo } = commentProp;

  return (
    <Card className="mb-2 shadow-sm">
      <Card.Body>
        <Card.Text>{comment}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">By: User {userId}</small>
          <small className="text-muted">{timeAgo}</small>
        </div>
      </Card.Body>
    </Card>
  );
}