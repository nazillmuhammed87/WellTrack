import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

const UserVerificationModal = ({ show, onHide, user, action, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const isReject = action === 'reject';

  const handleClose = () => {
    setReason('');
    setValidated(false);
    setLoading(false);
    onHide();
  };

  const handleConfirm = async () => {
    if (isReject && !reason.trim()) {
      setValidated(true);
      return;
    }
    setLoading(true);
    try {
      await onConfirm(isReject ? reason : undefined);
      setReason('');
      setValidated(false);
    } catch {
      // error handled by parent
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isReject ? 'Reject User' : 'Verify User'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isReject ? (
          <>
            <p>
              Are you sure you want to reject <strong>{user.fullName}</strong>?
            </p>
            <Form noValidate>
              <Form.Group>
                <Form.Label>Rejection Reason <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter reason for rejection..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  isInvalid={validated && !reason.trim()}
                />
                <Form.Control.Feedback type="invalid">
                  Rejection reason is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          </>
        ) : (
          <p>
            Are you sure you want to verify <strong>{user.fullName}</strong>?
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant={isReject ? 'danger' : 'success'}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading && <Spinner animation="border" size="sm" className="me-1" />}
          {isReject ? 'Reject' : 'Verify'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserVerificationModal;
