package com.example.quiz.controller;

import com.example.quiz.model.Quiz;
import com.example.quiz.service.QuizService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class QuizController {
    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @QueryMapping
    public List<Quiz> quizzes() {
        return quizService.getAll();
    }

    @QueryMapping
    public Quiz quiz(@Argument String id) {
        return quizService.getById(id);
    }
}