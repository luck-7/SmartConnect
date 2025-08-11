import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: 'PATIENT'
  });
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData);
      
      if (result.success) {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo">
              <i className="fas fa-user-md"></i>
            </div>
            <h2 className="auth-title">Join HealthConnect</h2>
            <p className="auth-subtitle">Start your digital healthcare journey</p>
          </div>

          {/* Role Selection */}
          <div className="role-selector">
            <div
              className={`role-option ${formData.role === 'PATIENT' ? 'selected' : ''}`}
              onClick={() => setFormData({...formData, role: 'PATIENT'})}
            >
              <i className="fas fa-heartbeat"></i>
              <span>Patient</span>
            </div>
            <div
              className={`role-option ${formData.role === 'DOCTOR' ? 'selected' : ''}`}
              onClick={() => setFormData({...formData, role: 'DOCTOR'})}
            >
              <i className="fas fa-stethoscope"></i>
              <span>Doctor</span>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="auth-form-group">
                  <label htmlFor="firstName" className="auth-form-label">First Name</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="auth-form-input"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      required
                    />
                    <i className="fas fa-user auth-form-input-icon"></i>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="auth-form-group">
                  <label htmlFor="lastName" className="auth-form-label">Last Name</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="auth-form-input"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      required
                    />
                    <i className="fas fa-user auth-form-input-icon"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="username" className="auth-form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="auth-form-input"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a unique username"
                  required
                />
                <i className="fas fa-at auth-form-input-icon"></i>
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="email" className="auth-form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="auth-form-input"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
                <i className="fas fa-envelope auth-form-input-icon"></i>
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="phoneNumber" className="auth-form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  className="auth-form-input"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
                <i className="fas fa-phone auth-form-input-icon"></i>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="auth-form-group">
                  <label htmlFor="password" className="auth-form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      className="auth-form-input"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      required
                    />
                    <i className="fas fa-lock auth-form-input-icon"></i>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="auth-form-group">
                  <label htmlFor="confirmPassword" className="auth-form-label">Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      className="auth-form-input"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                    />
                    <i className="fas fa-lock auth-form-input-icon"></i>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="auth-link-section">
            <div className="auth-link-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
