import React from 'react';
import { Container } from 'react-bootstrap';
import AdminDashboard from '../components/admin/AdminDashboard';

const AdminDashboardPage = () => (
  <Container fluid className="py-4 px-4">
    <h2 className="mb-4">Admin Dashboard</h2>
    <AdminDashboard />
  </Container>
);

export default AdminDashboardPage;
