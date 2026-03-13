package com.srfab.repositories;

import com.srfab.entities.OrderedProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderedProductRepository extends JpaRepository<OrderedProduct, Integer> {
    List<OrderedProduct> findByOrder_Id(int orderId);
}
