package com.smarthealth.controller;

import com.smarthealth.entity.User;
import com.smarthealth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication auth) {
        try {
            User user = (User) auth.getPrincipal();
            return ResponseEntity.ok(mapUserToResponse(user));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch profile: " + e.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody UserUpdateRequest request, Authentication auth) {
        try {
            User user = (User) auth.getPrincipal();
            
            // Update allowed fields
            if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
            if (request.getLastName() != null) user.setLastName(request.getLastName());
            if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
            
            User updated = userRepository.save(user);
            
            return ResponseEntity.ok(Map.of(
                "message", "Profile updated successfully",
                "user", mapUserToResponse(updated)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update profile: " + e.getMessage()));
        }
    }

    @GetMapping("/doctors")
    public ResponseEntity<?> getAllDoctors() {
        try {
            List<User> doctors = userRepository.findActiveUsersByRole(User.Role.DOCTOR);
            
            List<Map<String, Object>> doctorList = doctors.stream()
                .map(this::mapUserToPublicResponse)
                .toList();
            
            return ResponseEntity.ok(Map.of(
                "doctors", doctorList,
                "count", doctors.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch doctors: " + e.getMessage()));
        }
    }

    @GetMapping("/patients")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getAllPatients() {
        try {
            List<User> patients = userRepository.findActiveUsersByRole(User.Role.PATIENT);
            
            List<Map<String, Object>> patientList = patients.stream()
                .map(this::mapUserToPublicResponse)
                .toList();
            
            return ResponseEntity.ok(Map.of(
                "patients", patientList,
                "count", patients.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch patients: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String query, @RequestParam(required = false) String role) {
        try {
            List<User> users;
            
            if (role != null && !role.isEmpty()) {
                User.Role userRole = User.Role.valueOf(role.toUpperCase());
                users = userRepository.findActiveUsersByRole(userRole);
                users = users.stream()
                    .filter(user -> 
                        user.getFirstName().toLowerCase().contains(query.toLowerCase()) ||
                        user.getLastName().toLowerCase().contains(query.toLowerCase()) ||
                        user.getUsername().toLowerCase().contains(query.toLowerCase()) ||
                        user.getEmail().toLowerCase().contains(query.toLowerCase())
                    )
                    .toList();
            } else {
                users = userRepository.searchActiveUsers(query);
            }
            
            List<Map<String, Object>> userList = users.stream()
                .map(this::mapUserToPublicResponse)
                .toList();
            
            return ResponseEntity.ok(Map.of(
                "users", userList,
                "count", users.size(),
                "query", query
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to search users: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            User user = userOpt.get();
            return ResponseEntity.ok(mapUserToPublicResponse(user));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch user: " + e.getMessage()));
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", userRepository.count());
            stats.put("totalPatients", userRepository.countActiveUsersByRole(User.Role.PATIENT));
            stats.put("totalDoctors", userRepository.countActiveUsersByRole(User.Role.DOCTOR));
            stats.put("totalAdmins", userRepository.countActiveUsersByRole(User.Role.ADMIN));
            stats.put("activeUsers", userRepository.findByIsActiveTrue().size());
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch user stats: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> request) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            User user = userOpt.get();
            Boolean isActive = request.get("isActive");
            Boolean enabled = request.get("enabled");
            
            if (isActive != null) user.setIsActive(isActive);
            if (enabled != null) user.setEnabled(enabled);
            
            User updated = userRepository.save(user);
            
            return ResponseEntity.ok(Map.of(
                "message", "User status updated successfully",
                "user", mapUserToResponse(updated)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update user status: " + e.getMessage()));
        }
    }

    private Map<String, Object> mapUserToResponse(User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("phoneNumber", user.getPhoneNumber());
        response.put("role", user.getRole());
        response.put("isActive", user.getIsActive());
        response.put("enabled", user.getEnabled());
        response.put("emailVerified", user.getEmailVerified());
        response.put("createdAt", user.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        response.put("updatedAt", user.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        return response;
    }

    private Map<String, Object> mapUserToPublicResponse(User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("role", user.getRole());
        response.put("isActive", user.getIsActive());
        
        // Only include email for doctors (for contact purposes)
        if (user.getRole() == User.Role.DOCTOR) {
            response.put("email", user.getEmail());
        }
        
        return response;
    }

    // Request DTO
    public static class UserUpdateRequest {
        private String firstName;
        private String lastName;
        private String phoneNumber;

        // Getters and setters
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    }
}
