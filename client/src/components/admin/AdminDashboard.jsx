import React, { useState } from 'react';
import { Container, Nav } from 'react-bootstrap';
import { FaUsers, FaUserMd, FaComments, FaChartBar } from 'react-icons/fa';
import AdminStats from './AdminStats';
import UserManagement from './UserManagement';
import DoctorManagement from './DoctorManagement';
import FeedbackManagement from './FeedbackManagement';
import AnalyticsCharts from './AnalyticsCharts';

const TABS = [
  { key: 'users', label: 'Users', icon: <FaUsers className="me-2" /> },
  { key: 'doctors', label: 'Doctors', icon: <FaUserMd className="me-2" /> },
  { key: 'feedback', label: 'Feedback', icon: <FaComments className="me-2" /> },
  { key: 'analytics', label: 'Analytics', icon: <FaChartBar className="me-2" /> }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'doctors':
        return <DoctorManagement />;
      case 'feedback':
        return <FeedbackManagement />;
      case 'analytics':
        return <AnalyticsCharts />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4 fw-bold">Admin Dashboard</h2>

      <AdminStats />

      <Nav variant="tabs" className="mb-4 mt-4" activeKey={activeTab} onSelect={setActiveTab}>
        {TABS.map((tab) => (
          <Nav.Item key={tab.key}>
            <Nav.Link eventKey={tab.key} className="d-flex align-items-center">
              {tab.icon}
              {tab.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {renderTabContent()}
    </Container>
  );
};

export default AdminDashboard;
