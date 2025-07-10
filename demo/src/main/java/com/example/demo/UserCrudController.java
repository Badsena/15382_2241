package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/usercrud")
public class UserCrudController {

    @Autowired
    private UserCrudService userCrudService;

    @GetMapping("")
    public List<UserCrud> getAllUsers() {
        return userCrudService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserCrud> getUserById(@PathVariable Long id) {
        Optional<UserCrud> user = userCrudService.getUserById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("")
    public UserCrud createUser(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("role") String role,
            @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {
        System.out.println("Received createUser request with name: " + name + ", email: " + email + ", role: " + role);
        if (imageFile != null) {
            System.out.println("Received image file: " + imageFile.getOriginalFilename() + ", size: " + imageFile.getSize());
        } else {
            System.out.println("No image file received");
        }
        String imagePath = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;
            File uploadPath = new File(uploadDir);
            if (!uploadPath.exists()) {
                uploadPath.mkdirs();
            }
            File dest = new File(uploadDir + fileName);
            imageFile.transferTo(dest);
            imagePath = dest.getAbsolutePath();
        }
        UserCrud user = new UserCrud(name, email, role, imagePath);
        return userCrudService.createUser(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserCrud> updateUser(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("role") String role,
            @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {
        String imagePath = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;
            File uploadPath = new File(uploadDir);
            if (!uploadPath.exists()) {
                uploadPath.mkdirs();
            }
            File dest = new File(uploadDir + fileName);
            imageFile.transferTo(dest);
            imagePath = dest.getAbsolutePath();
        }
        UserCrud userDetails = new UserCrud(name, email, role, imagePath);
        Optional<UserCrud> updatedUser = userCrudService.updateUser(id, userDetails);
        return updatedUser.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        boolean deleted = userCrudService.deleteUser(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
