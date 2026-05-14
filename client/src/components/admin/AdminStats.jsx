import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { FaUsers, FaClock, FaBrain, FaUserMd } from 'react-icons/fa';
import adminService from '../../services/adminService';

const STAT_CARDS = [
  { key: 'totalUsers', label: 'Total Users', icon: FaUsers, color: '#0d6efd', bg: 'primary' },
  { key: 'pendingVerification', label: 'Pending Verification', icon: FaClock, color: '#fd7e14', bg: 'warning' },
  { key: 'totalPredictions', label: 'Total Predictions', icon: FaBrain, color: '#198754', bg: 'success' },
  { key: 'activeDoctors', label: 'Active Doctors', icon: FaUserMd, color: '#6f42c1', bg: 'purple' }
];

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading stats...</p>
      </div>
    );
  }

  return (
    <Row className="g-3">
      {STAT_CARDS.map((card) => {
        const IconComponent = card.icon;
        return (
          <Col key={card.key} xs={12} sm={6} lg={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: `${card.color}20`,
                    flexShrink: 0
                  }}
                >
                  <IconComponent size={24} style={{ color: card.color }} />
                </div>
                <div>
                  <h3 className="mb-0 fw-bold">{stats?.[card.key] ?? 0}</h3>
                  <small className="text-muted">{card.label}</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default AdminStats;
