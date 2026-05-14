import React from 'react';
import { Container, Card } from 'react-bootstrap';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => (
  <Container className="py-5 d-flex justify-content-center">
    <Card style={{ maxWidth: '500px', width: '100%' }} className="shadow-sm">
      <Card.Body className="p-4">
        <h3 className="text-center mb-4">Sign In to WellTrack</h3>
        <LoginForm />
      </Card.Body>
    </Card>
  </Container>
);

export default LoginPage;
