import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const EnhancedSymptomChecker = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [description, setDescription] = useState('');
  const [commonSymptoms, setCommonSymptoms] = useState([]);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [severity, setSeverity] = useState('');
  const [duration, setDuration] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    fetchCommonSymptoms();
  }, []);

  const fetchCommonSymptoms = async () => {
    try {
      const response = await axios.get('/api/symptom-checker/common-symptoms');
      if (response.data.symptoms) {
        setCommonSymptoms(response.data.symptoms);
      } else {
        // Fallback data if API doesn't return expected format
        setCommonSymptoms([
          { id: 1, name: 'Fever', category: 'General' },
          { id: 2, name: 'Headache', category: 'Neurological' },
          { id: 3, name: 'Cough', category: 'Respiratory' },
          { id: 4, name: 'Fatigue', category: 'General' },
          { id: 5, name: 'Nausea', category: 'Gastrointestinal' },
          { id: 6, name: 'Sore Throat', category: 'Respiratory' },
          { id: 7, name: 'Body Aches', category: 'General' },
          { id: 8, name: 'Shortness of Breath', category: 'Respiratory' },
          { id: 9, name: 'Chest Pain', category: 'Cardiovascular' },
          { id: 10, name: 'Dizziness', category: 'Neurological' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      // Set fallback data
      setCommonSymptoms([
        { id: 1, name: 'Fever', category: 'General' },
        { id: 2, name: 'Headache', category: 'Neurological' },
        { id: 3, name: 'Cough', category: 'Respiratory' },
        { id: 4, name: 'Fatigue', category: 'General' },
        { id: 5, name: 'Nausea', category: 'Gastrointestinal' }
      ]);
    }
  };

  const handleSymptomToggle = (symptomName) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomName) 
        ? prev.filter(s => s !== symptomName)
        : [...prev, symptomName]
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
      const response = await axios.post('/api/symptom-checker/check', {
        symptoms: selectedSymptoms,
        description,
        severity,
        duration,
        age: parseInt(age) || null
      });

      setAssessment(response.data);
      setStep(3);
    } catch (error) {
      console.error('Error during assessment:', error);
      // Provide mock assessment for demo
      setAssessment({
        recommendation: "Based on your symptoms, we recommend consulting with a healthcare professional for proper evaluation.",
        urgency: severity === 'severe' ? 'High' : severity === 'moderate' ? 'Medium' : 'Low',
        possibleConditions: [
          "Common Cold",
          "Viral Infection", 
          "Stress-related symptoms"
        ],
        nextSteps: [
          "Monitor your symptoms",
          "Stay hydrated and rest",
          "Contact a doctor if symptoms worsen",
          "Consider booking an appointment"
        ]
      });
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const resetChecker = () => {
    setStep(1);
    setSelectedSymptoms([]);
    setCustomSymptom('');
    setDescription('');
    setAssessment(null);
    setSeverity('');
    setDuration('');
    setAge('');
  };

  const groupedSymptoms = commonSymptoms.reduce((acc, symptom) => {
    const category = symptom.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(symptom);
    return acc;
  }, {});

  return (
    <div className="symptom-checker-container">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="symptom-checker-card">
              <div className="card-header text-center">
                <div className="symptom-checker-icon">
                  <i className="fas fa-stethoscope"></i>
                </div>
                <h2 className="symptom-checker-title">AI Symptom Checker</h2>
                <p className="symptom-checker-subtitle">Get preliminary health insights based on your symptoms</p>
                
                {/* Progress Bar */}
                <div className="progress-container">
                  <div className="progress">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${(step / 3) * 100}%` }}
                    ></div>
                  </div>
                  <div className="progress-steps">
                    <span className={step >= 1 ? 'active' : ''}>1. Symptoms</span>
                    <span className={step >= 2 ? 'active' : ''}>2. Details</span>
                    <span className={step >= 3 ? 'active' : ''}>3. Assessment</span>
                  </div>
                </div>
              </div>

              <div className="card-body">
                {step === 1 && (
                  <div className="step-content">
                    <h4 className="step-title">
                      <i className="fas fa-list-check"></i>
                      Select Your Symptoms
                    </h4>
                    
                    {/* Common Symptoms by Category */}
                    {Object.entries(groupedSymptoms).map(([category, symptoms]) => (
                      <div key={category} className="symptom-category">
                        <h5 className="category-title">
                          <i className="fas fa-folder"></i>
                          {category}
                        </h5>
                        <div className="symptoms-grid">
                          {symptoms.map((symptom) => (
                            <div
                              key={symptom.id}
                              className={`symptom-card ${selectedSymptoms.includes(symptom.name) ? 'selected' : ''}`}
                              onClick={() => handleSymptomToggle(symptom.name)}
                            >
                              <i className="fas fa-plus-circle"></i>
                              <span>{symptom.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Custom Symptom Input */}
                    <div className="custom-symptom-section">
                      <h5 className="section-title">
                        <i className="fas fa-edit"></i>
                        Add Custom Symptom
                      </h5>
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
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Selected Symptoms */}
                    {selectedSymptoms.length > 0 && (
                      <div className="selected-symptoms">
                        <h5 className="section-title">
                          <i className="fas fa-check-circle"></i>
                          Selected Symptoms ({selectedSymptoms.length})
                        </h5>
                        <div className="selected-symptoms-list">
                          {selectedSymptoms.map((symptom, index) => (
                            <span key={index} className="selected-symptom-tag">
                              {symptom}
                              <button 
                                className="remove-btn"
                                onClick={() => removeSymptom(symptom)}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="step-actions">
                      <button
                        className="btn btn-primary btn-lg"
                        onClick={() => setStep(2)}
                        disabled={selectedSymptoms.length === 0}
                      >
                        Next: Add Details
                        <i className="fas fa-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="step-content">
                    <h4 className="step-title">
                      <i className="fas fa-info-circle"></i>
                      Additional Details
                    </h4>

                    <div className="details-form">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">Severity Level</label>
                            <select
                              className="form-control"
                              value={severity}
                              onChange={(e) => setSeverity(e.target.value)}
                            >
                              <option value="">Select severity</option>
                              <option value="mild">Mild</option>
                              <option value="moderate">Moderate</option>
                              <option value="severe">Severe</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">Duration</label>
                            <select
                              className="form-control"
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
                            >
                              <option value="">Select duration</option>
                              <option value="less-than-day">Less than a day</option>
                              <option value="1-3-days">1-3 days</option>
                              <option value="4-7-days">4-7 days</option>
                              <option value="more-than-week">More than a week</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Age (optional)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter your age"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          min="1"
                          max="120"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Additional Description</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          placeholder="Describe your symptoms in more detail..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                      </div>
                    </div>

                    <div className="step-actions">
                      <button
                        className="btn btn-secondary btn-lg me-3"
                        onClick={() => setStep(1)}
                      >
                        <i className="fas fa-arrow-left me-2"></i>
                        Back
                      </button>
                      <button
                        className="btn btn-primary btn-lg"
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
                            <i className="fas fa-search ms-2"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && assessment && (
                  <div className="step-content">
                    <h4 className="step-title">
                      <i className="fas fa-clipboard-check"></i>
                      Health Assessment
                    </h4>

                    <div className="assessment-results">
                      <div className={`urgency-badge urgency-${assessment.urgency?.toLowerCase()}`}>
                        <i className="fas fa-exclamation-triangle"></i>
                        Urgency: {assessment.urgency}
                      </div>

                      <div className="assessment-section">
                        <h5>
                          <i className="fas fa-stethoscope"></i>
                          Recommendation
                        </h5>
                        <p className="assessment-text">{assessment.recommendation}</p>
                      </div>

                      {assessment.possibleConditions && (
                        <div className="assessment-section">
                          <h5>
                            <i className="fas fa-list"></i>
                            Possible Conditions
                          </h5>
                          <ul className="conditions-list">
                            {assessment.possibleConditions.map((condition, index) => (
                              <li key={index}>{condition}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {assessment.nextSteps && (
                        <div className="assessment-section">
                          <h5>
                            <i className="fas fa-tasks"></i>
                            Next Steps
                          </h5>
                          <ul className="next-steps-list">
                            {assessment.nextSteps.map((step, index) => (
                              <li key={index}>
                                <i className="fas fa-check-circle"></i>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="disclaimer">
                        <i className="fas fa-info-circle"></i>
                        <strong>Disclaimer:</strong> This assessment is for informational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.
                      </div>
                    </div>

                    <div className="step-actions">
                      <button
                        className="btn btn-primary btn-lg me-3"
                        onClick={resetChecker}
                      >
                        <i className="fas fa-redo me-2"></i>
                        Check Again
                      </button>
                      <button
                        className="btn btn-success btn-lg"
                        onClick={() => window.location.href = '/appointments'}
                      >
                        <i className="fas fa-calendar-plus me-2"></i>
                        Book Appointment
                      </button>
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

export default EnhancedSymptomChecker;
