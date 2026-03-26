package com.srfab.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map /images/** to the actual frontend public folder
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:/home/sriram/SR FAB/E-Commerce-Website/frontend/public/images/");
    }
}
