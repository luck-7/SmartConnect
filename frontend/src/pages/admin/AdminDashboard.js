import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    activeConsultations: 0,
    systemAlerts: 0,
    recentActivities: []
  });
  const [systemHealth, setSystemHealth] = useState({
    serverStatus: 'online',
    databaseStatus: 'online',
    apiResponseTime: '120ms',
    uptime: '99.9%'
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
      const mockStats = {
        totalUsers: 1247,
        totalPatients: 892,
        totalDoctors: 45,
        totalAppointments: 3456,
        todayAppointments: 23,
        activeConsultations: 5,
        systemAlerts: 2,
        recentActivities: [
          {
            id: 1,
            type: 'user_registration',
            description: 'New patient registered: John Smith',
            timestamp: '2 minutes ago',
            icon: 'fa-user-plus',
            color: 'success'
          },
          {
            id: 2,
            type: 'appointment_scheduled',
            description: 'Appointment scheduled with Dr. Johnson',
            timestamp: '5 minutes ago',
            icon: 'fa-calendar-plus',
            color: 'info'
          },
          {
            id: 3,
            type: 'system_alert',
            description: 'High server load detected',
            timestamp: '10 minutes ago',
            icon: 'fa-exclamation-triangle',
            color: 'warning'
          },
          {
            id: 4,
            type: 'doctor_joined',
            description: 'Dr. Sarah Wilson joined the platform',
            timestamp: '1 hour ago',
            icon: 'fa-user-md',
            color: 'primary'
          }
        ]
      };
      
      setDashboardStats(mockStats);
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
    <div className="admin-dashboard">
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1">Admin Dashboard</h1>
                <p className="text-muted">Welcome back, {user?.firstName}! Here's your system overview</p>
              </div>
              <div>
                <button className="btn btn-primary me-2">
                  <i className="fas fa-download me-2"></i>
                  Export Report
                </button>
                <button className="btn btn-outline-primary me-2">
                  <i className="fas fa-cog me-2"></i>
                  System Settings
                </button>
                <button onClick={handleLogout} className="btn btn-outline-danger">
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Health Status */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent">
                <h5 className="card-title mb-0">
                  <i className="fas fa-heartbeat me-2 text-success"></i>
                  System Health
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <i className="fas fa-server fa-2x text-success"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">Server Status</h6>
                        <span className="badge bg-success">{systemHealth.serverStatus}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <i className="fas fa-database fa-2x text-success"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">Database</h6>
                        <span className="badge bg-success">{systemHealth.databaseStatus}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <i className="fas fa-tachometer-alt fa-2x text-info"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">Response Time</h6>
                        <span className="text-muted">{systemHealth.apiResponseTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <i className="fas fa-clock fa-2x text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">Uptime</h6>
                        <span className="text-muted">{systemHealth.uptime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4">
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card bg-primary text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="card-title">{dashboardStats.totalUsers.toLocaleString()}</h4>
                    <p className="card-text">Total Users</p>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-users fa-2x"></i>
                  </div>
                </div>
                <div className="mt-2">
                  <small>
                    <i className="fas fa-arrow-up me-1"></i>
                    12% from last month
                  </small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card bg-success text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="card-title">{dashboardStats.totalPatients.toLocaleString()}</h4>
                    <p className="card-text">Patients</p>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-user-injured fa-2x"></i>
                  </div>
                </div>
                <div className="mt-2">
                  <small>
                    <i className="fas fa-arrow-up me-1"></i>
                    8% from last month
                  </small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card bg-info text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="card-title">{dashboardStats.totalDoctors}</h4>
                    <p className="card-text">Doctors</p>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-user-md fa-2x"></i>
                  </div>
                </div>
                <div className="mt-2">
                  <small>
                    <i className="fas fa-arrow-up me-1"></i>
                    3 new this month
                  </small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card bg-warning text-white h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="card-title">{dashboardStats.todayAppointments}</h4>
                    <p className="card-text">Today's Appointments</p>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-calendar-day fa-2x"></i>
                  </div>
                </div>
                <div className="mt-2">
                  <small>
                    {dashboardStats.activeConsultations} active consultations
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Quick Actions */}
          <div className="col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-bolt me-2"></i>
                  Quick Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <Link to="/admin/users" className="btn btn-outline-primary">
                    <i className="fas fa-users me-2"></i>
                    Manage Users
                  </Link>
                  <Link to="/admin/doctors" className="btn btn-outline-success">
                    <i className="fas fa-user-md me-2"></i>
                    Manage Doctors
                  </Link>
                  <Link to="/admin/appointments" className="btn btn-outline-info">
                    <i className="fas fa-calendar-alt me-2"></i>
                    View Appointments
                  </Link>
                  <Link to="/admin/departments" className="btn btn-outline-warning">
                    <i className="fas fa-hospital me-2"></i>
                    Manage Departments
                  </Link>
                  <Link to="/admin/reports" className="btn btn-outline-secondary">
                    <i className="fas fa-chart-bar me-2"></i>
                    Generate Reports
                  </Link>
                  <Link to="/admin/settings" className="btn btn-outline-dark">
                    <i className="fas fa-cog me-2"></i>
                    System Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="col-lg-8 mb-4">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">
                  <i className="fas fa-clock me-2"></i>
                  Recent Activities
                </h5>
                <Link to="/admin/activity-log" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              </div>
              <div className="card-body">
                <div className="timeline">
                  {dashboardStats.recentActivities.map((activity) => (
                    <div key={activity.id} className="timeline-item mb-3">
                      <div className="d-flex align-items-start">
                        <div className="me-3">
                          <div className={`rounded-circle bg-${activity.color} text-white d-flex align-items-center justify-content-center`} 
                               style={{ width: '40px', height: '40px' }}>
                            <i className={`fas ${activity.icon}`}></i>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-1">{activity.description}</p>
                          <small className="text-muted">{activity.timestamp}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Alerts */}
        {dashboardStats.systemAlerts > 0 && (
          <div className="row">
            <div className="col-12">
              <div className="alert alert-warning d-flex align-items-center">
                <i className="fas fa-exclamation-triangle fa-2x me-3"></i>
                <div>
                  <h6 className="alert-heading mb-1">System Alerts</h6>
                  <p className="mb-0">
                    You have {dashboardStats.systemAlerts} system alert(s) that require attention.
                    <Link to="/admin/alerts" className="alert-link ms-2">View Details</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
