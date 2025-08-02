package com.example.quiz.service.impl;

import com.example.quiz.model.Question;
import com.example.quiz.model.Quiz;
import com.example.quiz.service.QuizService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class QuizServiceImpl implements QuizService {
    @Override
    public List<Quiz> getAll() {
        return List.of(getById("1"), getById("2"));
    }

    @Override
    public Quiz getById(String id) {
        Random rand = new Random();
        var questions = IntStream.range(0, 3)
                .mapToObj(i -> {
                    int correct = rand.nextInt(3);
                    return new Question(
                            UUID.randomUUID().toString(),
                            "Pergunta " + (i+1),
                            List.of("Opção A", "Opção B", "Opção C"),
                            correct
                    );
                })
                .collect(Collectors.toList());
        return new Quiz(id, "Quiz de Exemplo " + id, questions);
    }
}
