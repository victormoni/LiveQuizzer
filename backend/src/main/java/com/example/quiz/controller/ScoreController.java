package com.example.quiz.controller;

import com.example.quiz.model.ScoreEntry;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/scores")
public class ScoreController {
    private final List<ScoreEntry> scores = new ArrayList<>();

    @PostMapping
    public void submitScore(@RequestBody ScoreEntry entry) {
        scores.add(entry); // Use um banco real para produção!
    }

    @GetMapping
    public List<ScoreEntry> getTopScores() {
        return scores.stream()
                .sorted(Comparator.comparingInt(ScoreEntry::score).reversed())
                .limit(10)
                .toList();
    }
}
