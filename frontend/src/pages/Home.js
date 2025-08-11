import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="hero-title">
                  Smart HealthConnect
                </h1>
                <p className="hero-subtitle">
                  Your comprehensive digital healthcare platform offering secure medical record management,
                  real-time communication, and AI-powered symptom checking.
                </p>
                {!isAuthenticated ? (
                  <div className="hero-buttons">
                    <Link to="/register" className="hero-btn hero-btn-primary">
                      <i className="fas fa-rocket"></i>
                      Get Started
                    </Link>
                    <Link to="/login" className="hero-btn hero-btn-secondary">
                      <i className="fas fa-sign-in-alt"></i>
                      Sign In
                    </Link>
                  </div>
                ) : (
                  <Link to="/dashboard" className="hero-btn hero-btn-primary">
                    <i className="fas fa-tachometer-alt"></i>
                    Go to Dashboard
                  </Link>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <i className="fas fa-heartbeat hero-icon"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">Why Choose Smart HealthConnect?</h2>
            <p className="section-subtitle">
              Experience the future of healthcare with our comprehensive digital platform
            </p>
          </div>

          <div className="features-grid">
            {/* Patient Portal */}
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-user-circle"></i>
              </div>
              <h4 className="feature-title">Patient Portal</h4>
              <p className="feature-description">
                Manage your health profile, book appointments, view medical records,
                and communicate with your healthcare providers securely.
              </p>
            </div>

            {/* Doctor Dashboard */}
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-stethoscope"></i>
              </div>
              <h4 className="feature-title">Doctor Dashboard</h4>
              <p className="feature-description">
                Comprehensive tools for healthcare providers to manage patients,
                appointments, and medical records efficiently.
              </p>
            </div>

            {/* AI-Powered Features */}
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-brain"></i>
              </div>
              <h4 className="feature-title">AI-Powered Care</h4>
              <p className="feature-description">
                Advanced AI technology for symptom checking, smart routing,
                and preliminary health assessments.
              </p>
            </div>

            {/* Video Consultations */}
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-video"></i>
              </div>
              <h4 className="feature-title">Video Consultations</h4>
              <p className="feature-description">
                Secure, high-quality video calls with healthcare providers
                from the comfort of your home.
              </p>
            </div>

            {/* Secure Messaging */}
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h4 className="feature-title">Secure Messaging</h4>
              <p className="feature-description">
                HIPAA-compliant messaging system for secure communication
                between patients and healthcare providers.
              </p>
            </div>

            {/* Health Records */}
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-clipboard-list"></i>
              </div>
              <h4 className="feature-title">Digital Health Records</h4>
              <p className="feature-description">
                Complete digital health records with easy access to your
                medical history, prescriptions, and test results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Trusted by Healthcare Professionals</h2>
            <p className="section-subtitle">
              Join thousands of patients and doctors who trust Smart HealthConnect
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Active Patients</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Healthcare Providers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50,000+</span>
              <span className="stat-label">Consultations</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Transform Your Healthcare Experience?</h2>
          <p className="cta-subtitle">
            Join thousands of patients and healthcare providers using Smart HealthConnect
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="cta-button">
              <i className="fas fa-rocket"></i>
              Start Your Journey Today
            </Link>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="container">
          <div className="footer-content">
            {/* Company Info */}
            <div className="footer-column">
              <h4>Smart HealthConnect</h4>
              <p>
                Transforming healthcare through innovative digital solutions.
                Connecting patients and providers for better health outcomes.
              </p>
              <div className="footer-social">
                <a href="#" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/doctors">Find Doctors</Link></li>
                <li><Link to="/appointments">Book Appointment</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            {/* For Patients */}
            <div className="footer-column">
              <h4>For Patients</h4>
              <ul>
                <li><Link to="/patient-portal">Patient Portal</Link></li>
                <li><Link to="/symptom-checker">Symptom Checker</Link></li>
                <li><Link to="/health-records">Health Records</Link></li>
                <li><Link to="/prescriptions">Prescriptions</Link></li>
                <li><Link to="/support">Support</Link></li>
              </ul>
            </div>

            {/* For Providers */}
            <div className="footer-column">
              <h4>For Providers</h4>
              <ul>
                <li><Link to="/provider-signup">Join Our Network</Link></li>
                <li><Link to="/provider-portal">Provider Portal</Link></li>
                <li><Link to="/telemedicine">Telemedicine</Link></li>
                <li><Link to="/ehr-integration">EHR Integration</Link></li>
                <li><Link to="/provider-support">Provider Support</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/hipaa">HIPAA Compliance</Link>
              <Link to="/accessibility">Accessibility</Link>
            </div>
            <p className="footer-copyright">
              © {new Date().getFullYear()} Smart HealthConnect. All rights reserved.
              Empowering healthcare through technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
