import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import WorkoutPlan from '../components/plans/WorkoutPlan';

const WorkoutPlanPage = () => {
  const { predictionId } = useParams();
  return (
    <Container className="py-4">
      <WorkoutPlan predictionId={predictionId} />
    </Container>
  );
};

export default WorkoutPlanPage;
