package com.tomasz.puzzlegame_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        /**
         * Defines the  path to the pieces of image uploaded
         * by the user.
         *
         * This path is used in script.js to load pieces
         * in the frontend.
         */
        registry.addResourceHandler("/uploaded-images/**")
                .addResourceLocations("file:uploads/pieces/");
    }
}
