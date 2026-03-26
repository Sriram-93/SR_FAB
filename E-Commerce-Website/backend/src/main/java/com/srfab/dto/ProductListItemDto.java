package com.srfab.dto;

import com.srfab.entities.Product;
import com.srfab.entities.ProductVariant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

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
                    product.getCategory().getCategoryName()
            );
        }

        List<String> colors = product.getVariants().stream()
                .map(ProductVariant::getColor)
                .filter(color -> color != null && !color.isBlank())
                .map(color -> color.toLowerCase(Locale.ROOT))
                .distinct()
                .collect(Collectors.toList());

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
