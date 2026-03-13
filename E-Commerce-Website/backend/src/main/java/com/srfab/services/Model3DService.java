package com.srfab.services;

import com.srfab.entities.Model3D;
import com.srfab.entities.ModelGenerationJob;
import com.srfab.entities.Product;
import com.srfab.repositories.Model3DRepository;
import com.srfab.repositories.ModelGenerationJobRepository;
import com.srfab.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class Model3DService {

    private final ProductRepository productRepository;
    private final Model3DRepository model3DRepository;
    private final ModelGenerationJobRepository jobRepository;
    private final ExternalModelGenerationService externalModelGenerationService;
    private final CloudinaryService cloudinaryService;

    @Value("${ai.3d.provider:hf}")
    private String providerName;

    @Value("${ai.model.cloudinary-folder:products/3d-models}")
    private String modelFolder;

    public Map<String, Object> startGeneration(int productId, String sourceImageUrl, String prompt) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        if (sourceImageUrl == null || sourceImageUrl.isBlank()) {
            throw new RuntimeException("sourceImageUrl is required for generation");
        }

        Model3D model3D = model3DRepository.findByProduct_ProductId(productId)
            .orElseGet(() -> {
                Model3D model = new Model3D();
                model.setProduct(product);
                model.setProvider(providerName);
                model.setGenerationStatus("queued");
                return model;
            });

        model3D.setGenerationStatus("queued");
        model3D.setErrorMessage(null);
        model3D.setProvider(providerName);
        model3D = model3DRepository.save(model3D);

        String jobId = UUID.randomUUID().toString();
        ModelGenerationJob job = new ModelGenerationJob();
        job.setJobId(jobId);
        job.setProduct(product);
        job.setProvider(providerName);
        job.setStatus("queued");

        ExternalModelGenerationService.SubmitResult submit = externalModelGenerationService
            .submitFromImage(sourceImageUrl, prompt);

        if (!submit.ok()) {
            job.setStatus("failed");
            job.setErrorMessage(submit.errorMessage());
            model3D.setGenerationStatus("failed");
            model3D.setErrorMessage(submit.errorMessage());
            model3DRepository.save(model3D);
            jobRepository.save(job);
            return Map.of(
                "jobId", jobId,
                "status", "failed",
                "error", submit.errorMessage()
            );
        }

        job.setExternalJobId(submit.externalJobId());
        job.setStatus("processing");
        jobRepository.save(job);

        model3D.setGenerationStatus("processing");
        model3D.setExternalJobId(submit.externalJobId());
        model3DRepository.save(model3D);

        return Map.of(
            "jobId", jobId,
            "status", "processing"
        );
    }

    public Map<String, Object> getJobStatus(String jobId) {
        ModelGenerationJob job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Generation job not found"));

        if ("processing".equalsIgnoreCase(job.getStatus()) && job.getExternalJobId() != null) {
            ExternalModelGenerationService.PollResult poll = externalModelGenerationService.poll(job.getExternalJobId());
            syncJobState(job, poll);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("jobId", job.getJobId());
        response.put("status", job.getStatus());
        response.put("modelUrl", job.getResultModelUrl());
        response.put("error", Optional.ofNullable(job.getErrorMessage()).orElse(""));
        return response;
    }

    public Map<String, Object> getProductModel(int productId) {
        Model3D model3D = model3DRepository.findByProduct_ProductId(productId)
            .orElseThrow(() -> new RuntimeException("Model metadata not found for product"));

        return Map.of(
            "productId", productId,
            "status", safe(model3D.getGenerationStatus()),
            "modelUrl", safe(model3D.getModelUrl()),
            "modelFormat", safe(model3D.getModelFormat()),
            "provider", safe(model3D.getProvider()),
            "error", safe(model3D.getErrorMessage())
        );
    }

    private void syncJobState(ModelGenerationJob job, ExternalModelGenerationService.PollResult poll) {
        if (poll == null) {
            return;
        }

        Product product = job.getProduct();
        Model3D model3D = model3DRepository.findByProduct_ProductId(product.getProductId())
            .orElseGet(() -> {
                Model3D model = new Model3D();
                model.setProduct(product);
                model.setProvider(providerName);
                return model;
            });

        if (poll.done() && poll.failed()) {
            job.setStatus("failed");
            job.setErrorMessage(poll.errorMessage());
            model3D.setGenerationStatus("failed");
            model3D.setErrorMessage(poll.errorMessage());
        } else if (poll.done()) {
            String persistedModelUrl;
            try {
                persistedModelUrl = cloudinaryService.uploadGeneratedModel(poll.modelUrl(), modelFolder);
            } catch (Exception uploadError) {
                job.setStatus("failed");
                job.setErrorMessage("Model generated but Cloudinary upload failed: " + uploadError.getMessage());
                model3D.setGenerationStatus("failed");
                model3D.setErrorMessage(job.getErrorMessage());

                job.setUpdatedAt(LocalDateTime.now());
                model3D.setUpdatedAt(LocalDateTime.now());
                model3D.setExternalJobId(job.getExternalJobId());
                model3D.setProvider(job.getProvider());

                jobRepository.save(job);
                model3DRepository.save(model3D);
                return;
            }

            job.setStatus("completed");
            job.setResultModelUrl(persistedModelUrl);
            job.setErrorMessage(null);

            model3D.setGenerationStatus("ready");
            model3D.setModelUrl(persistedModelUrl);
            model3D.setModelFormat(detectFormat(persistedModelUrl));
            model3D.setErrorMessage(null);
        } else {
            job.setStatus("processing");
            if (poll.errorMessage() != null && !poll.errorMessage().isBlank()) {
                job.setErrorMessage(poll.errorMessage());
            }
            model3D.setGenerationStatus("processing");
        }

        job.setUpdatedAt(LocalDateTime.now());
        model3D.setUpdatedAt(LocalDateTime.now());
        model3D.setExternalJobId(job.getExternalJobId());
        model3D.setProvider(job.getProvider());

        jobRepository.save(job);
        model3DRepository.save(model3D);
    }

    private String detectFormat(String modelUrl) {
        if (modelUrl == null) return "";
        String lower = modelUrl.toLowerCase();
        if (lower.contains(".glb")) return "glb";
        if (lower.contains(".gltf")) return "gltf";
        if (lower.contains(".usdz")) return "usdz";
        return "unknown";
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
