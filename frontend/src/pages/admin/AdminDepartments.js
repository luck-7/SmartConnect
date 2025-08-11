import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    head: '',
    location: '',
    phone: '',
    email: '',
    capacity: '',
    services: '',
    operatingHours: '',
    isActive: true
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/departments');
      if (response.data) {
        setDepartments(response.data);
      } else {
        // Mock data for demonstration
        setDepartments([
          {
            id: 1,
            name: 'Cardiology',
            description: 'Specialized care for heart and cardiovascular conditions',
            head: 'Dr. Sarah Johnson',
            location: 'Building A, Floor 3',
            phone: '555-0301',
            email: 'cardiology@hospital.com',
            capacity: 50,
            services: 'ECG, Echocardiogram, Cardiac Catheterization, Heart Surgery',
            operatingHours: '24/7',
            isActive: true,
            totalDoctors: 8,
            totalPatients: 150,
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 2,
            name: 'Neurology',
            description: 'Treatment of nervous system disorders',
            head: 'Dr. Michael Chen',
            location: 'Building B, Floor 2',
            phone: '555-0302',
            email: 'neurology@hospital.com',
            capacity: 30,
            services: 'EEG, MRI, Neurological Examinations, Brain Surgery',
            operatingHours: 'Mon-Fri 8AM-6PM',
            isActive: true,
            totalDoctors: 5,
            totalPatients: 120,
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 3,
            name: 'Pediatrics',
            description: 'Medical care for infants, children, and adolescents',
            head: 'Dr. Emily Davis',
            location: 'Building C, Floor 1',
            phone: '555-0303',
            email: 'pediatrics@hospital.com',
            capacity: 40,
            services: 'Child Health Checkups, Vaccinations, Pediatric Surgery',
            operatingHours: 'Mon-Sat 7AM-8PM',
            isActive: true,
            totalDoctors: 6,
            totalPatients: 200,
            createdAt: '2024-01-01T00:00:00Z'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        // Update department
        const response = await axios.put(`/api/admin/departments/${editingDepartment.id}`, formData);
        if (response.data) {
          setDepartments(departments.map(dept => 
            dept.id === editingDepartment.id ? { ...dept, ...formData } : dept
          ));
          toast.success('Department updated successfully');
        }
      } else {
        // Create new department
        const response = await axios.post('/api/admin/departments', formData);
        if (response.data) {
          setDepartments([...departments, { 
            ...formData, 
            id: Date.now(), 
            createdAt: new Date().toISOString(),
            totalDoctors: 0,
            totalPatients: 0
          }]);
          toast.success('Department created successfully');
        }
      }
      resetForm();
    } catch (error) {
      console.error('Error saving department:', error);
      toast.error(editingDepartment ? 'Failed to update department' : 'Failed to create department');
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
      head: department.head,
      location: department.location,
      phone: department.phone,
      email: department.email,
      capacity: department.capacity,
      services: department.services,
      operatingHours: department.operatingHours,
      isActive: department.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await axios.delete(`/api/admin/departments/${departmentId}`);
        setDepartments(departments.filter(dept => dept.id !== departmentId));
        toast.success('Department deleted successfully');
      } catch (error) {
        console.error('Error deleting department:', error);
        toast.error('Failed to delete department');
      }
    }
  };

  const toggleDepartmentStatus = async (departmentId, currentStatus) => {
    try {
      await axios.patch(`/api/admin/departments/${departmentId}/status`, { isActive: !currentStatus });
      setDepartments(departments.map(dept => 
        dept.id === departmentId ? { ...dept, isActive: !currentStatus } : dept
      ));
      toast.success(`Department ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating department status:', error);
      toast.error('Failed to update department status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      head: '',
      location: '',
      phone: '',
      email: '',
      capacity: '',
      services: '',
      operatingHours: '',
      isActive: true
    });
    setEditingDepartment(null);
    setShowModal(false);
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner-border text-primary"></div>
        <p>Loading departments...</p>
      </div>
    );
  }

  return (
    <div className="admin-departments-container">
      <div className="container-fluid py-4">
        <div className="admin-header">
          <div className="admin-title-section">
            <h2 className="admin-title">
              <i className="fas fa-building"></i>
              Department Management
            </h2>
            <p className="admin-subtitle">Manage hospital departments and their information</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <i className="fas fa-plus me-2"></i>
            Add New Department
          </button>
        </div>

        <div className="admin-controls">
          <div className="row">
            <div className="col-md-8">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="stats-summary">
                <span className="stat-item">
                  <strong>{filteredDepartments.length}</strong> departments found
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="departments-grid">
          <div className="row">
            {filteredDepartments.map(department => (
              <div key={department.id} className="col-lg-6 col-xl-4 mb-4">
                <div className="department-card">
                  <div className="department-header">
                    <div className="department-icon">
                      <i className="fas fa-hospital"></i>
                    </div>
                    <div className="department-status">
                      <span className={`status-badge ${department.isActive ? 'active' : 'inactive'}`}>
                        {department.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="department-content">
                    <h4 className="department-name">{department.name}</h4>
                    <p className="department-description">{department.description}</p>
                    
                    <div className="department-details">
                      <div className="detail-item">
                        <i className="fas fa-user-md"></i>
                        <span>Head: {department.head}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{department.location}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-phone"></i>
                        <span>{department.phone}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-clock"></i>
                        <span>{department.operatingHours}</span>
                      </div>
                    </div>

                    <div className="department-stats">
                      <div className="stat">
                        <div className="stat-number">{department.totalDoctors || 0}</div>
                        <div className="stat-label">Doctors</div>
                      </div>
                      <div className="stat">
                        <div className="stat-number">{department.totalPatients || 0}</div>
                        <div className="stat-label">Patients</div>
                      </div>
                      <div className="stat">
                        <div className="stat-number">{department.capacity}</div>
                        <div className="stat-label">Capacity</div>
                      </div>
                    </div>

                    <div className="department-services">
                      <h6>Services:</h6>
                      <p className="services-text">{department.services}</p>
                    </div>
                  </div>

                  <div className="department-actions">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(department)}
                      title="Edit Department"
                    >
                      <i className="fas fa-edit"></i>
                      Edit
                    </button>
                    <button
                      className={`btn btn-sm ${department.isActive ? 'btn-outline-warning' : 'btn-outline-success'}`}
                      onClick={() => toggleDepartmentStatus(department.id, department.isActive)}
                      title={department.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <i className={`fas ${department.isActive ? 'fa-pause' : 'fa-play'}`}></i>
                      {department.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(department.id)}
                      title="Delete Department"
                    >
                      <i className="fas fa-trash"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Modal */}
        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="fas fa-building me-2"></i>
                    {editingDepartment ? 'Edit Department' : 'Add New Department'}
                  </h5>
                  <button className="btn-close" onClick={resetForm}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Department Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Department Head</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.head}
                            onChange={(e) => setFormData({...formData, head: e.target.value})}
                            placeholder="Dr. Name"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Brief description of the department..."
                      ></textarea>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Location</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            placeholder="Building, Floor, Room"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Capacity</label>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.capacity}
                            onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                            min="1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Operating Hours</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.operatingHours}
                        onChange={(e) => setFormData({...formData, operatingHours: e.target.value})}
                        placeholder="e.g., Mon-Fri 8AM-6PM or 24/7"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Services Offered</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.services}
                        onChange={(e) => setFormData({...formData, services: e.target.value})}
                        placeholder="List of services separated by commas..."
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        />
                        <label className="form-check-label" htmlFor="isActive">
                          Active Department
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-save me-2"></i>
                      {editingDepartment ? 'Update Department' : 'Create Department'}
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

export default AdminDepartments;
