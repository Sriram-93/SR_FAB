package com.eazydeals.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "wishlist")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Wishlist {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idwishlist")
    private int id;
    
    // Legacy mapping: iduser, idproduct
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "iduser")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idproduct")
    private Product product;
}
