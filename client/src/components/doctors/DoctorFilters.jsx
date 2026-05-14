import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { SPECIALIZATIONS } from '../../utils/constants';

const DoctorFilters = ({ filters, onFilterChange, districts = [] }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <Form className="mb-4">
      <Row className="g-3 align-items-end">
        <Col md={4}>
          <Form.Group controlId="doctorSearch">
            <Form.Label>Search by Name</Form.Label>
            <Form.Control
              type="text"
              name="search"
              placeholder="Enter doctor name..."
              value={filters.search || ''}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="doctorSpecialization">
            <Form.Label>Specialization</Form.Label>
            <Form.Select
              name="specialization"
              value={filters.specialization || ''}
              onChange={handleChange}
            >
              <option value="">All Specializations</option>
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="doctorDistrict">
            <Form.Label>District</Form.Label>
            <Form.Select
              name="district"
              value={filters.district || ''}
              onChange={handleChange}
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Button
            variant="outline-secondary"
            className="w-100"
            onClick={() => onFilterChange({ search: '', specialization: '', district: '' })}
          >
            Clear
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default DoctorFilters;
