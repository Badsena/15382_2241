package com.example.demo;

import com.example.demo.User;
import com.example.demo.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "https://3003.vs.amypo.com")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        System.out.println("Entered into register");

        try {
            String username = request.get("username");
            String email = request.get("email");
            String password = request.get("password");
            User user = userService.registerUser(username, email, password);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Registration successful");
            response.put("username", user.getUsername());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        System.out.println("Entered into Login");

        String username = request.get("username");
        String password = request.get("password");
        Optional<User> userOptional = userService.loginUser(username, password);
        if (userOptional.isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("username", userOptional.get().getUsername());
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/forget-password")
    public ResponseEntity<?> forgetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");
        boolean success = userService.resetPassword(email, newPassword);
        if (success) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password reset successful");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email not found");
            return ResponseEntity.badRequest().body(error);
        }
    }
}
