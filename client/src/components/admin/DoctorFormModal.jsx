import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { SPECIALIZATIONS } from '../../utils/constants';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const initialForm = {
  name: '',
  email: '',
  phone: '',
  specialization: '',
  hospital: '',
  address: '',
  experience: '',
  rating: '',
  consultationFee: '',
  availableDays: [],
  availableTimeFrom: '09:00',
  availableTimeTo: '17:00'
};

const DoctorFormModal = ({ show, onHide, doctor, onSave }) => {
  const [form, setForm] = useState(initialForm);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doctor) {
      setForm({
        name: doctor.name || '',
        email: doctor.email || '',
        phone: doctor.phone || '',
        specialization: doctor.specialization || '',
        hospital: doctor.hospital || '',
        address: doctor.address || '',
        experience: doctor.experience || '',
        rating: doctor.rating || '',
        consultationFee: doctor.consultationFee || '',
        availableDays: doctor.availableDays || [],
        availableTimeFrom: doctor.availableTime?.from || '09:00',
        availableTimeTo: doctor.availableTime?.to || '17:00'
      });
    } else {
      setForm(initialForm);
    }
    setValidated(false);
  }, [doctor, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day) => {
    setForm((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (!form.name.trim() || !form.specialization || !form.hospital.trim()) {
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      specialization: form.specialization,
      hospital: form.hospital,
      address: form.address,
      experience: form.experience ? Number(form.experience) : undefined,
      rating: form.rating ? Number(form.rating) : undefined,
      consultationFee: form.consultationFee ? Number(form.consultationFee) : undefined,
      availableDays: form.availableDays,
      availableTime: {
        from: form.availableTimeFrom,
        to: form.availableTimeTo
      }
    };

    setLoading(true);
    try {
      await onSave(payload);
    } catch {
      // error handled by parent
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setValidated(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{doctor ? 'Edit Doctor' : 'Add Doctor'}</Modal.Title>
      </Modal.Header>
      <Form noValidate onSubmit={handleSubmit}>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  isInvalid={validated && !form.name.trim()}
                  placeholder="Doctor's full name"
                />
                <Form.Control.Feedback type="invalid">Name is required.</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email address"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Specialization <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  isInvalid={validated && !form.specialization}
                >
                  <option value="">Select specialization</option>
                  {SPECIALIZATIONS.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">Specialization is required.</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Hospital <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  name="hospital"
                  value={form.hospital}
                  onChange={handleChange}
                  isInvalid={validated && !form.hospital.trim()}
                  placeholder="Hospital / Clinic name"
                />
                <Form.Control.Feedback type="invalid">Hospital is required.</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Address"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Experience (years)</Form.Label>
                <Form.Control
                  name="experience"
                  type="number"
                  min="0"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="Years"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Rating</Form.Label>
                <Form.Control
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={handleChange}
                  placeholder="0 - 5"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Consultation Fee</Form.Label>
                <Form.Control
                  name="consultationFee"
                  type="number"
                  min="0"
                  value={form.consultationFee}
                  onChange={handleChange}
                  placeholder="Fee amount"
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Label>Available Days</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <Form.Check
                    key={day}
                    type="checkbox"
                    id={`day-${day}`}
                    label={day}
                    checked={form.availableDays.includes(day)}
                    onChange={() => handleDayToggle(day)}
                  />
                ))}
              </div>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Available From</Form.Label>
                <Form.Control
                  name="availableTimeFrom"
                  type="time"
                  value={form.availableTimeFrom}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Available To</Form.Label>
                <Form.Control
                  name="availableTimeTo"
                  type="time"
                  value={form.availableTimeTo}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading && <Spinner animation="border" size="sm" className="me-1" />}
            {doctor ? 'Update' : 'Add'} Doctor
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default DoctorFormModal;
