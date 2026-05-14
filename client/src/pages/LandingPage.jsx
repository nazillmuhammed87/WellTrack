import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiActivity, FiHeart, FiUsers, FiArrowRight, FiShield, FiCheckCircle } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
        color: 'white',
        padding: '100px 0 80px'
      }}>
        <Container className="text-center">
          <FiShield size={60} className="mb-3" />
          <h1 className="display-3 fw-bold mb-3">WellTrack</h1>
          <p className="lead fs-4 mb-2">Intelligent Healthcare Management System</p>
          <p className="fs-5 mb-4 mx-auto" style={{ maxWidth: '600px', opacity: 0.9 }}>
            Predict your stroke risk using advanced machine learning, receive personalized health plans,
            and connect with recommended healthcare professionals.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Button as={Link} to="/register" variant="light" size="lg" className="px-4 fw-semibold">
              Get Started <FiArrowRight className="ms-2" />
            </Button>
            <Button as="a" href="#features" variant="outline-light" size="lg" className="px-4">
              Learn More
            </Button>
          </div>
        </Container>
      </div>

      {/* Features Section */}
      <Container id="features" className="py-5">
        <h2 className="text-center fw-bold mb-2">Why WellTrack?</h2>
        <p className="text-center text-muted mb-5">Comprehensive health risk management powered by AI</p>
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm text-center p-4">
              <Card.Body>
                <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex p-3 mb-3">
                  <FiActivity size={40} className="text-primary" />
                </div>
                <h4>AI-Powered Risk Assessment</h4>
                <p className="text-muted">
                  Our XGBoost machine learning model analyzes your health data to predict stroke risk
                  with high accuracy and provides detailed risk breakdowns.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm text-center p-4">
              <Card.Body>
                <div className="rounded-circle bg-danger bg-opacity-10 d-inline-flex p-3 mb-3">
                  <FiHeart size={40} className="text-danger" />
                </div>
                <h4>Personalized Health Plans</h4>
                <p className="text-muted">
                  Receive customized diet and workout plans tailored to your risk level, age, BMI,
                  and health conditions.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm text-center p-4">
              <Card.Body>
                <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex p-3 mb-3">
                  <FiUsers size={40} className="text-success" />
                </div>
                <h4>Expert Doctor Recommendations</h4>
                <p className="text-muted">
                  Get matched with specialists based on your risk profile — cardiologists, neurologists,
                  and preventive care providers.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* How It Works */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center fw-bold mb-5">How It Works</h2>
          <Row className="g-4">
            {[
              { step: '1', title: 'Create Account', desc: 'Sign up and get verified by our admin team' },
              { step: '2', title: 'Enter Health Data', desc: 'Complete a simple health assessment form' },
              { step: '3', title: 'Get Results & Plans', desc: 'Receive your risk analysis with personalized recommendations' }
            ].map((item, i) => (
              <Col md={4} key={i} className="text-center">
                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: 60, height: 60, fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {item.step}
                </div>
                <h5>{item.title}</h5>
                <p className="text-muted">{item.desc}</p>
                <FiCheckCircle size={24} className="text-success" />
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="py-5 text-center">
        <Container>
          <h2 className="fw-bold mb-3">Ready to take control of your health?</h2>
          <p className="text-muted mb-4 fs-5">Join WellTrack today and get your personalized health assessment</p>
          <Button as={Link} to="/register" variant="primary" size="lg" className="px-5">
            Get Started Free <FiArrowRight className="ms-2" />
          </Button>
        </Container>
      </div>
    </div>
  );
};

export default LandingPage;
