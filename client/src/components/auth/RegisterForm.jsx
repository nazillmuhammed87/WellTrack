import React, { useState } from 'react';
import { Form, Button, Spinner, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = (field, value) => {
    const newErrors = { ...errors };
    const data = field === 'all' ? formData : { ...formData, [field]: value };

    const validateField = (name) => {
      switch (name) {
        case 'fullName':
          if (!data.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
          } else {
            delete newErrors.fullName;
          }
          break;

        case 'email':
          if (!data.email.trim()) {
            newErrors.email = 'Email is required';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            newErrors.email = 'Please enter a valid email address';
          } else {
            delete newErrors.email;
          }
          break;

        case 'password':
          if (!data.password) {
            newErrors.password = 'Password is required';
          } else if (data.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
          } else {
            delete newErrors.password;
          }
          // Re-validate confirmPassword when password changes
          if (data.confirmPassword && data.password !== data.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
          } else if (data.confirmPassword) {
            delete newErrors.confirmPassword;
          }
          break;

        case 'confirmPassword':
          if (!data.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
          } else if (data.password !== data.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
          } else {
            delete newErrors.confirmPassword;
          }
          break;

        default:
          break;
      }
    };

    if (field === 'all') {
      ['fullName', 'email', 'password', 'confirmPassword'].forEach(validateField);
    } else {
      validateField(field);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      validate(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!validate('all')) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

      if (formData.phone.trim()) {
        payload.phone = formData.phone.trim();
      }

      if (formData.gender) {
        payload.gender = formData.gender;
      }

      await register(payload);

      toast.success('Registration successful. Please wait for admin verification.');
      navigate('/login');
    } catch (error) {
      const message =
        error?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
      <Card.Body className="p-4">
        <h3 className="text-center mb-4">Create an Account</h3>

        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="registerFullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.fullName && !!errors.fullName}
              disabled={loading}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fullName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerEmail">
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

          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Create a password (min 6 characters)"
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

          <Form.Group className="mb-3" controlId="registerConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.confirmPassword && !!errors.confirmPassword}
              disabled={loading}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerPhone">
            <Form.Label>
              Phone <span className="text-muted">(optional)</span>
            </Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerGender">
            <Form.Label>
              Gender <span className="text-muted">(optional)</span>
            </Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </Form.Select>
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
                Registering...
              </>
            ) : (
              'Register'
            )}
          </Button>

          <div className="text-center">
            <span>Already have an account? </span>
            <Link to="/login" className="text-decoration-none">
              Login here
            </Link>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RegisterForm;
