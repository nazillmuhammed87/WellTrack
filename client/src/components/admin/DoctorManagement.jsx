import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Badge, Spinner } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';
import DoctorFormModal from './DoctorFormModal';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getDoctors();
      setDoctors(response.data.doctors || response.data || []);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleAdd = () => {
    setEditDoctor(null);
    setModalShow(true);
  };

  const handleEdit = (doctor) => {
    setEditDoctor(doctor);
    setModalShow(true);
  };

  const handleDelete = async (doctor) => {
    if (!window.confirm(`Are you sure you want to delete Dr. ${doctor.name}?`)) {
      return;
    }
    setDeleteId(doctor._id);
    try {
      await adminService.deleteDoctor(doctor._id);
      toast.success(`Dr. ${doctor.name} deleted successfully`);
      fetchDoctors();
    } catch (error) {
      toast.error('Failed to delete doctor');
    } finally {
      setDeleteId(null);
    }
  };

  const handleSave = async (data) => {
    if (editDoctor) {
      await adminService.updateDoctor(editDoctor._id, data);
      toast.success('Doctor updated successfully');
    } else {
      await adminService.createDoctor(data);
      toast.success('Doctor added successfully');
    }
    setModalShow(false);
    fetchDoctors();
  };

  const renderRating = (rating) => {
    if (!rating) return '-';
    return (
      <span>
        <FaStar className="text-warning me-1" />
        {Number(rating).toFixed(1)}
      </span>
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Doctors</h5>
        <Button variant="primary" onClick={handleAdd}>
          <FaPlus className="me-1" /> Add Doctor
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : doctors.length === 0 ? (
        <p className="text-center text-muted py-4">No doctors found.</p>
      ) : (
        <Table responsive hover className="align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Hospital</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor._id}>
                <td>{doctor.name}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.hospital}</td>
                <td>{renderRating(doctor.rating)}</td>
                <td>
                  <Badge bg={doctor.isActive !== false ? 'success' : 'secondary'}>
                    {doctor.isActive !== false ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-1"
                    onClick={() => handleEdit(doctor)}
                    title="Edit"
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(doctor)}
                    disabled={deleteId === doctor._id}
                    title="Delete"
                  >
                    {deleteId === doctor._id ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <FaTrash />
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <DoctorFormModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        doctor={editDoctor}
        onSave={handleSave}
      />
    </div>
  );
};

export default DoctorManagement;
