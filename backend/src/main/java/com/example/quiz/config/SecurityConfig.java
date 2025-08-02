package com.example.quiz.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
                // habilita CORS (sua WebConfig de WebFlux já registrou os mappings)
                .cors(Customizer.withDefaults())
                // desativa CSRF (sem cookies de sessão/stateful)
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                // quem pode acessar o quê
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers("/graphql", "/graphql/**", "/api/**").permitAll()
                        .anyExchange().authenticated()
                )
                // habilita OAuth2 Login (Google)
                .oauth2Login(Customizer.withDefaults());

        return http.build();
    }
}
