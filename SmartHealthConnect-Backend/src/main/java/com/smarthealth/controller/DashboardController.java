package com.smarthealth.controller;

import com.smarthealth.entity.Appointment;
import com.smarthealth.entity.User;
import com.smarthealth.repository.AppointmentRepository;
import com.smarthealth.repository.MedicalRecordRepository;
import com.smarthealth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/patient")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> getPatientDashboard(Authentication auth) {
        try {
            User user = (User) auth.getPrincipal();
            Map<String, Object> dashboard = new HashMap<>();
            
            // Upcoming appointments
            List<Appointment> upcomingAppointments = appointmentRepository.findUpcomingAppointmentsByPatient(user.getId(), LocalDateTime.now());
            dashboard.put("upcomingAppointments", upcomingAppointments.stream()
                .limit(5)
                .map(this::mapAppointmentToSimpleResponse)
                .toList());
            
            // Recent medical records
            List<com.smarthealth.entity.MedicalRecord> recentRecords = medicalRecordRepository.findPatientRecordsOrderByDate(user.getId());
            dashboard.put("recentRecords", recentRecords.stream()
                .limit(5)
                .map(this::mapRecordToSimpleResponse)
                .toList());
            
            // Health stats
            Map<String, Object> healthStats = new HashMap<>();
            healthStats.put("totalAppointments", appointmentRepository.countAppointmentsByPatientAndStatus(user.getId(), null));
            healthStats.put("completedAppointments", appointmentRepository.countAppointmentsByPatientAndStatus(user.getId(), Appointment.Status.COMPLETED));
            healthStats.put("totalRecords", medicalRecordRepository.countRecordsByPatient(user.getId()));
            healthStats.put("upcomingCount", upcomingAppointments.size());
            dashboard.put("healthStats", healthStats);
            
            // Notifications (mock data for now)
            dashboard.put("notifications", List.of(
                Map.of("id", 1, "message", "Appointment reminder: Tomorrow at 2:00 PM", "type", "reminder", "read", false),
                Map.of("id", 2, "message", "New test results available", "type", "info", "read", false),
                Map.of("id", 3, "message", "Prescription refill due", "type", "warning", "read", true)
            ));
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch patient dashboard: " + e.getMessage()));
        }
    }

    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> getDoctorDashboard(Authentication auth) {
        try {
            User user = (User) auth.getPrincipal();
            Map<String, Object> dashboard = new HashMap<>();
            
            // Today's appointments
            LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime endOfDay = startOfDay.plusDays(1);
            List<Appointment> todayAppointments = appointmentRepository.findTodayAppointmentsByDoctor(user.getId(), startOfDay, endOfDay);
            dashboard.put("todayAppointments", todayAppointments.stream()
                .map(this::mapAppointmentToSimpleResponse)
                .toList());
            
            // Upcoming appointments
            List<Appointment> upcomingAppointments = appointmentRepository.findUpcomingAppointmentsByDoctor(user.getId(), LocalDateTime.now());
            dashboard.put("upcomingAppointments", upcomingAppointments.stream()
                .limit(5)
                .map(this::mapAppointmentToSimpleResponse)
                .toList());
            
            // Recent patients (from recent appointments)
            List<Appointment> recentAppointments = appointmentRepository.findByDoctorId(user.getId());
            dashboard.put("recentPatients", recentAppointments.stream()
                .limit(5)
                .map(appointment -> {
                    Map<String, Object> patient = new HashMap<>();
                    patient.put("id", appointment.getPatient().getId());
                    patient.put("name", appointment.getPatient().getFirstName() + " " + appointment.getPatient().getLastName());
                    patient.put("email", appointment.getPatient().getEmail());
                    patient.put("lastVisit", appointment.getAppointmentDate().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
                    return patient;
                })
                .toList());
            
            // Consultation stats
            Map<String, Object> consultationStats = new HashMap<>();
            consultationStats.put("totalAppointments", appointmentRepository.countAppointmentsByDoctorAndStatus(user.getId(), null));
            consultationStats.put("completedAppointments", appointmentRepository.countAppointmentsByDoctorAndStatus(user.getId(), Appointment.Status.COMPLETED));
            consultationStats.put("todayCount", todayAppointments.size());
            consultationStats.put("upcomingCount", upcomingAppointments.size());
            consultationStats.put("totalRecords", medicalRecordRepository.countRecordsByDoctor(user.getId()));
            dashboard.put("consultationStats", consultationStats);
            
            // Notifications (mock data for now)
            dashboard.put("notifications", List.of(
                Map.of("id", 1, "message", "New patient registration", "type", "info", "read", false),
                Map.of("id", 2, "message", "Appointment cancellation", "type", "warning", "read", false),
                Map.of("id", 3, "message", "Lab results ready for review", "type", "info", "read", true)
            ));
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch doctor dashboard: " + e.getMessage()));
        }
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminDashboard(Authentication auth) {
        try {
            Map<String, Object> dashboard = new HashMap<>();
            
            // System stats
            Map<String, Object> systemStats = new HashMap<>();
            systemStats.put("totalUsers", userRepository.count());
            systemStats.put("totalPatients", userRepository.countActiveUsersByRole(User.Role.PATIENT));
            systemStats.put("totalDoctors", userRepository.countActiveUsersByRole(User.Role.DOCTOR));
            systemStats.put("totalAppointments", appointmentRepository.count());
            
            LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime endOfDay = startOfDay.plusDays(1);
            systemStats.put("todayAppointments", appointmentRepository.findDoctorAppointmentsByDateRange(null, startOfDay, endOfDay).size());
            systemStats.put("activeConsultations", appointmentRepository.findByDoctorIdAndStatus(null, Appointment.Status.IN_PROGRESS).size());
            systemStats.put("totalRecords", medicalRecordRepository.count());
            dashboard.put("dashboardStats", systemStats);
            
            // System health
            Map<String, Object> systemHealth = new HashMap<>();
            systemHealth.put("serverStatus", "online");
            systemHealth.put("databaseStatus", "online");
            systemHealth.put("apiResponseTime", "120ms");
            systemHealth.put("uptime", "99.9%");
            dashboard.put("systemHealth", systemHealth);
            
            // Recent activities (mock data)
            dashboard.put("recentActivities", List.of(
                Map.of("id", 1, "activity", "New user registration", "user", "John Doe", "timestamp", LocalDateTime.now().minusMinutes(5).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)),
                Map.of("id", 2, "activity", "Appointment booked", "user", "Jane Smith", "timestamp", LocalDateTime.now().minusMinutes(15).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)),
                Map.of("id", 3, "activity", "Medical record created", "user", "Dr. Wilson", "timestamp", LocalDateTime.now().minusMinutes(30).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
            ));
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch admin dashboard: " + e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats(Authentication auth) {
        try {
            User user = (User) auth.getPrincipal();
            Map<String, Object> stats = new HashMap<>();
            
            switch (user.getRole()) {
                case PATIENT:
                    stats.put("appointments", appointmentRepository.countAppointmentsByPatientAndStatus(user.getId(), null));
                    stats.put("records", medicalRecordRepository.countRecordsByPatient(user.getId()));
                    break;
                case DOCTOR:
                    stats.put("appointments", appointmentRepository.countAppointmentsByDoctorAndStatus(user.getId(), null));
                    stats.put("records", medicalRecordRepository.countRecordsByDoctor(user.getId()));
                    break;
                case ADMIN:
                    stats.put("totalUsers", userRepository.count());
                    stats.put("totalAppointments", appointmentRepository.count());
                    stats.put("totalRecords", medicalRecordRepository.count());
                    break;
            }
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch stats: " + e.getMessage()));
        }
    }

    private Map<String, Object> mapAppointmentToSimpleResponse(Appointment appointment) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", appointment.getId());
        response.put("date", appointment.getAppointmentDate().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        response.put("type", appointment.getType());
        response.put("status", appointment.getStatus());
        response.put("reason", appointment.getReason());
        response.put("patientName", appointment.getPatient().getFirstName() + " " + appointment.getPatient().getLastName());
        response.put("doctorName", appointment.getDoctor().getFirstName() + " " + appointment.getDoctor().getLastName());
        return response;
    }

    private Map<String, Object> mapRecordToSimpleResponse(com.smarthealth.entity.MedicalRecord record) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", record.getId());
        response.put("title", record.getTitle());
        response.put("type", record.getType());
        response.put("date", record.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        response.put("doctorName", record.getDoctor().getFirstName() + " " + record.getDoctor().getLastName());
        return response;
    }
}
