import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterDate, setFilterDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    type: 'CONSULTATION',
    status: 'SCHEDULED',
    notes: '',
    duration: 30
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/appointments');
      if (response.data) {
        setAppointments(response.data);
      } else {
        // Mock data for demonstration
        setAppointments([
          {
            id: 1,
            patient: { id: 1, name: 'John Doe', email: 'john@example.com' },
            doctor: { id: 1, name: 'Dr. Sarah Johnson', specialization: 'Cardiology' },
            appointmentDate: '2024-12-20',
            appointmentTime: '10:00',
            type: 'CONSULTATION',
            status: 'SCHEDULED',
            notes: 'Regular checkup',
            duration: 30,
            createdAt: '2024-12-15T10:00:00Z'
          },
          {
            id: 2,
            patient: { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
            doctor: { id: 2, name: 'Dr. Michael Chen', specialization: 'Neurology' },
            appointmentDate: '2024-12-21',
            appointmentTime: '14:30',
            type: 'FOLLOW_UP',
            status: 'CONFIRMED',
            notes: 'Follow-up for headache treatment',
            duration: 45,
            createdAt: '2024-12-16T09:30:00Z'
          },
          {
            id: 3,
            patient: { id: 3, name: 'Bob Wilson', email: 'bob@example.com' },
            doctor: { id: 1, name: 'Dr. Sarah Johnson', specialization: 'Cardiology' },
            appointmentDate: '2024-12-19',
            appointmentTime: '09:00',
            type: 'EMERGENCY',
            status: 'COMPLETED',
            notes: 'Chest pain emergency',
            duration: 60,
            createdAt: '2024-12-19T08:00:00Z'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/admin/doctors');
      if (response.data) {
        setDoctors(response.data);
      } else {
        setDoctors([
          { id: 1, firstName: 'Dr. Sarah', lastName: 'Johnson', specialization: 'Cardiology' },
          { id: 2, firstName: 'Dr. Michael', lastName: 'Chen', specialization: 'Neurology' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/api/admin/patients');
      if (response.data) {
        setPatients(response.data);
      } else {
        setPatients([
          { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
          { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
          { id: 3, firstName: 'Bob', lastName: 'Wilson', email: 'bob@example.com' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        ...formData,
        appointmentDateTime: `${formData.appointmentDate}T${formData.appointmentTime}:00`
      };

      if (editingAppointment) {
        // Update appointment
        const response = await axios.put(`/api/admin/appointments/${editingAppointment.id}`, appointmentData);
        if (response.data) {
          setAppointments(appointments.map(apt => 
            apt.id === editingAppointment.id ? { ...apt, ...appointmentData } : apt
          ));
          toast.success('Appointment updated successfully');
        }
      } else {
        // Create new appointment
        const response = await axios.post('/api/admin/appointments', appointmentData);
        if (response.data) {
          const newAppointment = {
            ...appointmentData,
            id: Date.now(),
            patient: patients.find(p => p.id === parseInt(formData.patientId)),
            doctor: doctors.find(d => d.id === parseInt(formData.doctorId)),
            createdAt: new Date().toISOString()
          };
          setAppointments([...appointments, newAppointment]);
          toast.success('Appointment created successfully');
        }
      }
      resetForm();
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast.error(editingAppointment ? 'Failed to update appointment' : 'Failed to create appointment');
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      patientId: appointment.patient.id,
      doctorId: appointment.doctor.id,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      type: appointment.type,
      status: appointment.status,
      notes: appointment.notes || '',
      duration: appointment.duration || 30
    });
    setShowModal(true);
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`/api/admin/appointments/${appointmentId}`);
        setAppointments(appointments.filter(apt => apt.id !== appointmentId));
        toast.success('Appointment deleted successfully');
      } catch (error) {
        console.error('Error deleting appointment:', error);
        toast.error('Failed to delete appointment');
      }
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await axios.patch(`/api/admin/appointments/${appointmentId}/status`, { status: newStatus });
      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      ));
      toast.success('Appointment status updated');
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      appointmentDate: '',
      appointmentTime: '',
      type: 'CONSULTATION',
      status: 'SCHEDULED',
      notes: '',
      duration: 30
    });
    setEditingAppointment(null);
    setShowModal(false);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || appointment.status === filterStatus;
    const matchesDate = !filterDate || appointment.appointmentDate === filterDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'badge-primary';
      case 'CONFIRMED': return 'badge-info';
      case 'IN_PROGRESS': return 'badge-warning';
      case 'COMPLETED': return 'badge-success';
      case 'CANCELLED': return 'badge-danger';
      case 'NO_SHOW': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'CONSULTATION': return 'badge-primary';
      case 'FOLLOW_UP': return 'badge-info';
      case 'EMERGENCY': return 'badge-danger';
      case 'ROUTINE_CHECKUP': return 'badge-success';
      default: return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner-border text-primary"></div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="admin-appointments-container">
      <div className="container-fluid py-4">
        <div className="admin-header">
          <div className="admin-title-section">
            <h2 className="admin-title">
              <i className="fas fa-calendar-alt"></i>
              Appointment Management
            </h2>
            <p className="admin-subtitle">Manage patient appointments and scheduling</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <i className="fas fa-plus me-2"></i>
            Schedule Appointment
          </button>
        </div>

        <div className="admin-controls">
          <div className="row">
            <div className="col-md-4">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-control"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No Show</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <div className="stats-summary">
                <span className="stat-item">
                  <strong>{filteredAppointments.length}</strong> found
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-table-container">
          <div className="table-responsive">
            <table className="table admin-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td>
                      <div className="patient-info">
                        <div className="patient-avatar">
                          {appointment.patient.name.charAt(0)}
                        </div>
                        <div className="patient-details">
                          <div className="patient-name">{appointment.patient.name}</div>
                          <div className="patient-email">{appointment.patient.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="doctor-info">
                        <div className="doctor-name">{appointment.doctor.name}</div>
                        <div className="doctor-specialization">{appointment.doctor.specialization}</div>
                      </div>
                    </td>
                    <td>
                      <div className="datetime-info">
                        <div className="date">
                          <i className="fas fa-calendar"></i>
                          {new Date(appointment.appointmentDate).toLocaleDateString()}
                        </div>
                        <div className="time">
                          <i className="fas fa-clock"></i>
                          {appointment.appointmentTime}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getTypeBadgeClass(appointment.type)}`}>
                        {appointment.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="status-container">
                        <span className={`badge ${getStatusBadgeClass(appointment.status)}`}>
                          {appointment.status.replace('_', ' ')}
                        </span>
                        <select
                          className="form-select form-select-sm mt-1"
                          value={appointment.status}
                          onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                        >
                          <option value="SCHEDULED">Scheduled</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                          <option value="NO_SHOW">No Show</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <div className="duration-info">
                        <i className="fas fa-hourglass-half"></i>
                        {appointment.duration} min
                      </div>
                    </td>
                    <td>
                      <div className="notes-preview">
                        {appointment.notes ? (
                          <span title={appointment.notes}>
                            {appointment.notes.length > 30 
                              ? `${appointment.notes.substring(0, 30)}...` 
                              : appointment.notes}
                          </span>
                        ) : (
                          <span className="text-muted">No notes</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(appointment)}
                          title="Edit Appointment"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-info"
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(appointment.id)}
                          title="Delete Appointment"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Appointment Modal */}
        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="fas fa-calendar-plus me-2"></i>
                    {editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
                  </h5>
                  <button className="btn-close" onClick={resetForm}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Patient *</label>
                          <select
                            className="form-control"
                            value={formData.patientId}
                            onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                            required
                          >
                            <option value="">Select Patient</option>
                            {patients.map(patient => (
                              <option key={patient.id} value={patient.id}>
                                {patient.firstName} {patient.lastName} - {patient.email}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Doctor *</label>
                          <select
                            className="form-control"
                            value={formData.doctorId}
                            onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                            required
                          >
                            <option value="">Select Doctor</option>
                            {doctors.map(doctor => (
                              <option key={doctor.id} value={doctor.id}>
                                {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Date *</label>
                          <input
                            type="date"
                            className="form-control"
                            value={formData.appointmentDate}
                            onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Time *</label>
                          <input
                            type="time"
                            className="form-control"
                            value={formData.appointmentTime}
                            onChange={(e) => setFormData({...formData, appointmentTime: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Type *</label>
                          <select
                            className="form-control"
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            required
                          >
                            <option value="CONSULTATION">Consultation</option>
                            <option value="FOLLOW_UP">Follow Up</option>
                            <option value="ROUTINE_CHECKUP">Routine Checkup</option>
                            <option value="EMERGENCY">Emergency</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Duration (minutes)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.duration}
                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                            min="15"
                            max="180"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select
                        className="form-control"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="NO_SHOW">No Show</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Notes</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Additional notes about the appointment..."
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-save me-2"></i>
                      {editingAppointment ? 'Update Appointment' : 'Schedule Appointment'}
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

export default AdminAppointments;
