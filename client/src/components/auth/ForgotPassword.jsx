import React, { useState } from 'react';
import { Form, Button, Spinner, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (value) => {
    if (!value.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleBlur = () => {
    setTouched(true);
    validateEmail(email);
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (touched) {
      validateEmail(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);

    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);

    // Simulate a brief delay for UX
    setTimeout(() => {
      toast.info('Password reset functionality coming soon');
      setLoading(false);
    }, 500);
  };

  return (
    <Card className="shadow-sm mx-auto" style={{ maxWidth: '450px' }}>
      <Card.Body className="p-4">
        <h3 className="text-center mb-2">Forgot Password</h3>
        <p className="text-center text-muted mb-4">
          Enter your email address and we will send you a link to reset your password.
        </p>

        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="forgotPasswordEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched && !!error}
              disabled={loading}
            />
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Sending...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>

          <div className="text-center">
            <Link to="/login" className="text-decoration-none">
              Back to Login
            </Link>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ForgotPassword;
