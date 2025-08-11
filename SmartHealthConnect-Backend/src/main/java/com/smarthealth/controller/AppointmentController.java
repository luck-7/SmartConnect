package com.smarthealth.controller;

import com.smarthealth.entity.Appointment;
import com.smarthealth.entity.User;
import com.smarthealth.repository.AppointmentRepository;
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
import java.util.Optional;

@RestController
@RequestMapping("/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/patient")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> getPatientAppointments(Authentication auth) {
        try {
            User user = (User) auth.getPrincipal();
            List<Appointment> appointments = appointmentRepository.findByPatientId(user.getId());
            
            List<Map<String, Object>> appointmentList = appointments.stream().map(this::mapAppointmentToResponse).toList();
            
            return ResponseEntity.ok(Map.of(
                "appointments", appointmentList,
                "count", appointments.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch appointments: " + e.getMessage()));
        }
    }

    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> getDoctorAppointments(Authentication auth) {
        try {
            User user = (User) auth.getPrincipal();
            List<Appointment> appointments = appointmentRepository.findByDoctorId(user.getId());
            
            List<Map<String, Object>> appointmentList = appointments.stream().map(this::mapAppointmentToResponse).toList();
            
            return ResponseEntity.ok(Map.of(
                "appointments", appointmentList,
                "count", appointments.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch appointments: " + e.getMessage()));
        }
    }

    @GetMapping("/doctor/today")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> getTodayAppointments(Authentication auth) {
        try {
            User user = (User) auth.getPrincipal();
            LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime endOfDay = startOfDay.plusDays(1);
            List<Appointment> appointments = appointmentRepository.findTodayAppointmentsByDoctor(user.getId(), startOfDay, endOfDay);
            
            List<Map<String, Object>> appointmentList = appointments.stream().map(this::mapAppointmentToResponse).toList();
            
            return ResponseEntity.ok(Map.of(
                "appointments", appointmentList,
                "count", appointments.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch today's appointments: " + e.getMessage()));
        }
    }

    @GetMapping("/upcoming")
    public ResponseEntity<?> getUpcomingAppointments(Authentication auth) {
        try {
            User user = (User) auth.getPrincipal();
            List<Appointment> appointments;
            
            if (user.getRole() == User.Role.PATIENT) {
                appointments = appointmentRepository.findUpcomingAppointmentsByPatient(user.getId(), LocalDateTime.now());
            } else if (user.getRole() == User.Role.DOCTOR) {
                appointments = appointmentRepository.findUpcomingAppointmentsByDoctor(user.getId(), LocalDateTime.now());
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid user role"));
            }
            
            List<Map<String, Object>> appointmentList = appointments.stream().map(this::mapAppointmentToResponse).toList();
            
            return ResponseEntity.ok(Map.of(
                "appointments", appointmentList,
                "count", appointments.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch upcoming appointments: " + e.getMessage()));
        }
    }

    @PostMapping("/book")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentRequest request, Authentication auth) {
        try {
            User patient = (User) auth.getPrincipal();
            
            Optional<User> doctorOpt = userRepository.findById(request.getDoctorId());
            if (doctorOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Doctor not found"));
            }
            
            User doctor = doctorOpt.get();
            if (doctor.getRole() != User.Role.DOCTOR) {
                return ResponseEntity.badRequest().body(Map.of("error", "Selected user is not a doctor"));
            }
            
            // Check for conflicts
            LocalDateTime startTime = request.getAppointmentDate();
            LocalDateTime endTime = startTime.plusMinutes(request.getDurationMinutes() != null ? request.getDurationMinutes() : 30);
            
            List<Appointment> conflicts = appointmentRepository.findConflictingAppointments(
                doctor.getId(), startTime, endTime);
            
            if (!conflicts.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Doctor is not available at this time"));
            }
            
            Appointment appointment = new Appointment(patient, doctor, request.getAppointmentDate(), 
                                                    request.getType(), request.getReason());
            appointment.setDurationMinutes(request.getDurationMinutes());
            appointment.setIsVideoConsultation(request.getIsVideoConsultation());
            
            Appointment saved = appointmentRepository.save(appointment);
            
            return ResponseEntity.ok(Map.of(
                "message", "Appointment booked successfully",
                "appointmentId", saved.getId(),
                "appointment", mapAppointmentToResponse(saved)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to book appointment: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long id, 
                                                   @RequestBody Map<String, String> request, 
                                                   Authentication auth) {
        try {
            Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
            if (appointmentOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Appointment appointment = appointmentOpt.get();
            User user = (User) auth.getPrincipal();
            
            // Check if user has permission to update this appointment
            if (!appointment.getPatient().getId().equals(user.getId()) && 
                !appointment.getDoctor().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
            }
            
            String statusStr = request.get("status");
            Appointment.Status status = Appointment.Status.valueOf(statusStr.toUpperCase());
            appointment.setStatus(status);
            
            if (request.containsKey("notes")) {
                appointment.setNotes(request.get("notes"));
            }
            
            Appointment updated = appointmentRepository.save(appointment);
            
            return ResponseEntity.ok(Map.of(
                "message", "Appointment status updated successfully",
                "appointment", mapAppointmentToResponse(updated)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update appointment: " + e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getAppointmentStats(Authentication auth) {
        try {
            User user = (User) auth.getPrincipal();
            Map<String, Object> stats = new HashMap<>();
            
            if (user.getRole() == User.Role.PATIENT) {
                stats.put("total", appointmentRepository.countAppointmentsByPatientAndStatus(user.getId(), null));
                stats.put("scheduled", appointmentRepository.countAppointmentsByPatientAndStatus(user.getId(), Appointment.Status.SCHEDULED));
                stats.put("completed", appointmentRepository.countAppointmentsByPatientAndStatus(user.getId(), Appointment.Status.COMPLETED));
            } else if (user.getRole() == User.Role.DOCTOR) {
                stats.put("total", appointmentRepository.countAppointmentsByDoctorAndStatus(user.getId(), null));
                stats.put("scheduled", appointmentRepository.countAppointmentsByDoctorAndStatus(user.getId(), Appointment.Status.SCHEDULED));
                stats.put("completed", appointmentRepository.countAppointmentsByDoctorAndStatus(user.getId(), Appointment.Status.COMPLETED));
            }
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch stats: " + e.getMessage()));
        }
    }

    private Map<String, Object> mapAppointmentToResponse(Appointment appointment) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", appointment.getId());
        response.put("appointmentDate", appointment.getAppointmentDate().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        response.put("type", appointment.getType());
        response.put("status", appointment.getStatus());
        response.put("reason", appointment.getReason());
        response.put("notes", appointment.getNotes());
        response.put("durationMinutes", appointment.getDurationMinutes());
        response.put("isVideoConsultation", appointment.getIsVideoConsultation());
        response.put("createdAt", appointment.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        
        // Patient info
        Map<String, Object> patientInfo = new HashMap<>();
        patientInfo.put("id", appointment.getPatient().getId());
        patientInfo.put("name", appointment.getPatient().getFirstName() + " " + appointment.getPatient().getLastName());
        patientInfo.put("email", appointment.getPatient().getEmail());
        response.put("patient", patientInfo);
        
        // Doctor info
        Map<String, Object> doctorInfo = new HashMap<>();
        doctorInfo.put("id", appointment.getDoctor().getId());
        doctorInfo.put("name", appointment.getDoctor().getFirstName() + " " + appointment.getDoctor().getLastName());
        doctorInfo.put("email", appointment.getDoctor().getEmail());
        response.put("doctor", doctorInfo);
        
        return response;
    }

    // Request DTOs
    public static class AppointmentRequest {
        private Long doctorId;
        private LocalDateTime appointmentDate;
        private String type;
        private String reason;
        private Integer durationMinutes;
        private Boolean isVideoConsultation;

        // Getters and setters
        public Long getDoctorId() { return doctorId; }
        public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
        public LocalDateTime getAppointmentDate() { return appointmentDate; }
        public void setAppointmentDate(LocalDateTime appointmentDate) { this.appointmentDate = appointmentDate; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
        public Integer getDurationMinutes() { return durationMinutes; }
        public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
        public Boolean getIsVideoConsultation() { return isVideoConsultation; }
        public void setIsVideoConsultation(Boolean isVideoConsultation) { this.isVideoConsultation = isVideoConsultation; }
    }
}
