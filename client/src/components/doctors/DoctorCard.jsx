import React from 'react';
import { Card, Badge, ListGroup } from 'react-bootstrap';

const DoctorCard = ({ doctor }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalf = (rating || 0) - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <i key={i} className="bi bi-star-fill text-warning"></i>
        );
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <i key={i} className="bi bi-star-half text-warning"></i>
        );
      } else {
        stars.push(
          <i key={i} className="bi bi-star text-warning"></i>
        );
      }
    }
    return stars;
  };

  return (
    <Card className="shadow-sm h-100">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-start">
          <span>{doctor.name}</span>
          {doctor.specialization && (
            <Badge bg="primary" className="ms-2">
              {doctor.specialization}
            </Badge>
          )}
        </Card.Title>

        {doctor.hospital && (
          <Card.Subtitle className="mb-2 text-muted">
            <i className="bi bi-building me-1"></i>
            {doctor.hospital}
          </Card.Subtitle>
        )}

        <div className="mb-2">
          {renderStars(doctor.rating)}
          {doctor.rating != null && (
            <span className="ms-2 text-muted small">({doctor.rating})</span>
          )}
        </div>

        <ListGroup variant="flush" className="small mb-3">
          {doctor.experience != null && (
            <ListGroup.Item className="px-0 py-1">
              <i className="bi bi-briefcase me-2 text-primary"></i>
              <strong>Experience:</strong> {doctor.experience} years
            </ListGroup.Item>
          )}
          {doctor.availableDays && doctor.availableDays.length > 0 && (
            <ListGroup.Item className="px-0 py-1">
              <i className="bi bi-calendar-check me-2 text-info"></i>
              <strong>Available:</strong>{' '}
              {Array.isArray(doctor.availableDays)
                ? doctor.availableDays.join(', ')
                : doctor.availableDays}
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card.Body>

      {(doctor.email || doctor.phone) && (
        <Card.Footer className="bg-light">
          <div className="small">
            {doctor.email && (
              <div className="mb-1">
                <i className="bi bi-envelope me-2 text-muted"></i>
                <a href={`mailto:${doctor.email}`} className="text-decoration-none">
                  {doctor.email}
                </a>
              </div>
            )}
            {doctor.phone && (
              <div>
                <i className="bi bi-telephone me-2 text-muted"></i>
                <a href={`tel:${doctor.phone}`} className="text-decoration-none">
                  {doctor.phone}
                </a>
              </div>
            )}
          </div>
        </Card.Footer>
      )}
    </Card>
  );
};

export default DoctorCard;
