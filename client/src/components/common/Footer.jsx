import React from 'react';
import { Container } from 'react-bootstrap';
import { MEDICAL_DISCLAIMER } from '../../utils/constants';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <Container>
        <p className="text-muted small mb-1">{MEDICAL_DISCLAIMER}</p>
        <p className="text-muted small mb-0">
          &copy; {new Date().getFullYear()} WellTrack. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
