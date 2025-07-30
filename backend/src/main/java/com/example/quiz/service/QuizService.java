package com.example.quiz.service;

import com.example.quiz.model.Quiz;
import java.util.List;

public interface QuizService {
    List<Quiz> getAll();
    Quiz getById(String id);
}
