import React, { useState } from 'react';
import { Card, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HealthFormStep1 from './HealthFormStep1';
import HealthFormStep2 from './HealthFormStep2';
import predictionService from '../../services/predictionService';

const HealthForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    everMarried: '',
    workType: '',
    residenceType: '',
    smokingStatus: '',
    hypertension: 0,
    heartDisease: 0,
    avgGlucoseLevel: '',
    weight: '',
    height: '',
    bmi: '',
  });

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await predictionService.createPrediction(formData);
      const predictionId = response.data?.prediction?.id || response.data?.prediction?._id || response.data?._id || response.data?.id;

      toast.success('Prediction created successfully!');
      navigate(`/result/${predictionId}`, { replace: true });
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to create prediction. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = currentStep === 1 ? 50 : 100;

  return (
    <Card className="shadow-sm mx-auto" style={{ maxWidth: '700px' }}>
      <Card.Body className="p-4">
        <h3 className="text-center mb-3">Health Risk Assessment</h3>

        <div className="mb-4">
          <div className="d-flex justify-content-between mb-1">
            <small className="text-muted">Step {currentStep} of 2</small>
            <small className="text-muted">{progressPercentage}%</small>
          </div>
          <ProgressBar now={progressPercentage} variant="primary" />
        </div>

        {currentStep === 1 && (
          <HealthFormStep1
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <HealthFormStep2
            formData={formData}
            setFormData={setFormData}
            onBack={handleBack}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </Card.Body>
    </Card>
  );
};

export default HealthForm;
