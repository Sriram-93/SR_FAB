                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        package com.srfab.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class HuggingFaceModelGenerationService implements ExternalModelGenerationService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai.3d.provider:hf}")
    private String activeProvider;

    @Value("${ai.hf.api-token:}")
    private String apiToken;

    @Value("${ai.hf.model-id:}")
    private String modelId;

    @Value("${ai.hf.inference-base-url:https://router.huggingface.co/hf-inference/models}")
    private String inferenceBaseUrl;

    private final ConcurrentMap<String, LocalJobState> jobs = new ConcurrentHashMap<>();

    @Override
    public String getProviderName() {
        return "hf";
    }

    @Override
    public SubmitResult submitFromImage(String sourceImageUrl, String prompt) {

        if (!"hf".equalsIgnoreCase(activeProvider)) {
            return new SubmitResult(false, null, "failed", "Unsupported ai.3d.provider; expected 'hf'");
        }
        if (apiToken == null || apiToken.isBlank()) {
            return new SubmitResult(false, null, "failed", "HF_API_TOKEN is not configured");
        }
        if (modelId == null || modelId.isBlank()) {
            return new SubmitResult(false, null, "failed", "HF_3D_MODEL_ID is not configured");
        }
        if (sourceImageUrl == null || sourceImageUrl.isBlank()) {
            return new SubmitResult(false, null, "failed", "sourceImageUrl is required");
        }

        String externalJobId = UUID.randomUUID().toString();

        CompletableFuture<GenerationResult> future = CompletableFuture.supplyAsync(
            () -> runInference(sourceImageUrl, prompt)
        );

        LocalJobState state = new LocalJobState();
        state.status = "processing";
        state.startedAt = LocalDateTime.now();
        state.future = future;
        jobs.put(externalJobId, state);

        return new SubmitResult(true, externalJobId, "processing", null);
    }

    @Override
    public SubmitResult submitFromText(String prompt) {
        return new SubmitResult(false, null, "failed", "Text-to-model not currently supported for Hugging Face provider");
    }

    @Override
    public PollResult poll(String externalJobId) {

        LocalJobState state = jobs.get(externalJobId);
        if (state == null) {
            return new PollResult(true, true, "failed", null, "Generation job not found");
        }

        if (!state.future.isDone()) {
            return new PollResult(false, false, "processing", null, null);
        }

        try {
            GenerationResult result = state.future.join();
            jobs.remove(externalJobId);

            if (!result.ok) {
                return new PollResult(true, true, "failed", null, result.errorMessage);
            }
            return new PollResult(true, false, "completed", result.modelUrl, null);
        } catch (Exception ex) {
            jobs.remove(externalJobId);
            log.error("HF poll failed for job {}", externalJobId, ex);
            return new PollResult(true, true, "failed", null, ex.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private GenerationResult runInference(String sourceImageUrl, String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(apiToken);
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Generic open-source payload; backend endpoint can map/ignore unsupported keys.
            Map<String, Object> body = Map.of(
                "inputs", Map.of(
                    "image_url", sourceImageUrl,
                    "prompt", (prompt == null || prompt.isBlank()) ? "fashion product" : prompt
                ),
                "parameters", Map.of(
                    "output_format", "glb"
                )
            );

            String endpoint = inferenceBaseUrl + "/" + URLEncoder.encode(modelId, StandardCharsets.UTF_8);
            ResponseEntity<Map> response = restTemplate.exchange(
                endpoint,
                HttpMethod.POST,
                new HttpEntity<>(body, headers),
                Map.class
            );

            Map<String, Object> payload = response.getBody();
            if (payload == null) {
                return GenerationResult.failed("Hugging Face returned empty response");
            }

            String modelUrl = extractModelUrl(payload);
            if (modelUrl == null || modelUrl.isBlank()) {
                return GenerationResult.failed("Hugging Face response missing model URL");
            }

            return GenerationResult.ok(modelUrl);
        } catch (Exception ex) {
            log.error("HF submit/inference failed", ex);
            return GenerationResult.failed(ex.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private String extractModelUrl(Map<String, Object> payload) {
        Object modelUrl = payload.get("model_url");
        if (modelUrl != null) {
            return String.valueOf(modelUrl);
        }

        Object output = payload.get("output");
        if (output instanceof Map<?, ?> outputMap) {
            Object glbUrl = outputMap.get("glb_url");
            if (glbUrl != null) {
                return String.valueOf(glbUrl);
            }
            Object genericUrl = outputMap.get("url");
            if (genericUrl != null) {
                return String.valueOf(genericUrl);
            }
        }

        Object artifacts = payload.get("artifacts");
        if (artifacts instanceof Map<?, ?> artifactsMap) {
            Object glb = artifactsMap.get("glb");
            if (glb != null) {
                return String.valueOf(glb);
            }
        }

        Object base64Model = payload.get("model_base64");
        if (base64Model instanceof String base64 && !base64.isBlank()) {
            // Data URI fallback so downstream uploader can still process bytes if desired.
            return "data:model/gltf-binary;base64," + base64;
        }

        return null;
    }

    private static class LocalJobState {
        private String status;
        private LocalDateTime startedAt;
        private CompletableFuture<GenerationResult> future;
    }

    private static class GenerationResult {
        private final boolean ok;
        private final String modelUrl;
        private final String errorMessage;

        private GenerationResult(boolean ok, String modelUrl, String errorMessage) {
            this.ok = ok;
            this.modelUrl = modelUrl;
            this.errorMessage = errorMessage;
        }

        private static GenerationResult ok(String modelUrl) {
            return new GenerationResult(true, modelUrl, null);
        }

        private static GenerationResult failed(String errorMessage) {
            return new GenerationResult(false, null, errorMessage);
        }
    }
}
