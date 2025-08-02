// src/main/java/com/example/quiz/listener/VoteEventListener.java
package com.example.quiz.listener;

import com.example.quiz.model.VoteEvent;
import com.example.quiz.model.VoteResult;
import com.example.quiz.service.VotePublisher;
import org.springframework.data.redis.core.ReactiveListOperations;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class VoteEventListener {
    private final ReactiveRedisTemplate<String, Integer> redisTemplate;
    private final VotePublisher votePublisher;

    public VoteEventListener(ReactiveRedisTemplate<String, Integer> redisTemplate, VotePublisher votePublisher) {
        this.redisTemplate = redisTemplate;
        this.votePublisher = votePublisher;
    }

    @KafkaListener(topics = "quiz-votes", groupId = "quiz-group")
    public void onVote(VoteEvent event) {
        String key = "quiz:" + event.questionId();
        ReactiveListOperations<String, Integer> ops = redisTemplate.opsForList();

        // 1. Obtém o valor atual, incrementa, salva de volta
        ops.index(key, event.optionIndex())
                .defaultIfEmpty(0)
                .flatMap(current ->
                        ops.set(key, event.optionIndex(), current + 1)
                )
                // 2. Após salvar, lê toda a lista de contagens
                .then(ops.range(key, 0, -1).collectList())
                // 3. Publica o resultado (usando seu publisher)
                .subscribe(counts -> {
                    var result = new VoteResult(event.questionId(), counts);
                    votePublisher.publish(result);
                });
    }
}
