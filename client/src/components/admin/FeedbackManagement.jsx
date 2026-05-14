import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, Form, Button, Badge, Pagination, Spinner, Modal, Row, Col
} from 'react-bootstrap';
import { FaStar, FaRegStar, FaReply } from 'react-icons/fa';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';
import { formatDate } from '../../utils/formatters';
import { API_URL } from '../../utils/constants';

const BACKEND_URL = API_URL.replace('/api', '');

const STATUS_OPTIONS = ['all', 'pending', 'reviewed', 'resolved'];

const STATUS_COLORS = {
  pending: 'warning',
  reviewed: 'info',
  resolved: 'success'
};

const CATEGORY_COLORS = {
  general: 'secondary',
  prediction: 'primary',
  plans: 'info',
  doctors: 'success',
  chatbot: 'purple',
  bug: 'danger',
  feature: 'warning'
};

const FeedbackManagement = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Respond modal state
  const [respondShow, setRespondShow] = useState(false);
  const [respondItem, setRespondItem] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [responseStatus, setResponseStatus] = useState('reviewed');
  const [respondLoading, setRespondLoading] = useState(false);

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const response = await adminService.getFeedback(params);
      setFeedbackList(response.data.feedback || response.data || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      toast.error('Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const openRespond = (item) => {
    setRespondItem(item);
    setResponseText(item.adminResponse || '');
    setResponseStatus(item.status === 'pending' ? 'reviewed' : item.status);
    setRespondShow(true);
  };

  const handleRespond = async () => {
    if (!responseText.trim()) {
      toast.warning('Please enter a response');
      return;
    }
    setRespondLoading(true);
    try {
      await adminService.respondToFeedback(respondItem._id, {
        response: responseText,
        status: responseStatus
      });
      toast.success('Response submitted');
      setRespondShow(false);
      fetchFeedback();
    } catch (error) {
      toast.error('Failed to submit response');
    } finally {
      setRespondLoading(false);
    }
  };

  const renderStars = (rating) => {
    if (!rating) return '-';
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating
          ? <FaStar key={i} className="text-warning" />
          : <FaRegStar key={i} className="text-warning" />
      );
    }
    return <span>{stars}</span>;
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
          {i}
        </Pagination.Item>
      );
    }
    return <Pagination className="justify-content-center mt-3">{items}</Pagination>;
  };

  return (
    <div>
      <Row className="mb-3 align-items-center">
        <Col md={4}>
          <Form.Select value={statusFilter} onChange={handleFilterChange}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Feedback' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : feedbackList.length === 0 ? (
        <p className="text-center text-muted py-4">No feedback found.</p>
      ) : (
        <>
          <Table responsive hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>User</th>
                <th>Category</th>
                <th>Subject</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.map((item) => (
                <tr key={item._id}>
                  <td>{item.userId?.fullName || item.userName || 'Unknown'}</td>
                  <td>
                    <Badge bg={CATEGORY_COLORS[item.category] || 'secondary'}>
                      {item.category}
                    </Badge>
                  </td>
                  <td>{item.subject}</td>
                  <td>{renderStars(item.rating)}</td>
                  <td>
                    <Badge bg={STATUS_COLORS[item.status] || 'secondary'}>
                      {item.status}
                    </Badge>
                  </td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => openRespond(item)}
                      title="Respond"
                    >
                      <FaReply className="me-1" />
                      {item.adminResponse ? 'Edit' : 'Respond'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {renderPagination()}
        </>
      )}

      {/* Respond Modal */}
      <Modal show={respondShow} onHide={() => setRespondShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Respond to Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {respondItem && (
            <>
              <p className="mb-1"><strong>Subject:</strong> {respondItem.subject}</p>
              <p className="mb-1"><strong>User:</strong> {respondItem.userId?.fullName} ({respondItem.userId?.email})</p>
              <p className="mb-1"><strong>Rating:</strong> {renderStars(respondItem.rating)}</p>
              <p className="mb-3 text-muted">{respondItem.description}</p>
              {respondItem.screenshots && respondItem.screenshots.length > 0 && (
                <div className="mb-3">
                  <strong>Screenshots:</strong>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {respondItem.screenshots.map((src, idx) => (
                      <a key={idx} href={`${BACKEND_URL}${src}`} target="_blank" rel="noreferrer">
                        <img
                          src={`${BACKEND_URL}${src}`}
                          alt={`screenshot-${idx + 1}`}
                          style={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 4, border: '1px solid #dee2e6', cursor: 'pointer' }}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={responseStatus}
                  onChange={(e) => setResponseStatus(e.target.value)}
                >
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Admin Response</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Write your response..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setRespondShow(false)} disabled={respondLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRespond} disabled={respondLoading}>
            {respondLoading && <Spinner animation="border" size="sm" className="me-1" />}
            Submit Response
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FeedbackManagement;
