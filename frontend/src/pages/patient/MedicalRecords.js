import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const MedicalRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, filterType, searchTerm]);

  const fetchMedicalRecords = async () => {
    try {
      // Mock data - replace with actual API call
      const mockRecords = [
        {
          id: 1,
          title: 'Annual Physical Examination',
          date: '2024-01-10',
          doctor: 'Dr. Sarah Johnson',
          type: 'CONSULTATION',
          diagnosis: 'Overall good health',
          prescription: 'Vitamin D supplements',
          notes: 'Patient is in good health. Recommended regular exercise.',
          attachments: []
        },
        {
          id: 2,
          title: 'Blood Test Results',
          date: '2024-01-08',
          doctor: 'Dr. Michael Chen',
          type: 'LAB_RESULT',
          diagnosis: 'Normal blood work',
          prescription: '',
          notes: 'All blood parameters within normal range.',
          attachments: ['blood_test_report.pdf']
        },
        {
          id: 3,
          title: 'Cardiology Consultation',
          date: '2024-01-05',
          doctor: 'Dr. Sarah Johnson',
          type: 'CONSULTATION',
          diagnosis: 'Mild hypertension',
          prescription: 'Lisinopril 10mg daily',
          notes: 'Blood pressure slightly elevated. Lifestyle modifications recommended.',
          attachments: ['ecg_report.pdf']
        }
      ];
      
      setRecords(mockRecords);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = records;

    if (filterType !== 'ALL') {
      filtered = filtered.filter(record => record.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  };

  const getRecordTypeIcon = (type) => {
    switch (type) {
      case 'CONSULTATION': return 'fa-stethoscope';
      case 'LAB_RESULT': return 'fa-flask';
      case 'PRESCRIPTION': return 'fa-prescription';
      case 'DIAGNOSIS': return 'fa-diagnoses';
      case 'VACCINATION': return 'fa-syringe';
      default: return 'fa-file-medical';
    }
  };

  const getRecordTypeColor = (type) => {
    switch (type) {
      case 'CONSULTATION': return 'primary';
      case 'LAB_RESULT': return 'success';
      case 'PRESCRIPTION': return 'info';
      case 'DIAGNOSIS': return 'warning';
      case 'VACCINATION': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="medical-records-page">
      <div className="container py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1">Medical Records</h1>
                <p className="text-muted">Your complete medical history</p>
              </div>
              <button className="btn btn-primary">
                <i className="fas fa-download me-2"></i>
                Export Records
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">All Records</option>
              <option value="CONSULTATION">Consultations</option>
              <option value="LAB_RESULT">Lab Results</option>
              <option value="PRESCRIPTION">Prescriptions</option>
              <option value="DIAGNOSIS">Diagnoses</option>
              <option value="VACCINATION">Vaccinations</option>
            </select>
          </div>
        </div>

        {/* Records List */}
        <div className="row">
          <div className="col-lg-8">
            {filteredRecords.length > 0 ? (
              <div className="records-list">
                {filteredRecords.map((record) => (
                  <div 
                    key={record.id} 
                    className={`card mb-3 cursor-pointer ${selectedRecord?.id === record.id ? 'border-primary' : ''}`}
                    onClick={() => setSelectedRecord(record)}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            <div className={`me-3 text-${getRecordTypeColor(record.type)}`}>
                              <i className={`fas ${getRecordTypeIcon(record.type)} fa-lg`}></i>
                            </div>
                            <div>
                              <h5 className="card-title mb-1">{record.title}</h5>
                              <p className="text-muted mb-0">
                                <i className="fas fa-user-md me-1"></i>
                                {record.doctor}
                              </p>
                            </div>
                          </div>
                          <div className="row text-muted small">
                            <div className="col-md-6">
                              <i className="fas fa-calendar me-1"></i>
                              {record.date}
                            </div>
                            <div className="col-md-6">
                              <span className={`badge bg-${getRecordTypeColor(record.type)}`}>
                                {record.type.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-end">
                          <button className="btn btn-sm btn-outline-primary">
                            <i className="fas fa-eye"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="fas fa-file-medical fa-4x text-muted mb-3"></i>
                <h4>No Records Found</h4>
                <p className="text-muted">No medical records match your current filters.</p>
              </div>
            )}
          </div>

          {/* Record Details */}
          <div className="col-lg-4">
            {selectedRecord ? (
              <div className="card sticky-top">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className={`fas ${getRecordTypeIcon(selectedRecord.type)} me-2`}></i>
                    Record Details
                  </h5>
                </div>
                <div className="card-body">
                  <h6 className="fw-bold">{selectedRecord.title}</h6>
                  
                  <div className="mb-3">
                    <small className="text-muted">Date:</small>
                    <p className="mb-1">{selectedRecord.date}</p>
                  </div>
                  
                  <div className="mb-3">
                    <small className="text-muted">Doctor:</small>
                    <p className="mb-1">{selectedRecord.doctor}</p>
                  </div>
                  
                  {selectedRecord.diagnosis && (
                    <div className="mb-3">
                      <small className="text-muted">Diagnosis:</small>
                      <p className="mb-1">{selectedRecord.diagnosis}</p>
                    </div>
                  )}
                  
                  {selectedRecord.prescription && (
                    <div className="mb-3">
                      <small className="text-muted">Prescription:</small>
                      <p className="mb-1">{selectedRecord.prescription}</p>
                    </div>
                  )}
                  
                  {selectedRecord.notes && (
                    <div className="mb-3">
                      <small className="text-muted">Notes:</small>
                      <p className="mb-1">{selectedRecord.notes}</p>
                    </div>
                  )}
                  
                  {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                    <div className="mb-3">
                      <small className="text-muted">Attachments:</small>
                      {selectedRecord.attachments.map((attachment, index) => (
                        <div key={index} className="d-flex align-items-center mt-1">
                          <i className="fas fa-paperclip me-2 text-muted"></i>
                          <a href="#" className="text-decoration-none small">
                            {attachment}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary btn-sm">
                      <i className="fas fa-download me-2"></i>
                      Download
                    </button>
                    <button className="btn btn-outline-secondary btn-sm">
                      <i className="fas fa-share me-2"></i>
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="card-body text-center text-muted">
                  <i className="fas fa-mouse-pointer fa-3x mb-3"></i>
                  <p>Select a record to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
