import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';

const NotFoundPage = () => (
  <Container className="py-5 text-center">
    <FiAlertCircle size={80} className="text-muted mb-4" />
    <h1 className="display-4 fw-bold">404</h1>
    <p className="fs-4 text-muted mb-4">Page Not Found</p>
    <p className="text-muted mb-4">The page you're looking for doesn't exist or has been moved.</p>
    <Button as={Link} to="/" variant="primary" size="lg">Go Home</Button>
  </Container>
);

export default NotFoundPage;
