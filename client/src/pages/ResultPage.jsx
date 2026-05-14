import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import PredictionResult from '../components/prediction/PredictionResult';

const ResultPage = () => {
  const { id } = useParams();
  return (
    <Container className="py-4">
      <PredictionResult predictionId={id} />
    </Container>
  );
};

export default ResultPage;
