import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const SymptomChecker = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [description, setDescription] = useState('');
  const [commonSymptoms, setCommonSymptoms] = useState([]);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCommonSymptoms();
  }, []);

  const fetchCommonSymptoms = async () => {
    try {
      const response = await axios.get('/api/symptom-checker/common-symptoms');
      setCommonSymptoms(response.data);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
    }
  };

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const removeSymptom = (symptom) => {
    setSelectedSymptoms(prev => prev.filter(s => s !== symptom));
  };

  const handleAssessment = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error('Please select at least one symptom');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/symptom-checker/assess', {
        patientId: user.id,
        symptoms: selectedSymptoms,
        description: description
      });
      
      setAssessment(response.data);
      setStep(3);
      toast.success('Assessment completed successfully');
    } catch (error) {
      toast.error('Error during assessment');
      console.error('Assessment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetChecker = () => {
    setStep(1);
    setSelectedSymptoms([]);
    setDescription('');
    setAssessment(null);
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'danger';
      case 'CRITICAL': return 'dark';
      default: return 'secondary';
    }
  };

  const getRiskLevelIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'LOW': return 'fa-check-circle';
      case 'MEDIUM': return 'fa-exclamation-triangle';
      case 'HIGH': return 'fa-exclamation-circle';
      case 'CRITICAL': return 'fa-ambulance';
      default: return 'fa-question-circle';
    }
  };

  return (
    <div className="symptom-checker-page">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-primary text-white">
                <h3 className="card-title mb-0">
                  <i className="fas fa-stethoscope me-2"></i>
                  AI Symptom Checker
                </h3>
                <p className="mb-0 mt-2">Get preliminary health assessment and recommendations</p>
              </div>

              <div className="card-body p-4">
                {/* Progress Bar */}
                <div className="progress mb-4" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ width: `${(step / 3) * 100}%` }}
                  ></div>
                </div>

                {/* Step 1: Symptom Selection */}
                {step === 1 && (
                  <div className="step-1">
                    <h4 className="mb-4">
                      <i className="fas fa-list-check me-2"></i>
                      Select Your Symptoms
                    </h4>
                    
                    {/* Common Symptoms */}
                    <div className="mb-4">
                      <h6 className="text-muted mb-3">Common Symptoms:</h6>
                      <div className="row g-2">
                        {commonSymptoms.map((symptom, index) => (
                          <div key={index} className="col-md-6 col-lg-4">
                            <button
                              className={`btn w-100 text-start ${
                                selectedSymptoms.includes(symptom) 
                                  ? 'btn-primary' 
                                  : 'btn-outline-secondary'
                              }`}
                              onClick={() => handleSymptomToggle(symptom)}
                            >
                              <i className={`fas ${
                                selectedSymptoms.includes(symptom) 
                                  ? 'fa-check-square' 
                                  : 'fa-square'
                              } me-2`}></i>
                              {symptom}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Custom Symptom Input */}
                    <div className="mb-4">
                      <h6 className="text-muted mb-3">Add Custom Symptom:</h6>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Describe your symptom..."
                          value={customSymptom}
                          onChange={(e) => setCustomSymptom(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCustomSymptom()}
                        />
                        <button 
                          className="btn btn-outline-primary" 
                          onClick={addCustomSymptom}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>

                    {/* Selected Symptoms */}
                    {selectedSymptoms.length > 0 && (
                      <div className="mb-4">
                        <h6 className="text-muted mb-3">Selected Symptoms:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedSymptoms.map((symptom, index) => (
                            <span key={index} className="badge bg-primary fs-6 p-2">
                              {symptom}
                              <button
                                className="btn-close btn-close-white ms-2"
                                onClick={() => removeSymptom(symptom)}
                                style={{ fontSize: '0.7em' }}
                              ></button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-primary"
                        onClick={() => setStep(2)}
                        disabled={selectedSymptoms.length === 0}
                      >
                        Next: Add Details
                        <i className="fas fa-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Additional Details */}
                {step === 2 && (
                  <div className="step-2">
                    <h4 className="mb-4">
                      <i className="fas fa-edit me-2"></i>
                      Additional Details
                    </h4>

                    <div className="mb-4">
                      <label className="form-label">
                        Describe your symptoms in detail (optional):
                      </label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="When did the symptoms start? How severe are they? Any triggers you noticed?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      <strong>Note:</strong> This is a preliminary assessment tool and should not replace professional medical advice.
                    </div>

                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setStep(1)}
                      >
                        <i className="fas fa-arrow-left me-2"></i>
                        Back
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleAssessment}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            Get Assessment
                            <i className="fas fa-brain ms-2"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Assessment Results */}
                {step === 3 && assessment && (
                  <div className="step-3">
                    <h4 className="mb-4">
                      <i className="fas fa-clipboard-check me-2"></i>
                      Assessment Results
                    </h4>

                    {/* Risk Level Alert */}
                    <div className={`alert alert-${getRiskLevelColor(assessment.riskLevel)} d-flex align-items-center`}>
                      <i className={`fas ${getRiskLevelIcon(assessment.riskLevel)} fa-2x me-3`}></i>
                      <div>
                        <h5 className="alert-heading mb-1">
                          Risk Level: {assessment.riskLevel}
                        </h5>
                        <p className="mb-0">{assessment.urgencyLevel}</p>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="card mb-4">
                      <div className="card-header">
                        <h6 className="mb-0">
                          <i className="fas fa-lightbulb me-2"></i>
                          AI Recommendations
                        </h6>
                      </div>
                      <div className="card-body">
                        <div style={{ whiteSpace: 'pre-line' }}>
                          {assessment.aiRecommendations}
                        </div>
                      </div>
                    </div>

                    {/* Assessment Details */}
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <div className="card h-100">
                          <div className="card-body text-center">
                            <i className="fas fa-hospital fa-2x text-primary mb-2"></i>
                            <h6>Recommended Department</h6>
                            <p className="mb-0">{assessment.recommendedDepartment}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card h-100">
                          <div className="card-body text-center">
                            <i className="fas fa-percentage fa-2x text-success mb-2"></i>
                            <h6>Confidence Score</h6>
                            <p className="mb-0">{Math.round(assessment.confidenceScore * 100)}%</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommended Doctor */}
                    {assessment.recommendedDoctor && (
                      <div className="card mb-4">
                        <div className="card-header">
                          <h6 className="mb-0">
                            <i className="fas fa-user-md me-2"></i>
                            Recommended Doctor
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <i className="fas fa-user-circle fa-3x text-primary"></i>
                            </div>
                            <div>
                              <h6 className="mb-1">
                                Dr. {assessment.recommendedDoctor.user.firstName} {assessment.recommendedDoctor.user.lastName}
                              </h6>
                              <p className="text-muted mb-1">{assessment.recommendedDoctor.specialization}</p>
                              <p className="text-muted mb-0">{assessment.recommendedDoctor.department}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-outline-primary"
                        onClick={resetChecker}
                      >
                        <i className="fas fa-redo me-2"></i>
                        New Assessment
                      </button>
                      <div>
                        <button className="btn btn-success me-2">
                          <i className="fas fa-calendar-plus me-2"></i>
                          Book Appointment
                        </button>
                        <button className="btn btn-info">
                          <i className="fas fa-download me-2"></i>
                          Save Report
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
