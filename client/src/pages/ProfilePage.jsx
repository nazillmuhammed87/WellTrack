import React, { useState } from 'react';
import { Container, Card, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import authService from '../services/authService';
import { formatDate } from '../utils/formatters';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.substring(0, 10) : '',
    address: user?.address || ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.updateProfile(formData);
      updateUser(res.data);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: '700px' }}>
      <h2 className="mb-4">My Profile</h2>
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          {!editing ? (
            <>
              <Row className="mb-3">
                <Col sm={4} className="text-muted">Full Name</Col>
                <Col sm={8} className="fw-semibold">{user?.fullName}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="text-muted">Email</Col>
                <Col sm={8}>{user?.email}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="text-muted">Phone</Col>
                <Col sm={8}>{user?.phone || 'Not provided'}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="text-muted">Gender</Col>
                <Col sm={8}>{user?.gender || 'Not provided'}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="text-muted">Date of Birth</Col>
                <Col sm={8}>{user?.dateOfBirth ? formatDate(user.dateOfBirth) : 'Not provided'}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="text-muted">Address</Col>
                <Col sm={8}>{user?.address || 'Not provided'}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="text-muted">Account Status</Col>
                <Col sm={8}>
                  <span className={`badge bg-${user?.isVerified ? 'success' : 'warning'}`}>
                    {user?.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="text-muted">Member Since</Col>
                <Col sm={8}>{formatDate(user?.createdAt)}</Col>
              </Row>
              <Button variant="primary" onClick={() => setEditing(true)}>Edit Profile</Button>
            </>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control name="fullName" value={formData.fullName} onChange={handleChange} required maxLength={100} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control name="phone" value={formData.phone} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control as="textarea" rows={2} name="address" value={formData.address} onChange={handleChange} />
              </Form.Group>
              <div className="d-flex gap-2">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : 'Save Changes'}
                </Button>
                <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;
