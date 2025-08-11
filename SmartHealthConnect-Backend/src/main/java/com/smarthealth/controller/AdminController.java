package com.smarthealth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {
    
    @GetMapping("/test")
    public ResponseEntity<?> testAdmin() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Admin controller is working!");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<Map<String, Object>> users = createMockUsers();
            
            Map<String, Object> response = new HashMap<>();
            response.put("users", users);
            response.put("totalItems", users.size());
            response.put("currentPage", 0);
            response.put("totalPages", 1);
            response.put("hasNext", false);
            response.put("hasPrevious", false);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch users: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @GetMapping("/doctors")
    public ResponseEntity<?> getAllDoctors() {
        try {
            List<Map<String, Object>> doctors = createMockDoctors();
            
            Map<String, Object> response = new HashMap<>();
            response.put("doctors", doctors);
            response.put("totalItems", doctors.size());
            response.put("currentPage", 0);
            response.put("totalPages", 1);
            response.put("hasNext", false);
            response.put("hasPrevious", false);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch doctors: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @GetMapping("/departments")
    public ResponseEntity<?> getAllDepartments() {
        try {
            List<Map<String, Object>> departments = createMockDepartments();
            
            Map<String, Object> response = new HashMap<>();
            response.put("departments", departments);
            response.put("totalItems", departments.size());
            response.put("currentPage", 0);
            response.put("totalPages", 1);
            response.put("hasNext", false);
            response.put("hasPrevious", false);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch departments: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @GetMapping("/appointments")
    public ResponseEntity<?> getAllAppointments() {
        try {
            List<Map<String, Object>> appointments = createMockAppointments();
            
            Map<String, Object> response = new HashMap<>();
            response.put("appointments", appointments);
            response.put("totalItems", appointments.size());
            response.put("currentPage", 0);
            response.put("totalPages", 1);
            response.put("hasNext", false);
            response.put("hasPrevious", false);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch appointments: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, Object> userData) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User created successfully");
        response.put("user", userData);
        return ResponseEntity.status(201).body(response);
    }
    
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> userData) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User updated successfully");
        response.put("user", userData);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/doctors")
    public ResponseEntity<?> createDoctor(@RequestBody Map<String, Object> doctorData) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Doctor created successfully");
        response.put("doctor", doctorData);
        return ResponseEntity.status(201).body(response);
    }
    
    @PutMapping("/doctors/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long id, @RequestBody Map<String, Object> doctorData) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Doctor updated successfully");
        response.put("doctor", doctorData);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Doctor deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/departments")
    public ResponseEntity<?> createDepartment(@RequestBody Map<String, Object> departmentData) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Department created successfully");
        response.put("department", departmentData);
        return ResponseEntity.status(201).body(response);
    }
    
    @PutMapping("/departments/{id}")
    public ResponseEntity<?> updateDepartment(@PathVariable Long id, @RequestBody Map<String, Object> departmentData) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Department updated successfully");
        response.put("department", departmentData);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/departments/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Department deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/appointments")
    public ResponseEntity<?> createAppointment(@RequestBody Map<String, Object> appointmentData) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Appointment created successfully");
        response.put("appointment", appointmentData);
        return ResponseEntity.status(201).body(response);
    }
    
    @PutMapping("/appointments/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id, @RequestBody Map<String, Object> appointmentData) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Appointment updated successfully");
        response.put("appointment", appointmentData);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Appointment deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    private List<Map<String, Object>> createMockUsers() {
        List<Map<String, Object>> users = new ArrayList<>();
        
        Map<String, Object> user1 = new HashMap<>();
        user1.put("id", 1);
        user1.put("username", "newuser2025");
        user1.put("email", "patient@example.com");
        user1.put("firstName", "John");
        user1.put("lastName", "Doe");
        user1.put("phoneNumber", "1234567890");
        user1.put("role", "PATIENT");
        user1.put("isActive", true);
        user1.put("createdAt", "2024-01-15T10:30:00Z");
        user1.put("emailVerified", true);
        users.add(user1);
        
        Map<String, Object> user2 = new HashMap<>();
        user2.put("id", 2);
        user2.put("username", "doctor1");
        user2.put("email", "doctor1@example.com");
        user2.put("firstName", "Dr. Sarah");
        user2.put("lastName", "Johnson");
        user2.put("phoneNumber", "9876543210");
        user2.put("role", "DOCTOR");
        user2.put("isActive", true);
        user2.put("createdAt", "2024-01-10T08:15:00Z");
        user2.put("emailVerified", true);
        users.add(user2);
        
        Map<String, Object> user3 = new HashMap<>();
        user3.put("id", 3);
        user3.put("username", "admin1");
        user3.put("email", "admin1@example.com");
        user3.put("firstName", "Admin");
        user3.put("lastName", "User");
        user3.put("phoneNumber", "5555555555");
        user3.put("role", "ADMIN");
        user3.put("isActive", true);
        user3.put("createdAt", "2024-01-01T00:00:00Z");
        user3.put("emailVerified", true);
        users.add(user3);
        
        return users;
    }
    
    private List<Map<String, Object>> createMockDoctors() {
        List<Map<String, Object>> doctors = new ArrayList<>();
        
        Map<String, Object> doctor1 = new HashMap<>();
        doctor1.put("id", 1);
        doctor1.put("firstName", "Dr. Sarah");
        doctor1.put("lastName", "Johnson");
        doctor1.put("email", "sarah.johnson@hospital.com");
        doctor1.put("phoneNumber", "555-0101");
        doctor1.put("specialization", "Cardiology");
        doctor1.put("department", "Cardiology");
        doctor1.put("licenseNumber", "MD12345");
        doctor1.put("experience", "10 years");
        doctor1.put("education", "Harvard Medical School");
        doctor1.put("consultationFee", 200);
        doctor1.put("availability", "AVAILABLE");
        doctor1.put("bio", "Experienced cardiologist specializing in heart disease prevention.");
        doctor1.put("rating", 4.8);
        doctor1.put("totalPatients", 150);
        doctor1.put("createdAt", "2024-01-10T08:15:00Z");
        doctors.add(doctor1);
        
        return doctors;
    }
    
    private List<Map<String, Object>> createMockDepartments() {
        List<Map<String, Object>> departments = new ArrayList<>();
        
        Map<String, Object> dept1 = new HashMap<>();
        dept1.put("id", 1);
        dept1.put("name", "Cardiology");
        dept1.put("description", "Specialized care for heart and cardiovascular conditions");
        dept1.put("head", "Dr. Sarah Johnson");
        dept1.put("location", "Building A, Floor 3");
        dept1.put("phone", "555-0301");
        dept1.put("email", "cardiology@hospital.com");
        dept1.put("capacity", 50);
        dept1.put("services", "ECG, Echocardiogram, Cardiac Catheterization, Heart Surgery");
        dept1.put("operatingHours", "24/7");
        dept1.put("isActive", true);
        dept1.put("totalDoctors", 8);
        dept1.put("totalPatients", 150);
        dept1.put("createdAt", "2024-01-01T00:00:00Z");
        departments.add(dept1);
        
        return departments;
    }
    
    private List<Map<String, Object>> createMockAppointments() {
        List<Map<String, Object>> appointments = new ArrayList<>();
        
        Map<String, Object> apt1 = new HashMap<>();
        apt1.put("id", 1);
        
        Map<String, Object> patient1 = new HashMap<>();
        patient1.put("id", 1);
        patient1.put("name", "John Doe");
        patient1.put("email", "john@example.com");
        apt1.put("patient", patient1);
        
        Map<String, Object> doctor1 = new HashMap<>();
        doctor1.put("id", 1);
        doctor1.put("name", "Dr. Sarah Johnson");
        doctor1.put("specialization", "Cardiology");
        apt1.put("doctor", doctor1);
        
        apt1.put("appointmentDate", "2024-12-20");
        apt1.put("appointmentTime", "10:00");
        apt1.put("type", "CONSULTATION");
        apt1.put("status", "SCHEDULED");
        apt1.put("notes", "Regular checkup");
        apt1.put("duration", 30);
        apt1.put("createdAt", "2024-12-15T10:00:00Z");
        appointments.add(apt1);
        
        return appointments;
    }
}
