package com.gamehub.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.gamehub.backend.model.Score;
import com.gamehub.backend.model.User;
import com.gamehub.backend.repository.ScoreRepository;
import com.gamehub.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/game")
@CrossOrigin
public class GameController {

    @Autowired
    private ScoreRepository scoreRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("ok");
    }

    @PostMapping("/submit")
    public ResponseEntity<Map<String, String>> submit(@RequestBody Map<String, Object> body) {
        Object userIdObj = body.get("userId");
        Object scoreObj = body.get("score");

        if (userIdObj == null || scoreObj == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "userId and score required"));
        }

        Long userId;
        try {
            userId = Long.parseLong(userIdObj.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "invalid userId"));
        }

        int points;
        try {
            points = Integer.parseInt(scoreObj.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "invalid score"));
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "user not found"));
        }

        Score score = new Score();
        score.setUser(user);
        score.setPoints(points);
        scoreRepository.save(score);

        return ResponseEntity.ok(Map.of("message", "Score submitted successfully"));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<Map<String, Object>>> leaderboard() {
        List<Score> scores = scoreRepository.findAll()
                .stream()
                .sorted((a, b) -> Integer.compare(b.getPoints(), a.getPoints()))
                .limit(50)
                .collect(Collectors.toList());

    List<Map<String, Object>> response = scores.stream().map(s -> {
        java.util.Map<String, Object> m = new java.util.HashMap<>();
        m.put("userId", s.getUser().getId());
        m.put("username", s.getUser().getUsername());
        m.put("points", s.getPoints());
        return m;
    }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
