package com.example.quiz.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.serializer.GenericToStringSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {
    @Bean
    public ReactiveRedisTemplate<String, Integer> reactiveRedisTemplate(ReactiveRedisConnectionFactory factory) {
        // Serializer para a chave (String)
        var keySerializer = new StringRedisSerializer();
        // Serializer para o valor (Integer)
        var valueSerializer = new GenericToStringSerializer<>(Integer.class);

        // Cria contexto para String (key) e Integer (value)
        var context = RedisSerializationContext
                .<String, Integer>newSerializationContext(keySerializer)
                .value(valueSerializer)
                .build();

        return new ReactiveRedisTemplate<>(factory, context);
    }
}