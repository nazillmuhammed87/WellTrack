import React from 'react';
import { Container, Card } from 'react-bootstrap';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => (
  <Container className="py-5 d-flex justify-content-center">
    <Card style={{ maxWidth: '600px', width: '100%' }} className="shadow-sm">
      <Card.Body className="p-4">
        <h3 className="text-center mb-4">Create Your Account</h3>
        <RegisterForm />
      </Card.Body>
    </Card>
  </Container>
);

export default RegisterPage;
