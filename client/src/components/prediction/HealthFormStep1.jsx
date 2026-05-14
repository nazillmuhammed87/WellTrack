import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { WORK_TYPES, SMOKING_STATUS } from '../../utils/constants';
import { validateAge } from '../../utils/validators';

const HealthFormStep1 = ({ formData, setFormData, onNext }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      validateField(name, value);
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
      case 'age':
        if (!value) {
          newErrors.age = 'Age is required';
        } else if (!validateAge(value)) {
          newErrors.age = 'Age must be between 18 and 100';
        } else {
          delete newErrors.age;
        }
        break;
      case 'gender':
        if (!value) {
          newErrors.gender = 'Gender is required';
        } else {
          delete newErrors.gender;
        }
        break;
      case 'everMarried':
        if (!value) {
          newErrors.everMarried = 'This field is required';
        } else {
          delete newErrors.everMarried;
        }
        break;
      case 'workType':
        if (!value) {
          newErrors.workType = 'Work type is required';
        } else {
          delete newErrors.workType;
        }
        break;
      case 'residenceType':
        if (!value) {
          newErrors.residenceType = 'Residence type is required';
        } else {
          delete newErrors.residenceType;
        }
        break;
      case 'smokingStatus':
        if (!value) {
          newErrors.smokingStatus = 'Smoking status is required';
        } else {
          delete newErrors.smokingStatus;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return newErrors;
  };

  const validateAll = () => {
    const fields = ['age', 'gender', 'everMarried', 'workType', 'residenceType', 'smokingStatus'];
    let allErrors = {};

    fields.forEach((field) => {
      const value = formData[field];
      if (field === 'age') {
        if (!value) {
          allErrors.age = 'Age is required';
        } else if (!validateAge(value)) {
          allErrors.age = 'Age must be between 18 and 100';
        }
      } else if (!value) {
        const labels = {
          gender: 'Gender is required',
          everMarried: 'This field is required',
          workType: 'Work type is required',
          residenceType: 'Residence type is required',
          smokingStatus: 'Smoking status is required',
        };
        allErrors[field] = labels[field];
      }
    });

    setErrors(allErrors);
    setTouched(
      fields.reduce((acc, f) => ({ ...acc, [f]: true }), {})
    );

    return Object.keys(allErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateAll()) {
      onNext();
    }
  };

  return (
    <Form noValidate onSubmit={handleNext}>
      <h5 className="mb-3">Step 1: Demographics</h5>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="age">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              name="age"
              placeholder="Enter your age"
              value={formData.age}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.age && !!errors.age}
              min={18}
              max={100}
            />
            <Form.Control.Feedback type="invalid">
              {errors.age}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3" controlId="gender">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.gender && !!errors.gender}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.gender}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="everMarried">
            <Form.Label>Ever Married</Form.Label>
            <Form.Select
              name="everMarried"
              value={formData.everMarried}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.everMarried && !!errors.everMarried}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.everMarried}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3" controlId="workType">
            <Form.Label>Work Type</Form.Label>
            <Form.Select
              name="workType"
              value={formData.workType}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.workType && !!errors.workType}
            >
              <option value="">Select work type</option>
              {WORK_TYPES.map((wt) => (
                <option key={wt.value} value={wt.value}>
                  {wt.label}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.workType}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="residenceType">
            <Form.Label>Residence Type</Form.Label>
            <Form.Select
              name="residenceType"
              value={formData.residenceType}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.residenceType && !!errors.residenceType}
            >
              <option value="">Select residence type</option>
              <option value="Urban">Urban</option>
              <option value="Rural">Rural</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.residenceType}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3" controlId="smokingStatus">
            <Form.Label>Smoking Status</Form.Label>
            <Form.Select
              name="smokingStatus"
              value={formData.smokingStatus}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.smokingStatus && !!errors.smokingStatus}
            >
              <option value="">Select smoking status</option>
              {SMOKING_STATUS.map((ss) => (
                <option key={ss.value} value={ss.value}>
                  {ss.label}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.smokingStatus}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex justify-content-end mt-3">
        <Button variant="primary" type="submit">
          Next
        </Button>
      </div>
    </Form>
  );
};

export default HealthFormStep1;
