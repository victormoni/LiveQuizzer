// src/main/java/com/example/quiz/listener/VoteEventListener.java
package com.example.quiz.listener;

import com.example.quiz.model.VoteEvent;
import com.example.quiz.model.VoteResult;
import com.example.quiz.service.VotePublisher;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class VoteEventListener {
    private final RedisTemplate<String, Integer> redisTemplate;
    private final VotePublisher votePublisher;

    public VoteEventListener(RedisTemplate<String, Integer> redisTemplate,
            VotePublisher votePublisher) {
        this.redisTemplate = redisTemplate;
        this.votePublisher = votePublisher;
    }

    @KafkaListener(topics = "quiz-votes", groupId = "quiz-group")
    public void onVote(VoteEvent event) {
        String key = "quiz:" + event.questionId();
        ListOperations<String, Integer> ops = redisTemplate.opsForList();

        // Incrementa o contador da opção
        Integer current = ops.index(key, event.optionIndex());
        ops.set(key, event.optionIndex(), (current == null ? 0 : current) + 1);

        // Pega o tamanho da lista com fallback para 0
        Long sizeObj = ops.size(key);
        long size = (sizeObj != null) ? sizeObj : 0L;

        // Se não houver elementos, retorna lista vazia
        List<Integer> counts = size > 0
                ? ops.range(key, 0, size - 1)
                : Collections.emptyList();

        var result = new VoteResult(event.questionId(), counts);
        votePublisher.publish(result);
    }
}
