package com.example.quiz.service.impl;

import com.example.quiz.model.VoteResult;
import com.example.quiz.service.VotePublisher;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

@Service
public class VotePublisherImpl implements VotePublisher {
    private final Sinks.Many<VoteResult> sink = Sinks.many().multicast().onBackpressureBuffer();

    @Override
    public void publish(VoteResult voteResult) {
        sink.tryEmitNext(voteResult);
    }

    @Override
    public Flux<VoteResult> getPublisher(String questionId) {
        return sink.asFlux()
                .filter(vr -> vr.questionId().equals(questionId));
    }
}