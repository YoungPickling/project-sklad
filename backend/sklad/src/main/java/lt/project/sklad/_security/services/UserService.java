package lt.project.sklad._security.services;

import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.entities.User;
import lt.project.sklad._security.repositories.UserRepository;
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
    private final UserRepository repo;

    /**
     * Retrieves a user by their ID.
     *
     * @param id The ID of the user to retrieve.
     * @return An optional containing the retrieved user, or an empty optional if not found.
     */

    public Optional<User> getById(Long id) { return repo.findById(id); }

    /**
     * Retrieves a user by their email.
     *
     * @param email The email of the user to retrieve.
     * @return An optional containing the retrieved user, or an empty optional if not found.
     */

    public Optional<User> getByEmail(String email) { return repo.findByEmail(email); }

    /**
     * Retrieves a user by their username.
     *
     * @param username The username of the user to retrieve.
     * @return An optional containing the retrieved user, or an empty optional if not found.
     */

    public Optional<User> getByUsername(final String username) { return repo.findByEmail(username); }

    /**
     * Retrieves a list of all usernames.
     *
     * @return The list of usernames.
     */

    public List<String> getAllUsernames() { return repo.getAllUsernames(); }

    /**
     * Retrieves a list of all users.
     *
     * @return The list of users.
     */

    public List<User> getAll() { return repo.findAll(); }

    /**
     * Saves a user.
     *
     * @param user The user to be saved.
     * @return The saved user.
     */

    public User saveUser(final User user) { return repo.save(user); }

    /**
     * Deletes a user.
     *
     * @param user The user to be deleted.
     */

    public void deleteUser(final User user) {
        repo.delete(user);
    }

    /**
     * Checks if a user with the given email exists.
     *
     * @param email The email to check.
     * @return true if a user with the email exists, false otherwise.
     */

    public boolean hasEmail(final String email) { return repo.existsByEmail(email); }

    /**
     * Checks if a user with the given username exists.
     *
     * @param username The username to check.
     * @return true if a user with the username exists, false otherwise.
     */

    public boolean hasUsername(final String username) { return repo.existsByUsername(username); }

    /**
     * Retrieves a user by their username.
     *
     * @param username The username of the user to retrieve.
     * @return An optional containing the retrieved user, or an empty optional if not found.
     */

    public Optional<User> findByUsername(final String username) { return repo.findByUsername(username);}

    /**
     * Saves a user.
     *
     * @param user The user to be saved.
     * @return The saved user.
     */

    public User save(final User user) { return repo.save(user);}
}
