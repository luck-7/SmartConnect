import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavItemsForRole = () => {
    if (!isAuthenticated) return [];

    switch (user?.role) {
      case 'PATIENT':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt' },
          { path: '/symptom-checker', label: 'Symptom Checker', icon: 'fa-stethoscope' },
          { path: '/appointments', label: 'Appointments', icon: 'fa-calendar-alt' },
          { path: '/medical-records', label: 'Medical Records', icon: 'fa-file-medical' },
          { path: '/chat', label: 'Chat', icon: 'fa-comments' }
        ];
      case 'DOCTOR':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt' },
          { path: '/appointments', label: 'Appointments', icon: 'fa-calendar-alt' },
          { path: '/patients', label: 'Patients', icon: 'fa-users' },
          { path: '/patients/new', label: 'New Patient', icon: 'fa-user-plus' },
          { path: '/medical-records', label: 'Records', icon: 'fa-file-medical' },
          { path: '/chat', label: 'Chat', icon: 'fa-comments' }
        ];
      case 'ADMIN':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt' },
          { path: '/admin/users', label: 'Users', icon: 'fa-users' },
          { path: '/admin/doctors', label: 'Doctors', icon: 'fa-user-md' },
          { path: '/admin/departments', label: 'Departments', icon: 'fa-building' },
          { path: '/admin/appointments', label: 'Appointments', icon: 'fa-calendar-alt' },
          { path: '/chat', label: 'Chat', icon: 'fa-comments' }
        ];
      default:
        return [];
    }
  };

  return (
    <nav className="smart-navbar">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand" to="/">
          <i className="fas fa-heartbeat"></i>
          <span>Smart HealthConnect</span>
        </Link>

        {/* Mobile toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {isAuthenticated && getNavItemsForRole().map((item, index) => (
              <li key={index} className="nav-item">
                <Link className="nav-link" to={item.path}>
                  <i className={`fas ${item.icon} me-1`}></i>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side items */}
          <ul className="navbar-nav">
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="fas fa-sign-in-alt me-1"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <i className="fas fa-user-plus me-1"></i>
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* Notifications */}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle position-relative"
                    href="#"
                    id="notificationDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fas fa-bell"></i>
                    <span className="notification-badge">
                      3
                    </span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="notificationDropdown">
                    <li><h6 className="dropdown-header">Notifications</h6></li>
                    <li><a className="dropdown-item" href="#">
                      <i className="fas fa-calendar text-primary me-2"></i>
                      Appointment reminder
                    </a></li>
                    <li><a className="dropdown-item" href="#">
                      <i className="fas fa-file-medical text-success me-2"></i>
                      New lab results
                    </a></li>
                    <li><a className="dropdown-item" href="#">
                      <i className="fas fa-comment text-info me-2"></i>
                      New message from doctor
                    </a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item text-center" href="#">View all notifications</a></li>
                  </ul>
                </li>

                {/* User menu */}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="user-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <span className="d-none d-md-inline">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><h6 className="dropdown-header">
                      {user?.firstName} {user?.lastName}
                      <br />
                      <small className="text-muted">{user?.role}</small>
                    </h6></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" to="/profile">
                      <i className="fas fa-user-circle me-2"></i>
                      My Profile
                    </Link></li>
                    <li><Link className="dropdown-item" to="/settings">
                      <i className="fas fa-cog me-2"></i>
                      Settings
                    </Link></li>
                    {user?.role === 'PATIENT' && (
                      <li><Link className="dropdown-item" to="/health-card">
                        <i className="fas fa-id-card me-2"></i>
                        Health Card
                      </Link></li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </a></li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
