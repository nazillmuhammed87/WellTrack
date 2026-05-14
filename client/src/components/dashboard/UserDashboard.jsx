import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiActivity, FiFileText, FiUsers, FiMessageSquare } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import predictionService from '../../services/predictionService';
import { RISK_LEVELS } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';

const UserDashboard = () => {
  const { user } = useAuth();
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await predictionService.getPredictions(1, 5);
        setRecentPredictions(res.data.predictions);
      } catch (err) {
        console.error('Failed to fetch predictions:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.isVerified) fetchData();
    else setLoading(false);
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Welcome back, {user?.fullName}!</h2>

      {!user?.isVerified && (
        <div className="alert alert-warning">
          <strong>Account Pending Verification</strong>
          <p className="mb-0">Your account is awaiting admin verification. You'll be able to access prediction features once verified.</p>
        </div>
      )}

      {user?.isVerified && (
        <>
          {/* Quick Actions */}
          <Row className="mb-4">
            <Col md={3} sm={6} className="mb-3">
              <Card as={Link} to="/prediction" className="text-decoration-none h-100 text-center p-3 border-primary">
                <Card.Body>
                  <FiActivity size={40} className="text-primary mb-2" />
                  <h6>New Prediction</h6>
                  <small className="text-muted">Assess your stroke risk</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card as={Link} to="/history" className="text-decoration-none h-100 text-center p-3 border-info">
                <Card.Body>
                  <FiFileText size={40} className="text-info mb-2" />
                  <h6>View History</h6>
                  <small className="text-muted">Past predictions</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card as={Link} to="/doctors" className="text-decoration-none h-100 text-center p-3 border-success">
                <Card.Body>
                  <FiUsers size={40} className="text-success mb-2" />
                  <h6>Find Doctors</h6>
                  <small className="text-muted">Get recommendations</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card as={Link} to="/feedback" className="text-decoration-none h-100 text-center p-3 border-warning">
                <Card.Body>
                  <FiMessageSquare size={40} className="text-warning mb-2" />
                  <h6>Feedback</h6>
                  <small className="text-muted">Share your experience</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Activity */}
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Predictions</h5>
              <Link to="/history" className="btn btn-sm btn-outline-primary">View All</Link>
            </Card.Header>
            <Card.Body>
              {recentPredictions.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <FiActivity size={48} className="mb-3" />
                  <p>No predictions yet. Start your first health assessment!</p>
                  <Link to="/prediction" className="btn btn-primary">Take Assessment</Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Risk Level</th>
                        <th>Probability</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPredictions.map(p => (
                        <tr key={p._id}>
                          <td>{formatDateTime(p.createdAt)}</td>
                          <td>
                            <Badge bg={RISK_LEVELS[p.riskLevel]?.bg || 'secondary'}>
                              {p.riskLevel} Risk
                            </Badge>
                          </td>
                          <td>{(p.probability * 100).toFixed(1)}%</td>
                          <td>
                            <Link to={`/result/${p._id}`} className="btn btn-sm btn-outline-primary">View</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default UserDashboard;
