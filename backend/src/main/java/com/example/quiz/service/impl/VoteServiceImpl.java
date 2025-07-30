package com.example.quiz.service.impl;

import com.example.quiz.model.VoteEvent;
import com.example.quiz.service.VoteService;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class VoteServiceImpl implements VoteService {
    private final KafkaTemplate<String, VoteEvent> kafka;

    public VoteServiceImpl(KafkaTemplate<String, VoteEvent> kafka) {
        this.kafka = kafka;
    }

    @Override
    public void publishVote(String questionId, int optionIndex) {
        kafka.send("quiz-votes", new VoteEvent(questionId, optionIndex));
    }
}
