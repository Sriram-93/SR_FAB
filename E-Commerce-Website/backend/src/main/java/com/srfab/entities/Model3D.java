package com.srfab.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "model_3d")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Model3D {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "model_id")
    private int modelId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pid", nullable = false, unique = true)
    @JsonIgnore
    private Product product;

    @Column(name = "model_url", length = 500)
    private String modelUrl;

    @Column(name = "model_format", length = 30)
    private String modelFormat;

    @Column(name = "provider", length = 50)
    private String provider;

    @Column(name = "generation_status", length = 30)
    private String generationStatus;

    @Column(name = "external_job_id", length = 120)
    private String externalJobId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "error_message", length = 400)
    private String errorMessage;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (generationStatus == null || generationStatus.isBlank()) {
            generationStatus = "not_started";
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
