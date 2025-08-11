package com.smarthealth.controller;

import com.smarthealth.entity.MedicalRecord;
import com.smarthealth.entity.User;
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
import java.util.Optional;

@RestController
@RequestMapping("/medical-records")
@CrossOrigin(origins = "http://localhost:3000")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/patient")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> getPatientRecords(Authentication auth) {
        try {
            User user = (User) auth.getPrincipal();
            List<MedicalRecord> records = medicalRecordRepository.findPatientRecordsOrderByDate(user.getId());
            
            List<Map<String, Object>> recordList = records.stream().map(this::mapRecordToResponse).toList();
            
            return ResponseEntity.ok(Map.of(
                "records", recordList,
                "count", records.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch medical records: " + e.getMessage()));
        }
    }

    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> getDoctorRecords(Authentication auth) {
        try {
            User user = (User) auth.getPrincipal();
            List<MedicalRecord> records = medicalRecordRepository.findDoctorRecordsOrderByDate(user.getId());
            
            List<Map<String, Object>> recordList = records.stream().map(this::mapRecordToResponse).toList();
            
            return ResponseEntity.ok(Map.of(
                "records", recordList,
                "count", records.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch medical records: " + e.getMessage()));
        }
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getPatientRecordsByDoctor(@PathVariable Long patientId, Authentication auth) {
        try {
            List<MedicalRecord> records = medicalRecordRepository.findNonConfidentialRecordsByPatient(patientId);
            
            List<Map<String, Object>> recordList = records.stream().map(this::mapRecordToResponse).toList();
            
            return ResponseEntity.ok(Map.of(
                "records", recordList,
                "count", records.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch patient records: " + e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> createMedicalRecord(@RequestBody MedicalRecordRequest request, Authentication auth) {
        try {
            User doctor = (User) auth.getPrincipal();
            
            Optional<User> patientOpt = userRepository.findById(request.getPatientId());
            if (patientOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Patient not found"));
            }
            
            User patient = patientOpt.get();
            if (patient.getRole() != User.Role.PATIENT) {
                return ResponseEntity.badRequest().body(Map.of("error", "Selected user is not a patient"));
            }
            
            MedicalRecord record = new MedicalRecord(patient, doctor, request.getTitle(), 
                                                   MedicalRecord.RecordType.valueOf(request.getType().toUpperCase()));
            record.setDiagnosis(request.getDiagnosis());
            record.setSymptoms(request.getSymptoms());
            record.setTreatment(request.getTreatment());
            record.setPrescription(request.getPrescription());
            record.setNotes(request.getNotes());
            record.setVitalSigns(request.getVitalSigns());
            record.setTestResults(request.getTestResults());
            record.setAllergies(request.getAllergies());
            record.setIsConfidential(request.getIsConfidential());
            
            if (request.getFollowUpDate() != null) {
                record.setFollowUpDate(request.getFollowUpDate());
            }
            
            MedicalRecord saved = medicalRecordRepository.save(record);
            
            return ResponseEntity.ok(Map.of(
                "message", "Medical record created successfully",
                "recordId", saved.getId(),
                "record", mapRecordToResponse(saved)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to create medical record: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> updateMedicalRecord(@PathVariable Long id, 
                                               @RequestBody MedicalRecordRequest request, 
                                               Authentication auth) {
        try {
            Optional<MedicalRecord> recordOpt = medicalRecordRepository.findById(id);
            if (recordOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            MedicalRecord record = recordOpt.get();
            User user = (User) auth.getPrincipal();
            
            // Check if user has permission to update this record
            if (!record.getDoctor().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
            }
            
            // Update fields
            if (request.getTitle() != null) record.setTitle(request.getTitle());
            if (request.getDiagnosis() != null) record.setDiagnosis(request.getDiagnosis());
            if (request.getSymptoms() != null) record.setSymptoms(request.getSymptoms());
            if (request.getTreatment() != null) record.setTreatment(request.getTreatment());
            if (request.getPrescription() != null) record.setPrescription(request.getPrescription());
            if (request.getNotes() != null) record.setNotes(request.getNotes());
            if (request.getVitalSigns() != null) record.setVitalSigns(request.getVitalSigns());
            if (request.getTestResults() != null) record.setTestResults(request.getTestResults());
            if (request.getAllergies() != null) record.setAllergies(request.getAllergies());
            if (request.getIsConfidential() != null) record.setIsConfidential(request.getIsConfidential());
            if (request.getFollowUpDate() != null) record.setFollowUpDate(request.getFollowUpDate());
            
            MedicalRecord updated = medicalRecordRepository.save(record);
            
            return ResponseEntity.ok(Map.of(
                "message", "Medical record updated successfully",
                "record", mapRecordToResponse(updated)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update medical record: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchRecords(@RequestParam String query, Authentication auth) {
        try {
            User user = (User) auth.getPrincipal();
            List<MedicalRecord> records;
            
            if (user.getRole() == User.Role.PATIENT) {
                records = medicalRecordRepository.searchPatientRecords(user.getId(), query);
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Search not available for this role"));
            }
            
            List<Map<String, Object>> recordList = records.stream().map(this::mapRecordToResponse).toList();
            
            return ResponseEntity.ok(Map.of(
                "records", recordList,
                "count", records.size(),
                "query", query
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to search records: " + e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getRecordStats(Authentication auth) {
        try {
            User user = (User) auth.getPrincipal();
            Map<String, Object> stats = new HashMap<>();
            
            if (user.getRole() == User.Role.PATIENT) {
                stats.put("totalRecords", medicalRecordRepository.countRecordsByPatient(user.getId()));
            } else if (user.getRole() == User.Role.DOCTOR) {
                stats.put("totalRecords", medicalRecordRepository.countRecordsByDoctor(user.getId()));
            }
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch stats: " + e.getMessage()));
        }
    }

    private Map<String, Object> mapRecordToResponse(MedicalRecord record) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", record.getId());
        response.put("title", record.getTitle());
        response.put("type", record.getType());
        response.put("diagnosis", record.getDiagnosis());
        response.put("symptoms", record.getSymptoms());
        response.put("treatment", record.getTreatment());
        response.put("prescription", record.getPrescription());
        response.put("notes", record.getNotes());
        response.put("vitalSigns", record.getVitalSigns());
        response.put("testResults", record.getTestResults());
        response.put("allergies", record.getAllergies());
        response.put("isConfidential", record.getIsConfidential());
        response.put("createdAt", record.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        response.put("updatedAt", record.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        
        if (record.getFollowUpDate() != null) {
            response.put("followUpDate", record.getFollowUpDate().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }
        
        // Patient info
        Map<String, Object> patientInfo = new HashMap<>();
        patientInfo.put("id", record.getPatient().getId());
        patientInfo.put("name", record.getPatient().getFirstName() + " " + record.getPatient().getLastName());
        patientInfo.put("email", record.getPatient().getEmail());
        response.put("patient", patientInfo);
        
        // Doctor info
        Map<String, Object> doctorInfo = new HashMap<>();
        doctorInfo.put("id", record.getDoctor().getId());
        doctorInfo.put("name", record.getDoctor().getFirstName() + " " + record.getDoctor().getLastName());
        doctorInfo.put("email", record.getDoctor().getEmail());
        response.put("doctor", doctorInfo);
        
        return response;
    }

    // Request DTO
    public static class MedicalRecordRequest {
        private Long patientId;
        private String title;
        private String type;
        private String diagnosis;
        private String symptoms;
        private String treatment;
        private String prescription;
        private String notes;
        private String vitalSigns;
        private String testResults;
        private String allergies;
        private Boolean isConfidential;
        private LocalDateTime followUpDate;

        // Getters and setters
        public Long getPatientId() { return patientId; }
        public void setPatientId(Long patientId) { this.patientId = patientId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getDiagnosis() { return diagnosis; }
        public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
        public String getSymptoms() { return symptoms; }
        public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
        public String getTreatment() { return treatment; }
        public void setTreatment(String treatment) { this.treatment = treatment; }
        public String getPrescription() { return prescription; }
        public void setPrescription(String prescription) { this.prescription = prescription; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
        public String getVitalSigns() { return vitalSigns; }
        public void setVitalSigns(String vitalSigns) { this.vitalSigns = vitalSigns; }
        public String getTestResults() { return testResults; }
        public void setTestResults(String testResults) { this.testResults = testResults; }
        public String getAllergies() { return allergies; }
        public void setAllergies(String allergies) { this.allergies = allergies; }
        public Boolean getIsConfidential() { return isConfidential; }
        public void setIsConfidential(Boolean isConfidential) { this.isConfidential = isConfidential; }
        public LocalDateTime getFollowUpDate() { return followUpDate; }
        public void setFollowUpDate(LocalDateTime followUpDate) { this.followUpDate = followUpDate; }
    }
}
