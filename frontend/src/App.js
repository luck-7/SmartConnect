import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Home from './pages/Home';
import EnhancedSymptomChecker from './pages/patient/EnhancedSymptomChecker';
import NewPatient from './pages/patient/NewPatient';
import Appointments from './pages/patient/Appointments';
import MedicalRecords from './pages/patient/MedicalRecords';
import HealthChatBot from './pages/common/HealthChatBot';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminAppointments from './pages/admin/AdminAppointments';
import VideoConsultation from './pages/common/VideoConsultation';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

// Dashboard Router Component
const DashboardRouter = () => {
  const { user } = useAuth();
  
  switch (user?.role) {
    case 'PATIENT':
      return <PatientDashboard />;
    case 'DOCTOR':
      return <DoctorDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              } 
            />
            
            {/* Patient Routes */}
            <Route
              path="/symptom-checker"
              element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <EnhancedSymptomChecker />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/appointments" 
              element={
                <ProtectedRoute allowedRoles={['PATIENT', 'DOCTOR']}>
                  <Appointments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/medical-records" 
              element={
                <ProtectedRoute allowedRoles={['PATIENT', 'DOCTOR']}>
                  <MedicalRecords />
                </ProtectedRoute>
              } 
            />

            {/* Doctor Routes */}
            <Route
              path="/patients/new"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']}>
                  <NewPatient />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDoctors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/departments"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDepartments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminAppointments />
                </ProtectedRoute>
              }
            />

            {/* Common Routes */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <HealthChatBot />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/video-consultation/:appointmentId" 
              element={
                <ProtectedRoute>
                  <VideoConsultation />
                </ProtectedRoute>
              } 
            />
            
            {/* Error Routes */}
            <Route 
              path="/unauthorized" 
              element={
                <div className="container mt-5 text-center">
                  <h2>Unauthorized Access</h2>
                  <p>You don't have permission to access this page.</p>
                </div>
              } 
            />
            <Route 
              path="*" 
              element={
                <div className="container mt-5 text-center">
                  <h2>Page Not Found</h2>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              } 
            />
          </Routes>
          
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
