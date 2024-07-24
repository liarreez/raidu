package com.sixstar.raidu.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
  private String JWT = "JWT";

  @Bean
  public OpenAPI openAPI() {
    Info info = new Info().title("RAIDU API");
    Components components = new Components().addSecuritySchemes(JWT, new SecurityScheme()
        .name(JWT)
        .type(SecurityScheme.Type.HTTP)
        .scheme("Bearer")
        .bearerFormat(JWT)
    );

    return new OpenAPI().info(info).components(components);
  }
}
