package com.tomasz.puzzlegame_backend.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    private final String CLOUD_NAME = System.getenv("CLOUD_NAME");
    private final String CLOUD_API_KEY = System.getenv("CLOUD_API_KEY");
    private final String CLOUD_SECRET_KEY = System.getenv("CLOUD_SECRET_KEY");

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary();
    }
}
