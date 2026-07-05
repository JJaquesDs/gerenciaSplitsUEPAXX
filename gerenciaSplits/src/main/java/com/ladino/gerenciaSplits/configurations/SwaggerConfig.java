package com.ladino.gerenciaSplits.configurations;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    /**
     * Classe de configurações do Swagger
     * **/

    @Bean
    //Método para customizar o Swagger
    public OpenAPI customOpenAPI(){
        return new OpenAPI().info(
                new Info().title("Gerênciamento de Splits UEPA Campus XX")
                        .description("API para Gerênciamento de Splits e suas manutenções na UEPA Campus XX")
                        .version("0.1.0")
        );
    }


}
