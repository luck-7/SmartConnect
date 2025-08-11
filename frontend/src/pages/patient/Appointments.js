import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    type: 'CONSULTATION'
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      // Mock data - replace with actual API call
      const mockAppointments = [
        {
          id: 1,
          doctorName: 'Dr. Sarah Johnson',
          specialization: 'Cardiology',
          date: '2024-01-15',
          time: '10:00 AM',
          status: 'SCHEDULED',
          type: 'CONSULTATION',
          reason: 'Regular checkup'
        },
        {
          id: 2,
          doctorName: 'Dr. Michael Chen',
          specialization: 'General Medicine',
          date: '2024-01-20',
          time: '2:30 PM',
          status: 'CONFIRMED',
          type: 'FOLLOW_UP',
          reason: 'Follow-up consultation'
        }
      ];
      
      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      // Mock booking - replace with actual API call
      const newAppointment = {
        id: Date.now(),
        doctorName: 'Dr. Available Doctor',
        specialization: 'General Medicine',
        date: bookingData.date,
        time: bookingData.time,
        status: 'SCHEDULED',
        type: bookingData.type,
        reason: bookingData.reason
      };
      
      setAppointments(prev => [...prev, newAppointment]);
      setShowBookingModal(false);
      setBookingData({
        doctorId: '',
        date: '',
        time: '',
        reason: '',
        type: 'CONSULTATION'
      });
      toast.success('Appointment booked successfully!');
    } catch (error) {
      toast.error('Failed to book appointment');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-primary';
      case 'CONFIRMED': return 'bg-success';
      case 'COMPLETED': return 'bg-info';
      case 'CANCELLED': return 'bg-danger';
      default: return 'bg-secondary';
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
    <div className="appointments-page">
      <div className="container py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1">My Appointments</h1>
                <p className="text-muted">Manage your healthcare appointments</p>
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => setShowBookingModal(true)}
              >
                <i className="fas fa-plus me-2"></i>
                Book Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="row">
          <div className="col-12">
            {appointments.length > 0 ? (
              <div className="row g-3">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="col-lg-6">
                    <div className="card appointment-card h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 className="card-title mb-1">{appointment.doctorName}</h5>
                            <p className="text-muted mb-0">{appointment.specialization}</p>
                          </div>
                          <span className={`badge ${getStatusBadgeClass(appointment.status)} status-badge`}>
                            {appointment.status}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-calendar text-primary me-2"></i>
                            <span>{appointment.date}</span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-clock text-primary me-2"></i>
                            <span>{appointment.time}</span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-stethoscope text-primary me-2"></i>
                            <span>{appointment.type}</span>
                          </div>
                        </div>
                        
                        <p className="card-text text-muted mb-3">{appointment.reason}</p>
                        
                        <div className="d-flex gap-2">
                          {appointment.status === 'CONFIRMED' && (
                            <button className="btn btn-success btn-sm">
                              <i className="fas fa-video me-1"></i>
                              Join Call
                            </button>
                          )}
                          <button className="btn btn-outline-primary btn-sm">
                            <i className="fas fa-edit me-1"></i>
                            Reschedule
                          </button>
                          <button className="btn btn-outline-danger btn-sm">
                            <i className="fas fa-times me-1"></i>
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="fas fa-calendar-times fa-4x text-muted mb-3"></i>
                <h4>No Appointments</h4>
                <p className="text-muted mb-4">You don't have any appointments scheduled yet.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowBookingModal(true)}
                >
                  <i className="fas fa-plus me-2"></i>
                  Book Your First Appointment
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="fas fa-calendar-plus me-2"></i>
                    Book New Appointment
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={() => setShowBookingModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleBookAppointment}>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Appointment Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={bookingData.date}
                          onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Preferred Time</label>
                        <select
                          className="form-select"
                          value={bookingData.time}
                          onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                          required
                        >
                          <option value="">Select time</option>
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="03:00 PM">03:00 PM</option>
                          <option value="04:00 PM">04:00 PM</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Appointment Type</label>
                        <select
                          className="form-select"
                          value={bookingData.type}
                          onChange={(e) => setBookingData({...bookingData, type: e.target.value})}
                          required
                        >
                          <option value="CONSULTATION">Consultation</option>
                          <option value="FOLLOW_UP">Follow-up</option>
                          <option value="ROUTINE_CHECKUP">Routine Checkup</option>
                          <option value="EMERGENCY">Emergency</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Doctor Preference</label>
                        <select
                          className="form-select"
                          value={bookingData.doctorId}
                          onChange={(e) => setBookingData({...bookingData, doctorId: e.target.value})}
                        >
                          <option value="">Any available doctor</option>
                          <option value="1">Dr. Sarah Johnson (Cardiology)</option>
                          <option value="2">Dr. Michael Chen (General Medicine)</option>
                          <option value="3">Dr. Emily Davis (Neurology)</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Reason for Visit</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Please describe your symptoms or reason for the appointment..."
                          value={bookingData.reason}
                          onChange={(e) => setBookingData({...bookingData, reason: e.target.value})}
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowBookingModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-check me-2"></i>
                      Book Appointment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
