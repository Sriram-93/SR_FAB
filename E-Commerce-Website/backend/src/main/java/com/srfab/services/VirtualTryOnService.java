package com.srfab.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
@Slf4j
public class VirtualTryOnService {

    private final RestTemplate restTemplate;
    private final CloudinaryService cloudinaryService;

    @Value("${ai.vto.rapidapi-key:}")
    private String rapidApiKey;

    @Value("${ai.vto.rapidapi-host:try-on-diffusion.p.rapidapi.com}")
    private String rapidApiHost;

    private static final String TRY_ON_URL = "https://try-on-diffusion.p.rapidapi.com/try-on-file";

    private final ConcurrentMap<String, VtoJob> jobs = new ConcurrentHashMap<>();

    public VirtualTryOnService(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;

        // Configure RestTemplate with longer timeouts for AI inference
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(30000);   // 30s connect
        factory.setReadTimeout(300000);     // 5 min read (AI inference can be slow)
        this.restTemplate = new RestTemplate(factory);
    }

    // ─── Public API ────────────────────────────────────────────────────

    /**
     * Start a VTO generation job.
     * Accepts base64 data-URIs or public URLs for both images.
     */
    public Map<String, Object> startTryOn(String personImage, String garmentImage, String garmentDescription) {
        if (rapidApiKey == null || rapidApiKey.isBlank()) {
            throw new RuntimeException("RAPIDAPI_KEY is not configured. Please add it to your .env file.");
        }

        String jobId = UUID.randomUUID().toString();
        VtoJob job = new VtoJob();
        job.status = "uploading";
        job.statusMessage = "Uploading images to cloud...";
        jobs.put(jobId, job);

        CompletableFuture.runAsync(() -> runPipeline(jobId, job, personImage, garmentImage, garmentDescription));

        return Map.of("jobId", jobId, "status", job.status);
    }

    /**
     * Get the current status of a VTO job.
     */
    public Map<String, Object> getStatus(String jobId) {
        VtoJob job = jobs.get(jobId);
        if (job == null) {
            return Map.of("status", "not_found", "error", "Job not found");
        }

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("jobId", jobId);
        res.put("status", job.status);
        res.put("statusMessage", job.statusMessage != null ? job.statusMessage : "");
        res.put("resultUrl", job.resultUrl != null ? job.resultUrl : "");
        res.put("error", job.errorMessage != null ? job.errorMessage : "");
        return res;
    }

    // ─── Pipeline ──────────────────────────────────────────────────────

    private void runPipeline(String jobId, VtoJob job, String personImage, String garmentImage, String description) {
        try {
            // Step 1: Prepare image bytes
            updateJob(job, "uploading", "Preparing person image...");
            byte[] personBytes = downloadImageBytes(personImage);

            updateJob(job, "uploading", "Preparing garment image...");
            byte[] garmentBytes = downloadImageBytes(garmentImage);

            // Step 2: Call RapidAPI Try-On Diffusion
            updateJob(job, "generating", "AI is synthesizing your outfit...");
            String resultUrl = callTryOnApi(personBytes, garmentBytes, description, job);

            // Step 3: Done — result is already on Cloudinary
            updateJob(job, "completed", "Generation complete!");
            job.resultUrl = resultUrl;

            log.info("VTO job {} completed successfully: {}", jobId, resultUrl);

        } catch (Exception e) {
            log.error("VTO pipeline failed for job {}", jobId, e);
            job.status = "failed";
            job.statusMessage = "Generation failed";
            String msg = e.getMessage();
            if (msg != null && msg.contains("429")) {
                job.errorMessage = "Rate limit reached. Please wait and try again.";
            } else if (msg != null && msg.contains("403")) {
                job.errorMessage = "API key is invalid or expired. Please check your RAPIDAPI_KEY.";
            } else if (msg != null && msg.contains("402")) {
                job.errorMessage = "API subscription limit reached. Please check your RapidAPI plan.";
            } else {
                job.errorMessage = msg;
            }
        }
    }

    // ─── Helpers ───────────────────────────────────────────────────────

    /**
     * Get raw byte array from Data URI or URL.
     * The RapidAPI endpoint requires actual multipart file uploads.
     */
    private byte[] downloadImageBytes(String imageInput) {
        if (imageInput.startsWith("data:")) {
            int commaIndex = imageInput.indexOf(",");
            String base64 = commaIndex > -1 ? imageInput.substring(commaIndex + 1) : imageInput;
            return java.util.Base64.getDecoder().decode(base64);
        }
        if (imageInput.startsWith("http://") || imageInput.startsWith("https://")) {
            try {
                byte[] imageBytes = restTemplate.getForObject(imageInput, byte[].class);
                if (imageBytes == null || imageBytes.length == 0) {
                    throw new RuntimeException("Failed to download image from URL");
                }
                return imageBytes;
            } catch (Exception e) {
                throw new RuntimeException("Failed to process image from URL: " + e.getMessage(), e);
            }
        }
        throw new RuntimeException("Invalid image input: must be a data URI or HTTP URL. Got: " + imageInput.substring(0, Math.min(50, imageInput.length())));
    }
    
    // Required to send byte arrays as files in Spring's RestTemplate
    private static class NamedByteArrayResource extends org.springframework.core.io.ByteArrayResource {
        private final String filename;
        public NamedByteArrayResource(byte[] byteArray, String filename) {
            super(byteArray);
            this.filename = filename;
        }
        @Override
        public String getFilename() {
            return filename;
        }
    }

    private String callTryOnApi(byte[] personBytes, byte[] garmentBytes, String description, VtoJob job) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.set("x-rapidapi-host", rapidApiHost);
        headers.set("x-rapidapi-key", rapidApiKey);

        org.springframework.util.MultiValueMap<String, Object> body = new org.springframework.util.LinkedMultiValueMap<>();
        body.add("clothing_image", new NamedByteArrayResource(garmentBytes, "clothing.jpg"));
        body.add("clothing_prompt", (description == null || description.isBlank()) ? "fashion garment" : description);
        body.add("avatar_image", new NamedByteArrayResource(personBytes, "avatar.jpg"));
        body.add("avatar_sex", "");
        body.add("avatar_prompt", "");
        body.add("background_prompt", "");
        body.add("seed", "");

        log.info("Submitting VTO (multipart/form-data) to RapidAPI Try-On Diffusion...");
        log.info("  Person bytes: {}", personBytes.length);
        log.info("  Garment bytes: {}", garmentBytes.length);

        try {
            ResponseEntity<byte[]> response = restTemplate.exchange(
                TRY_ON_URL,
                HttpMethod.POST,
                new HttpEntity<>(body, headers),
                byte[].class
            );

            byte[] imageBytes = response.getBody();
            if (imageBytes == null || imageBytes.length == 0) {
                throw new RuntimeException("Try-On API returned empty response");
            }

            log.info("Try-On API returned {} bytes (status: {})", imageBytes.length, response.getStatusCode());

            // Check if it's an error response (JSON) instead of image
            String contentType = response.getHeaders().getFirst(HttpHeaders.CONTENT_TYPE);
            if (contentType != null && contentType.contains("application/json")) {
                String errorJson = new String(imageBytes);
                log.error("Try-On API returned error JSON: {}", errorJson);
                throw new RuntimeException("Try-On API error: " + errorJson);
            }

            // Upload the generated image bytes to Cloudinary
            updateJob(job, "finalizing", "Saving your result...");
            String mimeType = (contentType != null && contentType.startsWith("image/")) ? contentType.split(";")[0].trim() : "image/jpeg";
            String base64 = "data:" + mimeType + ";base64," + java.util.Base64.getEncoder().encodeToString(imageBytes);
            String persistedUrl = cloudinaryService.uploadGeneratedImage(base64, "vto/results");

            log.info("VTO result uploaded to Cloudinary: {}", persistedUrl);
            return persistedUrl;

        } catch (org.springframework.web.client.HttpClientErrorException e) {
            log.error("Try-On API client error: {} {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Try-On API error (" + e.getStatusCode() + "): " + e.getResponseBodyAsString());
        } catch (org.springframework.web.client.HttpServerErrorException e) {
            log.error("Try-On API server error: {} {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Try-On API server error (" + e.getStatusCode() + "): " + e.getResponseBodyAsString());
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("VTO inference failed: " + e.getMessage(), e);
        }
    }

    private void updateJob(VtoJob job, String status, String message) {
        job.status = status;
        job.statusMessage = message;
    }

    // ─── Job State ─────────────────────────────────────────────────────

    private static class VtoJob {
        volatile String status;
        volatile String statusMessage;
        volatile String resultUrl;
        volatile String errorMessage;
    }
}
