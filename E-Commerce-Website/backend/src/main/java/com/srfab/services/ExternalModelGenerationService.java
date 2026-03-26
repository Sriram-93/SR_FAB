package com.srfab.services;

public interface ExternalModelGenerationService {
    
    String getProviderName();

    SubmitResult submitFromImage(String sourceImageUrl, String prompt);

    SubmitResult submitFromText(String prompt);

    PollResult poll(String externalJobId);

    record SubmitResult(boolean ok, String externalJobId, String status, String errorMessage) {}

    record PollResult(boolean done, boolean failed, String status, String modelUrl, String errorMessage) {}
}
