package com.tomasz.puzzlegame_backend.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig{

    @Bean
    public Cloudinary cloudinary() {
        String CLOUD_NAME = System.getenv("CLOUD_NAME");
        String CLOUD_API_KEY = System.getenv("CLOUD_API_KEY");
        String CLOUD_SECRET_KEY = System.getenv("CLOUD_SECRET_KEY");

        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", CLOUD_NAME,
            "api_key", CLOUD_API_KEY,
            "api_secret", CLOUD_SECRET_KEY,
            "secure", true
        ));
    }
}
