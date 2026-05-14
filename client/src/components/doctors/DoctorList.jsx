import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Row, Col, Alert, Pagination } from 'react-bootstrap';
import LoadingSpinner from '../common/LoadingSpinner';
import DoctorCard from './DoctorCard';
import DoctorFilters from './DoctorFilters';
import doctorService from '../../services/doctorService';

const DOCTORS_PER_PAGE = 9;
const SEARCH_DEBOUNCE_MS = 400;

const DoctorList = ({ riskLevel }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    specialization: '',
    district: '',
  });
  const debounceTimer = useRef(null);

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = riskLevel
        ? await doctorService.getRecommended(riskLevel)
        : await doctorService.getDoctors({ limit: 200 });
      setDoctors(response.data?.doctors || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load doctors.');
    } finally {
      setLoading(false);
    }
  }, [riskLevel]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleFilterChange = (newFilters) => {
    // Search input — debounce, update display value immediately
    if ('search' in newFilters && newFilters.search !== filters.search) {
      setSearchInput(newFilters.search);
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        setFilters(prev => ({ ...prev, search: newFilters.search }));
        setCurrentPage(1);
      }, SEARCH_DEBOUNCE_MS);
    } else {
      // Dropdowns apply immediately
      setFilters(newFilters);
      setCurrentPage(1);
    }
  };

  // Derive sorted unique districts from loaded doctors
  const districts = [...new Set(
    doctors.map(d => (d.address || '').split(',')[1]?.trim()).filter(Boolean)
  )].sort();

  // Client-side filtering
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      !filters.search ||
      (doctor.name || '').toLowerCase().includes(filters.search.toLowerCase());
    const matchesSpec =
      !filters.specialization || doctor.specialization === filters.specialization;
    const matchesDistrict =
      !filters.district ||
      (doctor.address || '').split(',')[1]?.trim() === filters.district;
    return matchesSearch && matchesSpec && matchesDistrict;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDoctors.length / DOCTORS_PER_PAGE);
  const startIndex = (currentPage - 1) * DOCTORS_PER_PAGE;
  const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + DOCTORS_PER_PAGE);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    items.push(
      <Pagination.First
        key="first"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(1)}
      />
    );
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => p - 1)}
      />
    );

    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
    }

    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => p + 1)}
      />
    );
    items.push(
      <Pagination.Last
        key="last"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(totalPages)}
      />
    );

    return (
      <div className="d-flex justify-content-center mt-4">
        <Pagination>{items}</Pagination>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading doctors..." />;
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">
        {riskLevel ? 'Recommended Doctors' : 'Find a Doctor'}
      </h2>

      <DoctorFilters filters={{ ...filters, search: searchInput }} onFilterChange={handleFilterChange} districts={districts} />

      {paginatedDoctors.length === 0 ? (
        <Alert variant="info" className="text-center">
          <Alert.Heading>No Doctors Found</Alert.Heading>
          <p className="mb-0">
            {filters.search || filters.specialization
              ? 'No doctors match your current filters. Try adjusting your search criteria.'
              : 'There are no doctors available at this time. Please check back later.'}
          </p>
        </Alert>
      ) : (
        <>
          <Row>
            {paginatedDoctors.map((doctor) => (
              <Col md={6} lg={4} key={doctor._id || doctor.id} className="mb-4">
                <DoctorCard doctor={doctor} />
              </Col>
            ))}
          </Row>
          {renderPagination()}
        </>
      )}
    </Container>
  );
};

export default DoctorList;
