package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserCrudService {

    @Autowired
    private UserCrudRepository userCrudRepository;

    public List<UserCrud> getAllUsers() {
        return userCrudRepository.findAll();
    }

    public Optional<UserCrud> getUserById(Long id) {
        return userCrudRepository.findById(id);
    }

    public UserCrud createUser(UserCrud user) {
        return userCrudRepository.save(user);
    }

    public Optional<UserCrud> updateUser(Long id, UserCrud userDetails) {
        return userCrudRepository.findById(id).map(user -> {
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            user.setRole(userDetails.getRole());
            user.setImage(userDetails.getImage());
            return userCrudRepository.save(user);
        });
    }

    public boolean deleteUser(Long id) {
        return userCrudRepository.findById(id).map(user -> {
            userCrudRepository.delete(user);
            return true;
        }).orElse(false);
    }
}
