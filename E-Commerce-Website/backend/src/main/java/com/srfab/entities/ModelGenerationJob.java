package com.srfab.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "model_generation_job")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModelGenerationJob {

    @Id
    @Column(name = "job_id", length = 80)
    private String jobId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pid", nullable = false)
    @JsonIgnore
    private Product product;

    @Column(name = "provider", length = 50)
    private String provider;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "external_job_id", length = 120)
    private String externalJobId;

    @Column(name = "result_model_url", length = 500)
    private String resultModelUrl;

    @Column(name = "error_message", length = 400)
    private String errorMessage;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (status == null || status.isBlank()) {
            status = "queued";
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
