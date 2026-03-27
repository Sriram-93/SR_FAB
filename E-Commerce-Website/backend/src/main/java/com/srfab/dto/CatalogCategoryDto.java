package com.srfab.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CatalogCategoryDto {
    private int categoryId;
    private String categoryName;
    private String categoryImage;
}
