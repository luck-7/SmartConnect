package com.smarthealth.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "departments")
public class Department {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Department name is required")
    @Size(max = 100, message = "Department name must not exceed 100 characters")
    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Column(name = "description", length = 500)
    private String description;
    
    @Size(max = 100, message = "Head name must not exceed 100 characters")
    @Column(name = "head", length = 100)
    private String head;
    
    @Size(max = 200, message = "Location must not exceed 200 characters")
    @Column(name = "location", length = 200)
    private String location;
    
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Phone number should be valid")
    @Column(name = "phone", length = 20)
    private String phone;
    
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    @Column(name = "email", length = 100)
    private String email;
    
    @Min(value = 1, message = "Capacity must be at least 1")
    @Column(name = "capacity")
    private Integer capacity;
    
    @Size(max = 1000, message = "Services must not exceed 1000 characters")
    @Column(name = "services", length = 1000)
    private String services;
    
    @Size(max = 100, message = "Operating hours must not exceed 100 characters")
    @Column(name = "operating_hours", length = 100)
    private String operatingHours;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Min(value = 0, message = "Total doctors must be positive")
    @Column(name = "total_doctors")
    private Integer totalDoctors = 0;
    
    @Min(value = 0, message = "Total patients must be positive")
    @Column(name = "total_patients")
    private Integer totalPatients = 0;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Doctor> doctors;
    
    // Constructors
    public Department() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Department(String name, String description) {
        this();
        this.name = name;
        this.description = description;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getHead() {
        return head;
    }
    
    public void setHead(String head) {
        this.head = head;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public Integer getCapacity() {
        return capacity;
    }
    
    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }
    
    public String getServices() {
        return services;
    }
    
    public void setServices(String services) {
        this.services = services;
    }
    
    public String getOperatingHours() {
        return operatingHours;
    }
    
    public void setOperatingHours(String operatingHours) {
        this.operatingHours = operatingHours;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
        this.updatedAt = LocalDateTime.now();
    }
    
    public Integer getTotalDoctors() {
        return totalDoctors;
    }
    
    public void setTotalDoctors(Integer totalDoctors) {
        this.totalDoctors = totalDoctors;
    }
    
    public Integer getTotalPatients() {
        return totalPatients;
    }
    
    public void setTotalPatients(Integer totalPatients) {
        this.totalPatients = totalPatients;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public List<Doctor> getDoctors() {
        return doctors;
    }
    
    public void setDoctors(List<Doctor> doctors) {
        this.doctors = doctors;
    }
    
    // Helper methods
    public void incrementDoctorCount() {
        this.totalDoctors = (this.totalDoctors == null ? 0 : this.totalDoctors) + 1;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void decrementDoctorCount() {
        this.totalDoctors = Math.max(0, (this.totalDoctors == null ? 0 : this.totalDoctors) - 1);
        this.updatedAt = LocalDateTime.now();
    }
    
    public void incrementPatientCount() {
        this.totalPatients = (this.totalPatients == null ? 0 : this.totalPatients) + 1;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void decrementPatientCount() {
        this.totalPatients = Math.max(0, (this.totalPatients == null ? 0 : this.totalPatients) - 1);
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
