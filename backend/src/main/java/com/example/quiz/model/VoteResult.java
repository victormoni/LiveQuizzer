package com.example.quiz.model;

import java.util.List;

public record VoteResult(String questionId, List<Integer> counts) {}