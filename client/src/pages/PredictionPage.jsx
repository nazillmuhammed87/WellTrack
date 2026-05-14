import React from 'react';
import { Container } from 'react-bootstrap';
import HealthForm from '../components/prediction/HealthForm';

const PredictionPage = () => (
  <Container className="py-4">
    <h2 className="mb-4">Health Risk Assessment</h2>
    <HealthForm />
  </Container>
);

export default PredictionPage;
