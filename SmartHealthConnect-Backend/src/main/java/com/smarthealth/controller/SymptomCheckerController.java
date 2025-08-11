package com.smarthealth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/symptom-checker")
@CrossOrigin(origins = "http://localhost:3000")
public class SymptomCheckerController {

    @GetMapping("/common-symptoms")
    public ResponseEntity<?> getCommonSymptoms() {
        List<Map<String, Object>> symptoms = Arrays.asList(
            Map.of("id", 1, "name", "Fever", "category", "General"),
            Map.of("id", 2, "name", "Headache", "category", "Neurological"),
            Map.of("id", 3, "name", "Cough", "category", "Respiratory"),
            Map.of("id", 4, "name", "Fatigue", "category", "General"),
            Map.of("id", 5, "name", "Nausea", "category", "Gastrointestinal")
        );
        
        return ResponseEntity.ok(Map.of("symptoms", symptoms));
    }

    @PostMapping("/check")
    public ResponseEntity<?> checkSymptoms(@RequestBody Map<String, Object> request) {
        // Simple symptom checking logic
        List<String> symptoms = (List<String>) request.get("symptoms");
        
        Map<String, Object> response = new HashMap<>();
        response.put("recommendation", "Please consult with a healthcare professional");
        response.put("urgency", "Medium");
        response.put("possibleConditions", Arrays.asList("Common Cold", "Flu", "Stress"));
        
        return ResponseEntity.ok(response);
    }
}
