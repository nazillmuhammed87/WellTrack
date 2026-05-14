import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Alert, Button, Container } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const [bypassVerification, setBypassVerification] = useState(false);

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified && !bypassVerification) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Account Pending Verification</Alert.Heading>
          <p>
            Your account has not been verified yet. Some features may be
            limited until your account is verified by an administrator.
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button
              variant="outline-warning"
              onClick={() => setBypassVerification(true)}
            >
              Continue to Limited Access
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
