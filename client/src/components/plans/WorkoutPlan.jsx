import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Row, Col, Card, Badge, ListGroup, Table,
  Button, Alert
} from 'react-bootstrap';
import LoadingSpinner from '../common/LoadingSpinner';
import planService from '../../services/planService';
import { RISK_LEVELS } from '../../utils/constants';

const WorkoutPlan = ({ predictionId: propPredictionId }) => {
  const { predictionId: paramPredictionId } = useParams();
  const predictionId = propPredictionId || paramPredictionId;

  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        setLoading(true);
        const response = await planService.getWorkoutPlan(predictionId);
        setWorkoutPlan(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('not_found');
        } else {
          setError(err.response?.data?.message || 'Failed to load workout plan.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (predictionId) {
      fetchWorkoutPlan();
    }
  }, [predictionId]);

  if (loading) {
    return <LoadingSpinner message="Loading your workout plan..." />;
  }

  if (error === 'not_found' || !workoutPlan) {
    return (
      <Container className="py-5">
        <Alert variant="info" className="text-center">
          <Alert.Heading>No Workout Plan Available</Alert.Heading>
          <p className="mb-0">
            There is no workout plan available for this prediction. Please complete a health
            prediction first to receive personalized exercise recommendations.
          </p>
        </Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">{error}</Alert>
      </Container>
    );
  }

  const riskConfig = RISK_LEVELS[workoutPlan.riskLevel] || RISK_LEVELS.Medium;

  const intensityBadge = (intensity) => {
    const variants = {
      low: 'success',
      moderate: 'warning',
      high: 'danger',
    };
    const key = (intensity || '').toLowerCase();
    return variants[key] || 'secondary';
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
        <h2 className="mb-0">
          Your Workout Plan{' '}
          <Badge bg={riskConfig.bg} className="fs-6">
            {riskConfig.label}
          </Badge>
        </h2>
        <Button variant="outline-secondary" onClick={() => window.print()}>
          <i className="bi bi-printer me-2"></i>Print Plan
        </Button>
      </div>

      <div className="d-none d-print-block mb-4">
        <h2>
          Your Workout Plan{' '}
          <Badge bg={riskConfig.bg} className="fs-6">
            {riskConfig.label}
          </Badge>
        </h2>
      </div>

      {/* Guidelines */}
      {workoutPlan.guidelines && workoutPlan.guidelines.length > 0 && (
        <Card className="mb-4 shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Exercise Guidelines</h5>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              {workoutPlan.guidelines.map((guideline, index) => (
                <ListGroup.Item key={index}>
                  <i className="bi bi-check-circle text-primary me-2"></i>
                  {guideline}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      {/* Exercises */}
      {workoutPlan.exercises && workoutPlan.exercises.length > 0 && (
        <>
          <h4 className="mb-3">Recommended Exercises</h4>
          <Row className="mb-4">
            {workoutPlan.exercises.map((exercise, index) => (
              <Col md={6} lg={4} key={index} className="mb-3">
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-start">
                      <span>{exercise.name}</span>
                      {exercise.intensity && (
                        <Badge bg={intensityBadge(exercise.intensity)} className="ms-2">
                          {exercise.intensity}
                        </Badge>
                      )}
                    </Card.Title>
                    {exercise.description && (
                      <Card.Text className="text-muted">{exercise.description}</Card.Text>
                    )}
                    <ListGroup variant="flush" className="small">
                      {exercise.duration && (
                        <ListGroup.Item className="px-0 py-1">
                          <strong>Duration:</strong> {exercise.duration}
                        </ListGroup.Item>
                      )}
                      {exercise.frequency && (
                        <ListGroup.Item className="px-0 py-1">
                          <strong>Frequency:</strong> {exercise.frequency}
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* Weekly Schedule */}
      {workoutPlan.weeklySchedule && workoutPlan.weeklySchedule.length > 0 && (
        <Card className="mb-4 shadow-sm">
          <Card.Header className="bg-info text-white">
            <h5 className="mb-0">Weekly Schedule</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <Table responsive striped hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Day</th>
                  <th>Activity</th>
                  <th>Duration</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {workoutPlan.weeklySchedule.map((day, index) => (
                  <tr key={index}>
                    <td className="fw-bold">{day.day}</td>
                    <td>{day.activity || day.exercise || 'Rest'}</td>
                    <td>{day.duration || '-'}</td>
                    <td>{day.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Safety Notes */}
      {workoutPlan.safetyNotes && workoutPlan.safetyNotes.length > 0 && (
        <Card className="mb-4 shadow-sm border-warning">
          <Card.Header className="bg-warning">
            <h5 className="mb-0">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Safety Notes
            </h5>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              {workoutPlan.safetyNotes.map((note, index) => (
                <ListGroup.Item key={index} className="border-0 py-1 text-dark">
                  <i className="bi bi-exclamation-circle text-warning me-2"></i>
                  {note}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default WorkoutPlan;
