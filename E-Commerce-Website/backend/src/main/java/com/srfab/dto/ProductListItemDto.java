package com.srfab.dto;

import com.srfab.entities.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductListItemDto {
    private int productId;
    private String productName;
    private String productDescription;
    private String productPrice;
    private int productDiscount;
    private int productPriceAfterDiscount;
    private String productImages;
    private String brand;
    private CatalogCategoryDto category;
    private List<String> styleColors;

    public static ProductListItemDto fromEntity(Product product) {
        CatalogCategoryDto categoryDto = null;
        if (product.getCategory() != null) {
            categoryDto = new CatalogCategoryDto(
                    product.getCategory().getCategoryId(),
                    product.getCategory().getCategoryName(),
                    product.getCategory().getCategoryImage()
            );
        }

        List<String> colors = Collections.emptyList();

        return new ProductListItemDto(
                product.getProductId(),
                product.getProductName(),
                product.getProductDescription(),
                product.getProductPrice(),
                product.getProductDiscount(),
                product.getProductPriceAfterDiscount(),
                product.getProductImages(),
                product.getBrand(),
                categoryDto,
                colors
        );
    }
}
