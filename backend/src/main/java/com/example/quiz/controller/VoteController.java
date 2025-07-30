package com.example.quiz.controller;

import com.example.quiz.model.VoteResult;
import com.example.quiz.service.VotePublisher;
import com.example.quiz.service.VoteService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.SubscriptionMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;

@Controller
public class VoteController {
    private final VoteService voteService;
    private final VotePublisher votePublisher;

    public VoteController(VoteService voteService, VotePublisher votePublisher) {
        this.voteService = voteService;
        this.votePublisher = votePublisher;
    }

    @MutationMapping
    public boolean vote(@Argument String questionId, @Argument int optionIndex) {
        voteService.publishVote(questionId, optionIndex);
        return true;
    }

    @SubscriptionMapping
    public Flux<VoteResult> voteResults(@Argument String questionId) {
        return votePublisher.getPublisher(questionId);
    }
}