-- Model 3D metadata and generation jobs
CREATE TABLE IF NOT EXISTS model_3d (
    model_id INT PRIMARY KEY AUTO_INCREMENT,
    pid INT NOT NULL UNIQUE,
    model_url VARCHAR(500),
    model_format VARCHAR(30),
    provider VARCHAR(50),
    generation_status VARCHAR(30),
    external_job_id VARCHAR(120),
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    error_message VARCHAR(400),
    CONSTRAINT fk_model3d_product FOREIGN KEY (pid) REFERENCES product(pid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS model_generation_job (
    job_id VARCHAR(80) PRIMARY KEY,
    pid INT NOT NULL,
    provider VARCHAR(50),
    status VARCHAR(30),
    external_job_id VARCHAR(120),
    result_model_url VARCHAR(500),
    error_message VARCHAR(400),
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_model_job_product FOREIGN KEY (pid) REFERENCES product(pid) ON DELETE CASCADE
);
