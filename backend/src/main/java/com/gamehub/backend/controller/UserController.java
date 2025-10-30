package com.gamehub.backend.controller;

import com.gamehub.backend.model.User;
import com.gamehub.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getUser(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(u -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", u.getId());
                    m.put("username", u.getUsername());
                    m.put("createdAt", u.getCreatedAt());
                    return ResponseEntity.ok(m);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}/password")
    public ResponseEntity<Map<String, String>> changePassword(@PathVariable Long userId,
                                                              @RequestBody Map<String, String> body) {
        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");

        if (oldPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "oldPassword and newPassword required"));
        }

        return userRepository.findById(userId).map(u -> {
            if (!passwordEncoder.matches(oldPassword, u.getPassword())) {
                return ResponseEntity.status(401).body(Map.of("message", "Old password does not match"));
            }
            u.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(u);
            return ResponseEntity.ok(Map.of("message", "Password updated"));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
