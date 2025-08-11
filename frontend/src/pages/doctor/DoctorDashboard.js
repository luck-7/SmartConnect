import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    todayAppointments: [],
    upcomingAppointments: [],
    recentPatients: [],
    consultationStats: {},
    notifications: []
  });
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockData = {
        todayAppointments: [
          {
            id: 1,
            patientName: 'John Smith',
            time: '09:00 AM',
            type: 'Consultation',
            status: 'Scheduled'
          },
          {
            id: 2,
            patientName: 'Sarah Johnson',
            time: '10:30 AM',
            type: 'Follow-up',
            status: 'In Progress'
          }
        ],
        upcomingAppointments: [
          {
            id: 3,
            patientName: 'Mike Wilson',
            date: '2024-01-16',
            time: '2:00 PM',
            type: 'Consultation'
          }
        ],
        recentPatients: [
          {
            id: 1,
            name: 'John Smith',
            lastVisit: '2024-01-10',
            condition: 'Hypertension'
          },
          {
            id: 2,
            name: 'Sarah Johnson',
            lastVisit: '2024-01-08',
            condition: 'Diabetes'
          }
        ],
        consultationStats: {
          totalPatients: 45,
          todayAppointments: 8,
          completedToday: 3,
          pendingConsultations: 5
        },
        notifications: [
          {
            id: 1,
            message: 'New patient registration: Mike Wilson',
            type: 'info',
            time: '10 minutes ago'
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
    <div className="doctor-dashboard">
      <div className="container-fluid py-4">
        {/* Welcome Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1">Good morning, Dr. {user?.firstName}!</h1>
                <p className="text-muted">You have {dashboardData.todayAppointments.length} appointments today</p>
              </div>
              <div>
                <Link to="/video-consultation/new" className="btn btn-primary me-2">
                  <i className="fas fa-video me-2"></i>
                  Start Consultation
                </Link>
                <Link to="/patients/new" className="btn btn-outline-primary me-2">
                  <i className="fas fa-user-plus me-2"></i>
                  Add Patient
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
                    <h4 className="card-title">{dashboardData.consultationStats.totalPatients}</h4>
                    <p className="card-text">Total Patients</p>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-users fa-2x"></i>
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
                    <h4 className="card-title">{dashboardData.consultationStats.todayAppointments}</h4>
                    <p className="card-text">Today's Appointments</p>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-calendar-day fa-2x"></i>
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
                    <h4 className="card-title">{dashboardData.consultationStats.completedToday}</h4>
                    <p className="card-text">Completed Today</p>
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
                    <h4 className="card-title">{dashboardData.consultationStats.pendingConsultations}</h4>
                    <p className="card-text">Pending</p>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-clock fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Today's Appointments */}
          <div className="col-lg-8 mb-4">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">
                  <i className="fas fa-calendar-day me-2"></i>
                  Today's Appointments
                </h5>
                <Link to="/appointments" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              </div>
              <div className="card-body">
                {dashboardData.todayAppointments.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {dashboardData.todayAppointments.map((appointment) => (
                      <div key={appointment.id} className="list-group-item border-0 px-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">{appointment.patientName}</h6>
                            <p className="mb-1 text-muted">
                              <i className="fas fa-clock me-1"></i>
                              {appointment.time} - {appointment.type}
                            </p>
                          </div>
                          <div>
                            <span className={`badge ${
                              appointment.status === 'Scheduled' ? 'bg-primary' :
                              appointment.status === 'In Progress' ? 'bg-success' : 'bg-secondary'
                            }`}>
                              {appointment.status}
                            </span>
                            <button className="btn btn-sm btn-outline-primary ms-2">
                              <i className="fas fa-video"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                    <p className="text-muted">No appointments scheduled for today</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Patients */}
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
                  <Link to="/patients" className="btn btn-outline-primary">
                    <i className="fas fa-users me-2"></i>
                    View Patients
                  </Link>
                  <Link to="/medical-records" className="btn btn-outline-success">
                    <i className="fas fa-file-medical me-2"></i>
                    Medical Records
                  </Link>
                  <Link to="/prescriptions" className="btn btn-outline-info">
                    <i className="fas fa-prescription me-2"></i>
                    Prescriptions
                  </Link>
                  <Link to="/schedule" className="btn btn-outline-warning">
                    <i className="fas fa-calendar-alt me-2"></i>
                    My Schedule
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Patients */}
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-user-injured me-2"></i>
                  Recent Patients
                </h5>
              </div>
              <div className="card-body">
                {dashboardData.recentPatients.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {dashboardData.recentPatients.map((patient) => (
                      <div key={patient.id} className="list-group-item border-0 px-0">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{patient.name}</h6>
                            <p className="mb-1 text-muted small">{patient.condition}</p>
                            <small className="text-muted">Last visit: {patient.lastVisit}</small>
                          </div>
                          <button className="btn btn-sm btn-outline-primary">
                            <i className="fas fa-eye"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center">No recent patients</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
