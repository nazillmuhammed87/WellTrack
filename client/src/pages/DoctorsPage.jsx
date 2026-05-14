import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import DoctorList from '../components/doctors/DoctorList';

const DoctorsPage = () => {
  const [searchParams] = useSearchParams();
  const riskLevel = searchParams.get('riskLevel');

  return (
    <Container className="py-4">
      <h2 className="mb-4">
        {riskLevel ? `Recommended Doctors for ${riskLevel} Risk` : 'Find Doctors'}
      </h2>
      <DoctorList riskLevel={riskLevel} />
    </Container>
  );
};

export default DoctorsPage;
