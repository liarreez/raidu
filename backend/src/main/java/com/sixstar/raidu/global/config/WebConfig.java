package com.sixstar.raidu.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/{spring:[a-zA-Z0-9-_]+}").setViewName("forward:/index.html");
        registry.addViewController("/**/{spring:[a-zA-Z0-9-_]+}").setViewName("forward:/index.html");
        registry.addViewController("/{spring:[a-zA-Z0-9-_]+}/**").setViewName("forward:/index.html");
        registry.addViewController("/**").setViewName("forward:/index.html");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
            .addResourceLocations("classpath:/static/");
    }
}
