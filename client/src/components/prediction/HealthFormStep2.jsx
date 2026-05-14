import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { calculateBMI, validateGlucose, validateBMI } from '../../utils/validators';

const HealthFormStep2 = ({ formData, setFormData, onBack, onSubmit, loading }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const bmi = calculateBMI(Number(formData.weight), Number(formData.height));
    setFormData((prev) => ({ ...prev, bmi }));
  }, [formData.weight, formData.height, setFormData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let fieldValue;

    if (type === 'checkbox') {
      fieldValue = checked ? 1 : 0;
    } else {
      fieldValue = value;
    }

    setFormData((prev) => ({ ...prev, [name]: fieldValue }));

    if (touched[name]) {
      validateField(name, fieldValue);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'avgGlucoseLevel':
        if (!value && value !== 0) {
          newErrors.avgGlucoseLevel = 'Glucose level is required';
        } else if (!validateGlucose(value)) {
          newErrors.avgGlucoseLevel = 'Glucose level must be between 50 and 300';
        } else {
          delete newErrors.avgGlucoseLevel;
        }
        break;
      case 'weight':
        if (!value) {
          newErrors.weight = 'Weight is required';
        } else if (Number(value) <= 0) {
          newErrors.weight = 'Weight must be positive';
        } else {
          delete newErrors.weight;
        }
        break;
      case 'height':
        if (!value) {
          newErrors.height = 'Height is required';
        } else if (Number(value) <= 0) {
          newErrors.height = 'Height must be positive';
        } else {
          delete newErrors.height;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return newErrors;
  };

  const validateAll = () => {
    const allErrors = {};

    if (!formData.avgGlucoseLevel && formData.avgGlucoseLevel !== 0) {
      allErrors.avgGlucoseLevel = 'Glucose level is required';
    } else if (!validateGlucose(formData.avgGlucoseLevel)) {
      allErrors.avgGlucoseLevel = 'Glucose level must be between 50 and 300';
    }

    if (!formData.weight) {
      allErrors.weight = 'Weight is required';
    } else if (Number(formData.weight) <= 0) {
      allErrors.weight = 'Weight must be positive';
    }

    if (!formData.height) {
      allErrors.height = 'Height is required';
    } else if (Number(formData.height) <= 0) {
      allErrors.height = 'Height must be positive';
    }

    const bmi = calculateBMI(Number(formData.weight), Number(formData.height));
    if (formData.weight && formData.height && !validateBMI(bmi)) {
      allErrors.bmi = 'BMI must be between 10 and 60. Please check weight and height.';
    }

    setErrors(allErrors);
    setTouched({ avgGlucoseLevel: true, weight: true, height: true, bmi: true });

    return Object.keys(allErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAll()) {
      onSubmit();
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <h5 className="mb-3">Step 2: Health Metrics</h5>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="hypertension">
            <Form.Check
              type="switch"
              name="hypertension"
              label="Hypertension"
              checked={formData.hypertension === 1}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3" controlId="heartDisease">
            <Form.Check
              type="switch"
              name="heartDisease"
              label="Heart Disease"
              checked={formData.heartDisease === 1}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Form.Group className="mb-3" controlId="avgGlucoseLevel">
            <Form.Label>Average Glucose Level (mg/dL)</Form.Label>
            <Form.Control
              type="number"
              name="avgGlucoseLevel"
              placeholder="Enter glucose level (50-300)"
              value={formData.avgGlucoseLevel}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.avgGlucoseLevel && !!errors.avgGlucoseLevel}
              min={50}
              max={300}
              step="0.1"
            />
            <Form.Control.Feedback type="invalid">
              {errors.avgGlucoseLevel}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3" controlId="weight">
            <Form.Label>Weight (kg)</Form.Label>
            <Form.Control
              type="number"
              name="weight"
              placeholder="Enter weight"
              value={formData.weight}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.weight && !!errors.weight}
              min={1}
              step="0.1"
            />
            <Form.Control.Feedback type="invalid">
              {errors.weight}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3" controlId="height">
            <Form.Label>Height (cm)</Form.Label>
            <Form.Control
              type="number"
              name="height"
              placeholder="Enter height"
              value={formData.height}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.height && !!errors.height}
              min={1}
              step="0.1"
            />
            <Form.Control.Feedback type="invalid">
              {errors.height}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3" controlId="bmi">
            <Form.Label>BMI (auto-calculated)</Form.Label>
            <Form.Control
              type="number"
              name="bmi"
              value={formData.bmi || ''}
              readOnly
              plaintext={false}
              disabled
              isInvalid={touched.bmi && !!errors.bmi}
            />
            <Form.Control.Feedback type="invalid">
              {errors.bmi}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex justify-content-between mt-3">
        <Button variant="outline-secondary" onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
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
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </div>
    </Form>
  );
};

export default HealthFormStep2;
