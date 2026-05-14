import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import {
  LineChart, BarChart, PieChart, ResponsiveContainer,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  Line, Bar, Pie, Cell
} from 'recharts';
import adminService from '../../services/adminService';

const COLORS = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1', '#0dcaf0', '#fd7e14'];

const RISK_COLORS = {
  Low: '#198754',
  Medium: '#ffc107',
  High: '#dc3545'
};

const AnalyticsCharts = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await adminService.getAnalytics();
        setAnalytics(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading analytics...</p>
      </div>
    );
  }

  const predictionsOverTime = analytics?.predictionsOverTime || [];
  const riskDistribution = analytics?.riskDistribution || [];
  const newUsersOverTime = analytics?.newUsersOverTime || [];
  const feedbackByCategory = analytics?.feedbackByCategory || [];

  const NoData = () => (
    <div className="text-center text-muted py-5">
      <p>No data yet</p>
    </div>
  );

  return (
    <Row className="g-4">
      {/* Predictions Over Time */}
      <Col lg={6}>
        <Card className="shadow-sm h-100">
          <Card.Body>
            <Card.Title className="mb-3">Predictions Over Time (Last 30 Days)</Card.Title>
            {predictionsOverTime.length === 0 ? (
              <NoData />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={predictionsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#0d6efd"
                    strokeWidth={2}
                    name="Predictions"
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card.Body>
        </Card>
      </Col>

      {/* Risk Level Distribution */}
      <Col lg={6}>
        <Card className="shadow-sm h-100">
          <Card.Body>
            <Card.Title className="mb-3">Risk Level Distribution</Card.Title>
            {riskDistribution.length === 0 ? (
              <NoData />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={riskDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="level" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Users">
                    {riskDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={RISK_COLORS[entry.level] || COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card.Body>
        </Card>
      </Col>

      {/* New Users Over Time */}
      <Col lg={6}>
        <Card className="shadow-sm h-100">
          <Card.Body>
            <Card.Title className="mb-3">New Users Over Time</Card.Title>
            {newUsersOverTime.length === 0 ? (
              <NoData />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={newUsersOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#198754"
                    strokeWidth={2}
                    name="New Users"
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card.Body>
        </Card>
      </Col>

      {/* Feedback by Category */}
      <Col lg={6}>
        <Card className="shadow-sm h-100">
          <Card.Body>
            <Card.Title className="mb-3">Feedback by Category</Card.Title>
            {feedbackByCategory.length === 0 ? (
              <NoData />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={feedbackByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="count"
                    nameKey="category"
                    label={({ category, percent }) =>
                      `${category} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {feedbackByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AnalyticsCharts;
