import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Row, Col, Card, Badge, ListGroup, Tab, Tabs,
  Button, Alert
} from 'react-bootstrap';
import LoadingSpinner from '../common/LoadingSpinner';
import planService from '../../services/planService';
import { RISK_LEVELS } from '../../utils/constants';

const DietPlan = ({ predictionId: propPredictionId }) => {
  const { predictionId: paramPredictionId } = useParams();
  const predictionId = propPredictionId || paramPredictionId;

  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDietPlan = async () => {
      try {
        setLoading(true);
        const response = await planService.getDietPlan(predictionId);
        setDietPlan(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('not_found');
        } else {
          setError(err.response?.data?.message || 'Failed to load diet plan.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (predictionId) {
      fetchDietPlan();
    }
  }, [predictionId]);

  if (loading) {
    return <LoadingSpinner message="Loading your diet plan..." />;
  }

  if (error === 'not_found' || !dietPlan) {
    return (
      <Container className="py-5">
        <Alert variant="info" className="text-center">
          <Alert.Heading>No Diet Plan Available</Alert.Heading>
          <p className="mb-0">
            There is no diet plan available for this prediction. Please complete a health
            prediction first to receive personalized dietary recommendations.
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

  const riskConfig = RISK_LEVELS[dietPlan.riskLevel] || RISK_LEVELS.Medium;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
        <h2 className="mb-0">
          Your Diet Plan{' '}
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
          Your Diet Plan{' '}
          <Badge bg={riskConfig.bg} className="fs-6">
            {riskConfig.label}
          </Badge>
        </h2>
      </div>

      {/* Guidelines */}
      {dietPlan.guidelines && dietPlan.guidelines.length > 0 && (
        <Card className="mb-4 shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Dietary Guidelines</h5>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              {dietPlan.guidelines.map((guideline, index) => (
                <ListGroup.Item key={index}>
                  <i className="bi bi-check-circle text-primary me-2"></i>
                  {guideline}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      {/* Foods To Eat & Foods To Avoid */}
      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <Card className="shadow-sm h-100 border-success">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Foods to Eat</h5>
            </Card.Header>
            <Card.Body>
              {dietPlan.foodsToEat && dietPlan.foodsToEat.length > 0 ? (
                <ListGroup variant="flush">
                  {dietPlan.foodsToEat.map((food, index) => (
                    <ListGroup.Item key={index} className="border-0 py-1">
                      <i className="bi bi-check-lg text-success me-2"></i>
                      {food}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted mb-0">No specific recommendations.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm h-100 border-danger">
            <Card.Header className="bg-danger text-white">
              <h5 className="mb-0">Foods to Avoid</h5>
            </Card.Header>
            <Card.Body>
              {dietPlan.foodsToAvoid && dietPlan.foodsToAvoid.length > 0 ? (
                <ListGroup variant="flush">
                  {dietPlan.foodsToAvoid.map((food, index) => (
                    <ListGroup.Item key={index} className="border-0 py-1">
                      <i className="bi bi-x-lg text-danger me-2"></i>
                      {food}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted mb-0">No specific restrictions.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sample Meal Plan */}
      {dietPlan.sampleMealPlan && (
        <Card className="mb-4 shadow-sm">
          <Card.Header className="bg-info text-white">
            <h5 className="mb-0">Sample Meal Plan</h5>
          </Card.Header>
          <Card.Body>
            <Tabs defaultActiveKey="breakfast" className="mb-3">
              {dietPlan.sampleMealPlan.breakfast && (
                <Tab eventKey="breakfast" title="Breakfast">
                  <MealList items={dietPlan.sampleMealPlan.breakfast} />
                </Tab>
              )}
              {dietPlan.sampleMealPlan.lunch && (
                <Tab eventKey="lunch" title="Lunch">
                  <MealList items={dietPlan.sampleMealPlan.lunch} />
                </Tab>
              )}
              {dietPlan.sampleMealPlan.dinner && (
                <Tab eventKey="dinner" title="Dinner">
                  <MealList items={dietPlan.sampleMealPlan.dinner} />
                </Tab>
              )}
              {dietPlan.sampleMealPlan.snacks && (
                <Tab eventKey="snacks" title="Snacks">
                  <MealList items={dietPlan.sampleMealPlan.snacks} />
                </Tab>
              )}
            </Tabs>
          </Card.Body>
        </Card>
      )}

      {/* Special Notes */}
      {dietPlan.specialNotes && (
        <Card className="mb-4 shadow-sm border-warning">
          <Card.Header className="bg-warning">
            <h5 className="mb-0">Special Notes</h5>
          </Card.Header>
          <Card.Body>
            <p className="mb-0">{dietPlan.specialNotes}</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

const MealList = ({ items }) => {
  if (!items || items.length === 0) {
    return <p className="text-muted">No items listed.</p>;
  }

  if (typeof items === 'string') {
    return <p>{items}</p>;
  }

  return (
    <ListGroup variant="flush">
      {(Array.isArray(items) ? items : [items]).map((item, index) => (
        <ListGroup.Item key={index} className="py-2">
          <i className="bi bi-dot fs-4 text-primary me-1"></i>
          {typeof item === 'string' ? item : item.name || JSON.stringify(item)}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default DietPlan;
