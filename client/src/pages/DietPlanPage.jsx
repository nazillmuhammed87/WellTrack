import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import DietPlan from '../components/plans/DietPlan';

const DietPlanPage = () => {
  const { predictionId } = useParams();
  return (
    <Container className="py-4">
      <DietPlan predictionId={predictionId} />
    </Container>
  );
};

export default DietPlanPage;
