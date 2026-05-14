import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FiStar, FiUpload, FiX } from 'react-icons/fi';
import feedbackService from '../../services/feedbackService';
import { FEEDBACK_CATEGORIES } from '../../utils/constants';

const FeedbackForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    rating: 0
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(f => {
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name} is too large. Max 5MB.`);
        return false;
      }
      if (!/^image\//.test(f.type)) {
        toast.error(`${f.name} is not an image file.`);
        return false;
      }
      return true;
    });

    if (files.length + validFiles.length > 3) {
      toast.error('Maximum 3 screenshots allowed');
      return;
    }
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) return toast.error('Please select a category');
    if (!formData.subject.trim()) return toast.error('Please enter a subject');
    if (!formData.description.trim()) return toast.error('Please enter a description');
    if (formData.rating === 0) return toast.error('Please select a rating');

    setLoading(true);
    try {
      const data = new FormData();
      data.append('category', formData.category);
      data.append('subject', formData.subject);
      data.append('description', formData.description);
      data.append('rating', formData.rating);
      files.forEach(f => data.append('screenshots', f));

      await feedbackService.createFeedback(data);
      toast.success('Feedback submitted successfully!');
      setFormData({ category: '', subject: '', description: '', rating: 0 });
      setFiles([]);
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm" style={{ maxWidth: '700px' }}>
      <Card.Body className="p-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select a category</option>
              {FEEDBACK_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              maxLength={100}
              placeholder="Brief summary of your feedback"
              required
            />
            <Form.Text className="text-muted">{formData.subject.length}/100</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={500}
              placeholder="Please describe your feedback in detail"
              required
            />
            <Form.Text className="text-muted">{formData.description.length}/500</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>
            <div className="d-flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <FiStar
                  key={star}
                  size={28}
                  style={{ cursor: 'pointer' }}
                  fill={(hoverRating || formData.rating) >= star ? '#ffc107' : 'none'}
                  color={(hoverRating || formData.rating) >= star ? '#ffc107' : '#dee2e6'}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                />
              ))}
              {formData.rating > 0 && (
                <span className="ms-2 text-muted">{formData.rating}/5</span>
              )}
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Screenshots (optional, max 3)</Form.Label>
            <div className="d-flex align-items-center gap-2 mb-2">
              <label className="btn btn-outline-secondary btn-sm" style={{ cursor: 'pointer' }}>
                <FiUpload className="me-1" /> Upload Images
                <input type="file" accept="image/*" multiple hidden onChange={handleFileChange} />
              </label>
              <small className="text-muted">{files.length}/3 files</small>
            </div>
            {files.length > 0 && (
              <Row className="g-2">
                {files.map((file, i) => (
                  <Col xs={4} key={i}>
                    <div className="position-relative border rounded p-1">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="img-fluid rounded"
                        style={{ height: '80px', width: '100%', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle p-0"
                        style={{ width: 20, height: 20, lineHeight: 1 }}
                        onClick={() => removeFile(i)}
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Form.Group>

          <Button type="submit" variant="primary" disabled={loading} className="w-100">
            {loading ? <Spinner size="sm" /> : 'Submit Feedback'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FeedbackForm;
