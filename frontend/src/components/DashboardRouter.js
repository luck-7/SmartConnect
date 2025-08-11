import React from 'react';
import { useAuth } from '../context/AuthContext';
import PatientDashboard from '../pages/patient/PatientDashboard';
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading dashboard...</p>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'PATIENT':
      return <PatientDashboard />;
    case 'DOCTOR':
      return <DoctorDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    default:
      return (
        <div className="container mt-5 text-center">
          <h2>Access Denied</h2>
          <p>Your account role is not recognized. Please contact support.</p>
        </div>
      );
  }
};

export default DashboardRouter;
