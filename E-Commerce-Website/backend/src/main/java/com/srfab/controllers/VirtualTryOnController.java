package com.srfab.controllers;

import com.srfab.services.VirtualTryOnService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/vto")
@RequiredArgsConstructor
@Slf4j
public class VirtualTryOnController {

    private final VirtualTryOnService virtualTryOnService;

    /**
     * Start a VTO generation.
     * Accepts JSON body with:
     *   personImageUrl   - base64 data URI or public URL
     *   garmentImageUrl  - base64 data URI or public URL
     *   garmentDescription - text description of the garment
     */
    @PostMapping("/generate")
    public ResponseEntity<?> generate(@RequestBody Map<String, String> payload) {
        try {
            String personImage = payload.getOrDefault("personImageUrl", "");
            String garmentImage = payload.getOrDefault("garmentImageUrl", "");
            String garmentDescription = payload.getOrDefault("garmentDescription", "fashion garment");

            // Validation
            if (personImage.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Person image is required"));
            }
            if (garmentImage.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Garment image is required"));
            }

            // Check if base64 payload is not too large (50MB limit)
            long totalSize = personImage.length() + garmentImage.length();
            if (totalSize > 50_000_000) {
                return ResponseEntity.badRequest().body(Map.of("error", "Combined image size too large. Please use smaller images."));
            }

            Map<String, Object> result = virtualTryOnService.startTryOn(personImage, garmentImage, garmentDescription);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("VTO generate endpoint error", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get the status of a VTO generation job.
     */
    @GetMapping("/status/{jobId}")
    public ResponseEntity<?> getStatus(@PathVariable String jobId) {
        try {
            Map<String, Object> status = virtualTryOnService.getStatus(jobId);
            if ("not_found".equals(status.get("status"))) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            log.error("VTO status endpoint error", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
