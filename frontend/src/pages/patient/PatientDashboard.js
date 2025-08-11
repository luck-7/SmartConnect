import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    upcomingAppointments: [],
    recentRecords: [],
    healthStats: {},
    notifications: []
  });
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Mock data - replace with actual API calls
        const mockData = {
          upcomingAppointments: [
            {
              id: 1,
              doctorName: 'Dr. Sarah Johnson',
              specialization: 'Cardiology',
              date: '2024-01-15',
              time: '10:00 AM',
              type: 'Follow-up'
            },
            {
              id: 2,
              doctorName: 'Dr. Michael Chen',
              specialization: 'General Medicine',
              date: '2024-01-20',
              time: '2:30 PM',
              type: 'Consultation'
            }
          ],
          recentRecords: [
            {
              id: 1,
              title: 'Blood Test Results',
              date: '2024-01-10',
              doctor: 'Dr. Sarah Johnson',
              type: 'Lab Result'
            },
            {
              id: 2,
              title: 'Prescription Update',
              date: '2024-01-08',
              doctor: 'Dr. Michael Chen',
              type: 'Prescription'
            }
          ],
          healthStats: {
            totalAppointments: 12,
            completedAppointments: 10,
            pendingAppointments: 2,
            lastCheckup: '2024-01-10'
          },
          notifications: [
            {
              id: 1,
              message: 'Appointment reminder: Tomorrow at 10:00 AM',
              type: 'reminder',
              time: '2 hours ago'
            },
            {
              id: 2,
              message: 'New lab results available',
              type: 'info',
              time: '1 day ago'
            }
          ]
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
    <div className="patient-dashboard">
      <div className="container-fluid py-4">
        {/* Welcome Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1">Welcome back, {user?.firstName}!</h1>
                <p className="text-muted">Here's your health overview for today</p>
              </div>
              <div>
                <Link to="/symptom-checker" className="btn btn-primary me-2">
                  <i className="fas fa-stethoscope me-2"></i>
                  Symptom Checker
                </Link>
                <Link to="/appointments" className="btn btn-outline-primary me-2">
                  <i className="fas fa-calendar-plus me-2"></i>
                  Book Appointment
                </Link>
                <button onClick={handleLogout} className="btn btn-outline-danger">
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="row mb-4">
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card bg-primary text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="card-title">{dashboardData.healthStats.totalAppointments}</h4>
                    <p className="card-text">Total Appointments</p>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-calendar-check fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card bg-success text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="card-title">{dashboardData.healthStats.completedAppointments}</h4>
                    <p className="card-text">Completed</p>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-check-circle fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card bg-warning text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="card-title">{dashboardData.healthStats.pendingAppointments}</h4>
                    <p className="card-text">Upcoming</p>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-clock fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card bg-info text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="card-title">Last Checkup</h6>
                    <p className="card-text">{dashboardData.healthStats.lastCheckup}</p>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-heartbeat fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Upcoming Appointments */}
          <div className="col-lg-8 mb-4">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">
                  <i className="fas fa-calendar-alt me-2"></i>
                  Upcoming Appointments
                </h5>
                <Link to="/appointments" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              </div>
              <div className="card-body">
                {dashboardData.upcomingAppointments.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {dashboardData.upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="list-group-item border-0 px-0">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{appointment.doctorName}</h6>
                            <p className="mb-1 text-muted">{appointment.specialization}</p>
                            <small className="text-muted">
                              <i className="fas fa-calendar me-1"></i>
                              {appointment.date} at {appointment.time}
                            </small>
                          </div>
                          <span className="badge bg-primary">{appointment.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                    <p className="text-muted">No upcoming appointments</p>
                    <Link to="/appointments" className="btn btn-primary">
                      Schedule an Appointment
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Notifications */}
          <div className="col-lg-4">
            {/* Quick Actions */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-bolt me-2"></i>
                  Quick Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <Link to="/symptom-checker" className="btn btn-outline-primary">
                    <i className="fas fa-stethoscope me-2"></i>
                    Check Symptoms
                  </Link>
                  <Link to="/medical-records" className="btn btn-outline-success">
                    <i className="fas fa-file-medical me-2"></i>
                    View Records
                  </Link>
                  <Link to="/chat" className="btn btn-outline-info">
                    <i className="fas fa-comments me-2"></i>
                    Chat with Doctor
                  </Link>
                  <button className="btn btn-outline-warning">
                    <i className="fas fa-download me-2"></i>
                    Health Card
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-bell me-2"></i>
                  Notifications
                </h5>
              </div>
              <div className="card-body">
                {dashboardData.notifications.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {dashboardData.notifications.map((notification) => (
                      <div key={notification.id} className="list-group-item border-0 px-0">
                        <div className="d-flex align-items-start">
                          <div className="me-2">
                            <i className={`fas ${notification.type === 'reminder' ? 'fa-clock' : 'fa-info-circle'} text-primary`}></i>
                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-1 small">{notification.message}</p>
                            <small className="text-muted">{notification.time}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center">No new notifications</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
