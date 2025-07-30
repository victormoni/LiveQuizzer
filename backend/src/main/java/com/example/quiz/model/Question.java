package com.example.quiz.model;

import java.util.List;

public record Question(String id, String text, List<String> options) {}