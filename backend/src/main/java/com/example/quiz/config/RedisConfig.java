package com.example.quiz.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericToStringSerializer;

@Configuration
public class RedisConfig {
    @Bean
    public RedisTemplate<String, Integer> redisTemplate(RedisConnectionFactory connectionFactory) {
        var template = new RedisTemplate<String, Integer>();
        template.setConnectionFactory(connectionFactory);
        template.setValueSerializer(new GenericToStringSerializer<>(Integer.class));
        return template;
    }
}