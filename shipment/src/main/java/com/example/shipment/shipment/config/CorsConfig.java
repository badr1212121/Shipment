package com.example.shipment.shipment.config;

import org.springframework.web.filter.CorsFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
@Configuration
public class CorsConfig {
    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        // When allowCredentials is true, allowedOrigins cannot be "*" — use explicit origins
        config.setAllowedOriginPatterns(List.of("http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8080"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("*"));
        config.setMaxAge(3600L);
        config.setAllowCredentials(true);
        var source = new UrlBasedCorsConfigurationSource();
        // WebSocket/SockJS: register first so /ws/** gets this config (no credentials conflict)
        CorsConfiguration wsConfig = new CorsConfiguration();
        wsConfig.setAllowedOriginPatterns(List.of("*"));
        wsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        wsConfig.setAllowedHeaders(List.of("*"));
        wsConfig.setAllowCredentials(false);
        source.registerCorsConfiguration("/ws/**", wsConfig);
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

}