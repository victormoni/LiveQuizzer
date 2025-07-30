package com.example.quiz.service;

public interface VoteService {
    void publishVote(String questionId, int optionIndex);
}
