import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Spinner, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import RiskGauge from './RiskGauge';
import FeatureChart from './FeatureChart';
import predictionService from '../../services/predictionService';
import { RISK_LEVELS } from '../../utils/constants';
import { formatPercentage, formatDate } from '../../utils/formatters';

const PredictionResult = ({ prediction: predictionProp }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(predictionProp || null);
  const [loading, setLoading] = useState(!predictionProp && !!id);

  useEffect(() => {
    if (!predictionProp && id) {
      fetchPrediction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, predictionProp]);

  const fetchPrediction = async () => {
    try {
      setLoading(true);
      const response = await predictionService.getPrediction(id);
      const data = response.data;
      setPrediction(data && data._id ? data : data?.prediction && data.prediction._id ? data.prediction : data);
    } catch (error) {
      toast.error('Failed to load prediction result.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading prediction result...</p>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No prediction data available.</p>
        <Button variant="primary" onClick={() => navigate('/prediction')}>
          New Prediction
        </Button>
      </div>
    );
  }

  const riskLevel = prediction.riskLevel || 'Low';
  const riskConfig = RISK_LEVELS[riskLevel] || RISK_LEVELS.Low;
  const probability = prediction.probability || 0;
  const confidence = prediction.confidence || prediction.confidenceScore || 0;
  const topFeatures = prediction.topFeatures || prediction.features || [];

  return (
    <div className="mx-auto" style={{ maxWidth: '800px' }}>
      <Card className="shadow-sm mb-4">
        <Card.Body className="p-4">
          <h3 className="text-center mb-4">Prediction Result</h3>

          {prediction.createdAt && (
            <p className="text-center text-muted mb-4">
              Assessment Date: {formatDate(prediction.createdAt)}
            </p>
          )}

          {/* Risk Gauge */}
          <div className="mb-4">
            <RiskGauge probability={probability} riskLevel={riskLevel} />
          </div>

          {/* Risk Details */}
          <Row className="text-center mb-4">
            <Col md={4}>
              <Card className="border-0 bg-light">
                <Card.Body>
                  <h6 className="text-muted">Probability</h6>
                  <h4>{formatPercentage(probability)}</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 bg-light">
                <Card.Body>
                  <h6 className="text-muted">Risk Level</h6>
                  <h4>
                    <Badge bg={riskConfig.bg}>{riskConfig.label}</Badge>
                  </h4>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 bg-light">
                <Card.Body>
                  <h6 className="text-muted">Confidence</h6>
                  <h4>{formatPercentage(confidence)}</h4>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Feature Importance Chart */}
          {topFeatures.length > 0 && (
            <div className="mb-4">
              <h5 className="mb-3">What Affected Your Risk</h5>
              <FeatureChart features={topFeatures} />
            </div>
          )}

          {/* Action Buttons */}
          <Row className="g-2 mt-4">
            <Col sm={6} md={3}>
              <Button
                variant="success"
                className="w-100"
                onClick={() => navigate(`/diet-plan/${prediction._id || id}`)}
              >
                View Diet Plan
              </Button>
            </Col>
            <Col sm={6} md={3}>
              <Button
                variant="info"
                className="w-100 text-white"
                onClick={() => navigate(`/workout-plan/${prediction._id || id}`)}
              >
                View Workout Plan
              </Button>
            </Col>
            <Col sm={6} md={3}>
              <Button
                variant="warning"
                className="w-100"
                onClick={() => navigate('/doctors')}
              >
                View Recommended Doctors
              </Button>
            </Col>
            <Col sm={6} md={3}>
              <Button
                variant="primary"
                className="w-100"
                onClick={() => navigate('/prediction')}
              >
                New Prediction
              </Button>
            </Col>
          </Row>

          <div className="text-center mt-3">
            <Button variant="outline-secondary" onClick={handlePrint}>
              Print Result
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PredictionResult;
