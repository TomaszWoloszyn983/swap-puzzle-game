package com.tomasz.puzzlegame_backend.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

/**
 * This class prevents error
 * Access to fetch at 'http://localhost:8080/api/game/result'
 *   from origin 'http://localhost:3000'
 *   has been blocked by CORS policy: Response to preflight
 *   request doesn't pass access control check:
 *   No 'Access-Control-Allow-Origin'
 *   header is present on the requested resource.
 *
 * Modern browsers enforce Cross-Origin Resource Sharing for security.
 * Without it, any website could send requests to the API.
 */

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}

