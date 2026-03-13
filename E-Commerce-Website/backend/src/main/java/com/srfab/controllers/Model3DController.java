package com.srfab.controllers;

import com.srfab.services.Model3DService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/models")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class Model3DController {

    private final Model3DService model3DService;

    @PostMapping("/generate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> generate(@RequestBody Map<String, String> payload) {
        try {
            int productId = Integer.parseInt(payload.getOrDefault("productId", "0"));
            String sourceImageUrl = payload.getOrDefault("sourceImageUrl", "");
            String prompt = payload.getOrDefault("prompt", "fashion product");

            return ResponseEntity.ok(model3DService.startGeneration(productId, sourceImageUrl, prompt));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/generate/{jobId}")
    public ResponseEntity<?> getGenerationStatus(@PathVariable String jobId) {
        try {
            return ResponseEntity.ok(model3DService.getJobStatus(jobId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getProductModel(@PathVariable int productId) {
        try {
            return ResponseEntity.ok(model3DService.getProductModel(productId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
