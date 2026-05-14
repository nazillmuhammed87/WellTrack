import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Spinner, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import predictionService from '../../services/predictionService';
import { RISK_LEVELS } from '../../utils/constants';
import { formatDate, formatPercentage } from '../../utils/formatters';

const PredictionHistory = () => {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchPredictions(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchPredictions = async (page) => {
    try {
      setLoading(true);
      const response = await predictionService.getPredictions(page, limit);
      const data = response.data;
      setPredictions(data.predictions || data.data || []);
      setTotalPages(data.pagination?.pages || data.totalPages || Math.ceil((data.total || 0) / limit) || 1);
    } catch (error) {
      toast.error('Failed to load prediction history.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];

    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      />
    );

    for (let page = 1; page <= totalPages; page++) {
      if (
        page === 1 ||
        page === totalPages ||
        (page >= currentPage - 1 && page <= currentPage + 1)
      ) {
        items.push(
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Pagination.Item>
        );
      } else if (page === currentPage - 2 || page === currentPage + 2) {
        items.push(<Pagination.Ellipsis key={`ellipsis-${page}`} disabled />);
      }
    }

    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      />
    );

    return (
      <div className="d-flex justify-content-center mt-3">
        <Pagination>{items}</Pagination>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading prediction history...</p>
      </div>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Body className="p-4">
        <h3 className="mb-4">Prediction History</h3>

        {predictions.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted mb-3">No predictions yet.</p>
            <Button variant="primary" onClick={() => navigate('/predict')}>
              Create Your First Prediction
            </Button>
          </div>
        ) : (
          <>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Risk Level</th>
                  <th>Probability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((prediction) => {
                  const riskLevel = prediction.riskLevel || 'Low';
                  const riskConfig = RISK_LEVELS[riskLevel] || RISK_LEVELS.Low;

                  return (
                    <tr key={prediction._id}>
                      <td>{formatDate(prediction.createdAt)}</td>
                      <td>
                        <Badge bg={riskConfig.bg}>{riskConfig.label}</Badge>
                      </td>
                      <td>{formatPercentage(prediction.probability)}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/result/${prediction._id}`)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            {renderPagination()}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default PredictionHistory;
