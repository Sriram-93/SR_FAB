package com.srfab.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "ordered_product")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderedProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "oid")
    private int id;

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "price", length = 45)
    private String price;

    @Column(name = "image", length = 100)
    private String image;

    // ── Variant snapshot at order time ──
    @Column(name = "size", length = 20)
    private String size;

    @Column(name = "color", length = 50)
    private String color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orderid")
    @JsonIgnore
    private Order order;
}
