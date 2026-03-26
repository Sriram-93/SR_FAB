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

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripoModelGenerationService implements ExternalModelGenerationService {

    private final RestTemplate restTemplate;

    public TripoModelGenerationService() {
        org.springframework.http.client.SimpleClientHttpRequestFactory factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(30000);
        factory.setReadTimeout(30000);
        this.restTemplate = new RestTemplate(factory);
    }

    @Value("${ai.tripo.api-key:}")
    private String apiKey;

    private static final String API_BASE_URL = "https://api.tripo3d.ai/v2/openapi/task";

    @Override
    public String getProviderName() {
        return "tripo";
    }

    @Override
    @SuppressWarnings("unchecked")
    public SubmitResult submitFromImage(String sourceImageUrl, String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            return new SubmitResult(false, null, "failed", "TRIPO_API_KEY is not configured");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(apiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            String fileType = "jpg";
            if (sourceImageUrl != null) {
                String lower = sourceImageUrl.toLowerCase();
                if (lower.contains(".png")) fileType = "png";
                else if (lower.contains(".webp")) fileType = "webp";
                else if (lower.contains(".jpeg")) fileType = "jpg";
            }

            Map<String, Object> file = Map.of(
                "type", fileType,
                "url", sourceImageUrl
            );

            Map<String, Object> body = Map.of(
                "type", "image_to_model",
                "file", file
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                API_BASE_URL,
                HttpMethod.POST,
                entity,
                Map.class
            );

            Map<String, Object> respBody = response.getBody();
            if (respBody == null || !Integer.valueOf(0).equals(respBody.get("code"))) {
                String msg = respBody != null ? (String) respBody.get("msg") : "Unknown error";
                return new SubmitResult(false, null, "failed", "Tripo API error: " + msg);
            }

            Map<String, Object> data = (Map<String, Object>) respBody.get("data");
            String taskId = (String) data.get("task_id");

            return new SubmitResult(true, taskId, "processing", null);
        } catch (Exception e) {
            log.error("Tripo submit failed", e);
            return new SubmitResult(false, null, "failed", e.getMessage());
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public SubmitResult submitFromText(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            return new SubmitResult(false, null, "failed", "TRIPO_API_KEY is not configured");
        }
        if (prompt == null || prompt.isBlank()) {
            return new SubmitResult(false, null, "failed", "Prompt is required for text-to-model");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(apiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = Map.of(
                "type", "text_to_model",
                "prompt", prompt
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                API_BASE_URL,
                HttpMethod.POST,
                entity,
                Map.class
            );

            Map<String, Object> respBody = response.getBody();
            if (respBody == null || !Integer.valueOf(0).equals(respBody.get("code"))) {
                String msg = respBody != null ? (String) respBody.get("msg") : "Unknown error";
                return new SubmitResult(false, null, "failed", "Tripo API error: " + msg);
            }

            Map<String, Object> data = (Map<String, Object>) respBody.get("data");
            String taskId = (String) data.get("task_id");

            return new SubmitResult(true, taskId, "processing", null);
        } catch (Exception e) {
            log.error("Tripo submitFromText failed", e);
            return new SubmitResult(false, null, "failed", e.getMessage());
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public PollResult poll(String externalJobId) {

        if (apiKey == null || apiKey.isBlank()) {
            return new PollResult(true, true, "failed", null, "TRIPO_API_KEY is not configured");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(apiKey);

            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                API_BASE_URL + "/" + externalJobId,
                HttpMethod.GET,
                entity,
                Map.class
            );

            Map<String, Object> respBody = response.getBody();
            if (respBody == null || !Integer.valueOf(0).equals(respBody.get("code"))) {
                String msg = respBody != null ? (String) respBody.get("msg") : "Unknown error";
                return new PollResult(true, true, "failed", null, "Tripo API error: " + msg);
            }

            Map<String, Object> data = (Map<String, Object>) respBody.get("data");
            String status = (String) data.get("status");

            if ("success".equalsIgnoreCase(status)) {
                String modelUrl = null;
                @SuppressWarnings("unchecked")
                Map<String, Object> output = (Map<String, Object>) data.get("output");
                if (output != null) {
                    if (output.containsKey("model")) modelUrl = (String) output.get("model");
                    else if (output.containsKey("pbr_model")) modelUrl = (String) output.get("pbr_model");
                }
                
                if (modelUrl == null) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> resultMap = (Map<String, Object>) data.get("result");
                    if (resultMap != null) {
                        Object modelObj = resultMap.containsKey("model") ? resultMap.get("model") : resultMap.get("pbr_model");
                        if (modelObj instanceof Map) {
                            @SuppressWarnings("unchecked")
                            Map<String, Object> modelData = (Map<String, Object>) modelObj;
                            modelUrl = (String) modelData.get("url");
                        } else if (modelObj != null) {
                            modelUrl = modelObj.toString();
                        }
                    }
                }
                
                if (modelUrl == null || modelUrl.isBlank()) {
                    return new PollResult(true, true, "failed", null, "Model URL not found in Tripo response");
                }
                return new PollResult(true, false, "completed", modelUrl, null);
            } else if ("failed".equalsIgnoreCase(status)) {

                return new PollResult(true, true, "failed", null, "Tripo task failed");
            } else if ("cancelled".equalsIgnoreCase(status) || "expired".equalsIgnoreCase(status)) {
                return new PollResult(true, true, "failed", null, "Tripo task " + status);
            } else {
                return new PollResult(false, false, "processing", null, null);
            }
        } catch (Exception e) {
            log.error("Tripo poll failed", e);
            return new PollResult(true, true, "failed", null, e.getMessage());
        }
    }
}
