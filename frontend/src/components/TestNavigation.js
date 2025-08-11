import React from 'react';
import { Link } from 'react-router-dom';

const TestNavigation = () => {
  return (
    <div className="test-navigation" style={{ 
      position: 'fixed', 
      top: '80px', 
      right: '20px', 
      background: 'white', 
      padding: '1rem', 
      borderRadius: '8px', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
      minWidth: '200px'
    }}>
      <h6 style={{ marginBottom: '1rem', color: '#2E8B57' }}>Test Routes</h6>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link 
          to="/patients/new" 
          className="btn btn-sm btn-outline-primary"
          style={{ textAlign: 'left' }}
        >
          <i className="fas fa-user-plus me-2"></i>
          New Patient
        </Link>
        <Link 
          to="/symptom-checker" 
          className="btn btn-sm btn-outline-success"
          style={{ textAlign: 'left' }}
        >
          <i className="fas fa-stethoscope me-2"></i>
          Symptom Checker
        </Link>
        <Link 
          to="/chat" 
          className="btn btn-sm btn-outline-info"
          style={{ textAlign: 'left' }}
        >
          <i className="fas fa-comments me-2"></i>
          Chat
        </Link>
      </div>
    </div>
  );
};

export default TestNavigation;
