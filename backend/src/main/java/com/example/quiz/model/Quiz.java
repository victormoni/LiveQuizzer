package com.example.quiz.model;

import java.util.List;

public record Quiz(String id, String title, List<Question> questions) {}