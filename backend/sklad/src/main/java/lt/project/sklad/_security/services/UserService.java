package lt.project.sklad._security.services;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.entities.User;
import lt.project.sklad._security.repositories.UserRepository;
import lt.project.sklad._security.utils.MessagingUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service class responsible for handling operations related to users.
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 3 Aug 2023
 * @author Maksim Pavlenko
 */
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final MessagingUtils messagingUtils;
    private final TokenService tokenService;

    /**
     * Retrieves a user by their ID.
     *
     * @param id The ID of the user to retrieve.
     * @return An optional containing the retrieved user, or an empty optional if not found.
     */
    public Optional<User> getById(final Long id) { return userRepository.findById(id); }

    @Transactional
    public ResponseEntity<?> getAuthenticatedUser(final HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer "))
            return messagingUtils.error(HttpStatus.FORBIDDEN, "Please authenticate");

        var token = tokenService.findByToken(authHeader.substring(7))
                .orElse(null);

        if (token == null)
            return messagingUtils.error(HttpStatus.FORBIDDEN, "Please authenticate");

        final Long userId = token.getUser().getId();

        Optional<User> userOptional = userRepository.findById(userId);

        if(!userOptional.isPresent())
            return messagingUtils.error(HttpStatus.NOT_FOUND, "User not found");

        User user = userOptional.get();

        return ResponseEntity.ok().body(user);
    }

    /**
     * Retrieves a user by their email.
     *
     * @param email The email of the user to retrieve.
     * @return An optional containing the retrieved user, or an empty optional if not found.
     */
    public Optional<User> getByEmail(final String email) { return userRepository.findByEmail(email); }

    /**
     * Retrieves a user by their username.
     *
     * @param username The username of the user to retrieve.
     * @return An optional containing the retrieved user, or an empty optional if not found.
     */
    public Optional<User> getByUsername(final String username) { return userRepository.findByEmail(username); }

    /**
     * Retrieves a list of all usernames.
     *
     * @return The list of usernames.
     */
    public List<String> getAllUsernames() { return userRepository.getAllUsernames(); }

    /**
     * Retrieves a list of all users.
     *
     * @return The list of users.
     */
    public List<User> getAll() { return userRepository.findAll(); }

    /**
     * Saves a user.
     *
     * @param user The user to be saved.
     * @return The saved user.
     */
    public User saveUser(final User user) { return userRepository.save(user); }

    /**
     * Deletes a user.
     *
     * @param user The user to be deleted.
     */
    public void deleteUser(final User user) {
        userRepository.delete(user);
    }

    /**
     * Checks if a user with the given email exists.
     *
     * @param email The email to check.
     * @return true if a user with the email exists, false otherwise.
     */
    public boolean hasEmail(final String email) { return userRepository.existsByEmail(email); }

    /**
     * Checks if a user with the given username exists.
     *
     * @param username The username to check.
     * @return true if a user with the username exists, false otherwise.
     */
    public boolean hasUsername(final String username) { return userRepository.existsByUsername(username); }

    /**
     * Retrieves a user by their username.
     *
     * @param username The username of the user to retrieve.
     * @return An optional containing the retrieved user, or an empty optional if not found.
     */
    public Optional<User> findByUsername(final String username) { return userRepository.findByUsername(username);}

    /**
     * Saves a user.
     *
     * @param user The user to be saved.
     * @return The saved user.
     */
    public User save(final User user) { return userRepository.save(user);}
}
