import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, Form, InputGroup, Button, Badge, Pagination, Spinner, Row, Col
} from 'react-bootstrap';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';
import { formatDate } from '../../utils/formatters';
import UserVerificationModal from './UserVerificationModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Modal state
  const [modalShow, setModalShow] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [modalAction, setModalAction] = useState('verify');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      const response = await adminService.getUsers(params);
      setUsers(response.data.users || response.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const openModal = (user, action) => {
    setModalUser(user);
    setModalAction(action);
    setModalShow(true);
  };

  const handleModalConfirm = async (reason) => {
    try {
      if (modalAction === 'verify') {
        await adminService.verifyUser(modalUser._id);
        toast.success(`${modalUser.fullName} verified successfully`);
      } else {
        await adminService.rejectUser(modalUser._id, reason);
        toast.success(`${modalUser.fullName} rejected`);
      }
      setModalShow(false);
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      toast.error(`Failed to ${modalAction} user`);
      throw error;
    }
  };

  const handleCheckbox = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const unverifiedIds = users
        .filter((u) => !u.isVerified)
        .map((u) => u._id);
      setSelectedUsers(unverifiedIds);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkVerify = async () => {
    if (selectedUsers.length === 0) return;
    setBulkLoading(true);
    try {
      await adminService.bulkVerifyUsers(selectedUsers);
      toast.success(`${selectedUsers.length} user(s) verified successfully`);
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      toast.error('Bulk verification failed');
    } finally {
      setBulkLoading(false);
    }
  };

  const getStatusBadge = (user) => {
    if (user.isVerified) {
      return <Badge bg="success">Verified</Badge>;
    }
    return <Badge bg="warning" text="dark">Pending</Badge>;
  };

  const unverifiedUsers = users.filter((u) => !u.isVerified);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
          {i}
        </Pagination.Item>
      );
    }
    return <Pagination className="justify-content-center mt-3">{items}</Pagination>;
  };

  return (
    <div>
      <Row className="mb-3 g-2 align-items-center">
        <Col md={5}>
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select value={statusFilter} onChange={handleFilterChange}>
            <option value="all">All Users</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </Form.Select>
        </Col>
        <Col md={4} className="text-end">
          {selectedUsers.length > 0 && (
            <Button
              variant="success"
              onClick={handleBulkVerify}
              disabled={bulkLoading}
            >
              {bulkLoading ? (
                <Spinner animation="border" size="sm" className="me-1" />
              ) : (
                <FaCheckCircle className="me-1" />
              )}
              Verify Selected ({selectedUsers.length})
            </Button>
          )}
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : users.length === 0 ? (
        <p className="text-center text-muted py-4">No users found.</p>
      ) : (
        <>
          <Table responsive hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      unverifiedUsers.length > 0 &&
                      selectedUsers.length === unverifiedUsers.length
                    }
                    disabled={unverifiedUsers.length === 0}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    {!user.isVerified && (
                      <Form.Check
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleCheckbox(user._id)}
                      />
                    )}
                  </td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{getStatusBadge(user)}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    {!user.isVerified && (
                      <>
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="me-1"
                          onClick={() => openModal(user, 'verify')}
                          title="Verify"
                        >
                          <FaCheckCircle />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="me-1"
                          onClick={() => openModal(user, 'reject')}
                          title="Reject"
                        >
                          <FaTimesCircle />
                        </Button>
                      </>
                    )}
                    <Button variant="outline-primary" size="sm" title="View">
                      <FaEye />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {renderPagination()}
        </>
      )}

      <UserVerificationModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        user={modalUser}
        action={modalAction}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default UserManagement;
