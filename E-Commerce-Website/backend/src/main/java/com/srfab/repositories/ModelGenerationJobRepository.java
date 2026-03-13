package com.srfab.repositories;

import com.srfab.entities.ModelGenerationJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ModelGenerationJobRepository extends JpaRepository<ModelGenerationJob, String> {
    List<ModelGenerationJob> findByStatusIn(List<String> statuses);
}
