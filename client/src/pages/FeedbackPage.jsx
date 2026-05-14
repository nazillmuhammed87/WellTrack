import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaStar, FaRegStar, FaReply } from 'react-icons/fa';
import FeedbackForm from '../components/feedback/FeedbackForm';
import feedbackService from '../services/feedbackService';
import { formatDate } from '../utils/formatters';
import { API_URL } from '../utils/constants';

const BACKEND_URL = API_URL.replace('/api', '');

const STATUS_COLORS = { pending: 'warning', reviewed: 'info', resolved: 'success' };

const renderStars = (rating) =>
  [1, 2, 3, 4, 5].map((i) =>
    i <= rating
      ? <FaStar key={i} className="text-warning" />
      : <FaRegStar key={i} className="text-warning" />
  );

const MyFeedbackList = ({ refreshTrigger }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    feedbackService.getMyFeedback()
      .then(res => setList(res.data || []))
      .catch(() => setError('Failed to load your feedback.'))
      .finally(() => setLoading(false));
  }, [refreshTrigger]);

  if (loading) return <div className="text-center py-4"><Spinner animation="border" variant="primary" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (list.length === 0) return <p className="text-muted text-center py-3">You haven't submitted any feedback yet.</p>;

  return (
    <div className="d-flex flex-column gap-3">
      {list.map((item) => (
        <Card key={item._id} className="shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-1">
              <strong>{item.subject}</strong>
              <Badge bg={STATUS_COLORS[item.status] || 'secondary'} className="ms-2">
                {item.status}
              </Badge>
            </div>
            <div className="mb-1 small text-muted">
              {item.category} &middot; {formatDate(item.createdAt)} &middot; {renderStars(item.rating)}
            </div>
            <p className="mb-2 small">{item.description}</p>

            {item.screenshots && item.screenshots.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mb-2">
                {item.screenshots.map((src, idx) => (
                  <a key={idx} href={`${BACKEND_URL}${src}`} target="_blank" rel="noreferrer">
                    <img
                      src={`${BACKEND_URL}${src}`}
                      alt={`screenshot-${idx + 1}`}
                      style={{ width: 72, height: 56, objectFit: 'cover', borderRadius: 4, border: '1px solid #dee2e6' }}
                    />
                  </a>
                ))}
              </div>
            )}

            {item.adminResponse && (
              <div className="mt-2 p-2 rounded" style={{ background: '#f0f7ff', borderLeft: '3px solid #0d6efd' }}>
                <div className="small fw-semibold mb-1 text-primary">
                  <FaReply className="me-1" /> Admin Response
                </div>
                <p className="mb-0 small">{item.adminResponse}</p>
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

const FeedbackPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <Container className="py-4">
      <h2 className="mb-4">Feedback</h2>
      <Row>
        <Col lg={6} className="mb-4">
          <h5 className="mb-3">Submit Feedback</h5>
          <FeedbackForm onSubmitSuccess={() => setRefreshTrigger(t => t + 1)} />
        </Col>
        <Col lg={6}>
          <h5 className="mb-3">My Submissions</h5>
          <MyFeedbackList refreshTrigger={refreshTrigger} />
        </Col>
      </Row>
    </Container>
  );
};

export default FeedbackPage;
