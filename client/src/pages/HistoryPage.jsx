import React from 'react';
import { Container } from 'react-bootstrap';
import PredictionHistory from '../components/prediction/PredictionHistory';

const HistoryPage = () => (
  <Container className="py-4">
    <h2 className="mb-4">Prediction History</h2>
    <PredictionHistory />
  </Container>
);

export default HistoryPage;
