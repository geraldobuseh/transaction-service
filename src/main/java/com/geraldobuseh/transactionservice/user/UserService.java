package com.geraldobuseh.transactionservice.user;

import com.geraldobuseh.transactionservice.exception.InvalidRoleException;
import com.geraldobuseh.transactionservice.security.Role;
import com.geraldobuseh.transactionservice.user.dto.RegisterRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(parseRole(request.getRole()));

        return userRepository.save(user);
    }

    private Role parseRole(String value) {
        if (value == null || value.isBlank()) {
            throw new InvalidRoleException("Role is required");
        }

        try {
            return Role.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new InvalidRoleException("Invalid role: " + value);
        }
    }
}
