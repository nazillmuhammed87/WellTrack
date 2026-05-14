import React, { useState } from 'react';
import { Form, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(null);
  const [lockoutMessage, setLockoutMessage] = useState('');

  const validate = (field, value) => {
    const newErrors = { ...errors };

    if (field === 'email' || field === 'all') {
      const emailVal = field === 'all' ? formData.email : value;
      if (!emailVal.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        delete newErrors.email;
      }
    }

    if (field === 'password' || field === 'all') {
      const passwordVal = field === 'all' ? formData.password : value;
      if (!passwordVal) {
        newErrors.password = 'Password is required';
      } else if (passwordVal.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: fieldValue }));

    if (touched[name]) {
      validate(name, fieldValue);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ email: true, password: true });

    if (!validate('all')) {
      return;
    }

    setLoading(true);
    setLockoutMessage('');
    setRemainingAttempts(null);

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      toast.success('Login successful!');

      if (response?.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      const data = error?.response?.data;

      if (data?.locked) {
        setLockoutMessage(
          data.message || 'Your account has been locked due to too many failed attempts. Please try again later.'
        );
      } else {
        if (data?.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
        toast.error(data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm mx-auto" style={{ maxWidth: '450px' }}>
      <Card.Body className="p-4">
        <h3 className="text-center mb-4">Login</h3>

        {lockoutMessage && (
          <Alert variant="danger">{lockoutMessage}</Alert>
        )}

        {remainingAttempts !== null && !lockoutMessage && (
          <Alert variant="warning">
            {remainingAttempts} login attempt{remainingAttempts !== 1 ? 's' : ''} remaining before your account is locked.
          </Alert>
        )}

        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="loginEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.email && !!errors.email}
              disabled={loading}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="loginPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.password && !!errors.password}
              disabled={loading}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="rememberMe">
            <Form.Check
              type="checkbox"
              name="rememberMe"
              label="Remember Me"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <Link to="/forgot-password" className="text-decoration-none">
              Forgot Password?
            </Link>
          </div>

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
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>

          <div className="text-center">
            <span>Don&apos;t have an account? </span>
            <Link to="/register" className="text-decoration-none">
              Register here
            </Link>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LoginForm;
