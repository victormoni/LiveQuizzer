package com.example.quiz.service;

import com.example.quiz.model.VoteResult;
import reactor.core.publisher.Flux;

public interface VotePublisher {
    void publish(VoteResult voteResult);
    Flux<VoteResult> getPublisher(String questionId);
}