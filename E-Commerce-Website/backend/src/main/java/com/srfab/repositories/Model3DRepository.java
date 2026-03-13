package com.srfab.repositories;

import com.srfab.entities.Model3D;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface Model3DRepository extends JpaRepository<Model3D, Integer> {
    Optional<Model3D> findByProduct_ProductId(int productId);
}
