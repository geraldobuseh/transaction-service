package com.geraldobuseh.transactionservice.security;

import com.geraldobuseh.transactionservice.exception.EmailAlreadyExistsException;
import com.geraldobuseh.transactionservice.exception.UserAlreadyExistsException;
import com.geraldobuseh.transactionservice.user.User;
import com.geraldobuseh.transactionservice.user.UserRepository;
import com.geraldobuseh.transactionservice.user.UserService;
import com.geraldobuseh.transactionservice.user.dto.AuthResponse;
import com.geraldobuseh.transactionservice.user.dto.LoginRequest;
import com.geraldobuseh.transactionservice.user.dto.RegisterRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticationService.class);

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserService userService;

    public AuthenticationService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository,
            UserService userService
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    public AuthResponse register(RegisterRequest request) {
        ensureUsernameAvailable(request.getUsername());
        ensureEmailAvailable(request.getEmail());

        User user;
        try {
            user = userService.createUser(request);
        } catch (DataIntegrityViolationException exception) {
            throw new UserAlreadyExistsException("Username or email is already registered");
        }

        return toAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException exception) {
            LOGGER.warn("operation=login_failed usernameAttempted={}", request.getUsername());
            throw exception;
        }

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        LOGGER.info("operation=login_succeeded username={} role={}", user.getUsername(), user.getRole());
        return toAuthResponse(user);
    }

    private void ensureUsernameAvailable(String username) {
        userRepository.findByUsername(username.trim())
                .ifPresent(user -> {
                    throw new UserAlreadyExistsException("Username is already registered");
                });
    }

    private void ensureEmailAvailable(String email) {
        userRepository.findByEmail(email.trim())
                .ifPresent(user -> {
                    throw new EmailAlreadyExistsException("Email is already registered");
                });
    }

    private AuthResponse toAuthResponse(User user) {
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }
}
