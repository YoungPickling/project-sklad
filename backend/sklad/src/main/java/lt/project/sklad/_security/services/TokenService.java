package lt.project.sklad._security.services;

import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.entities.Token;
import lt.project.sklad._security.entities.User;
import lt.project.sklad._security.repositories.TokenRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service class responsible for handling operations related to tokens.
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 3 Aug 2023
 * @author Maksim Pavlenko
 */

@Service
@RequiredArgsConstructor
public class TokenService {
    private final TokenRepository repo;

    /**
     * Retrieves the user associated with the given token.
     *
     * @param token The token for which to retrieve the associated user.
     * @return An optional containing the user associated with the token, or an empty optional if not found.
     */
    public Optional<User> getUserByToken(final String token) {
        return repo.getUserByToken(token);
    }

    /**
     * Finds a token by its value.
     *
     * @param token The token value to search for.
     * @return An optional containing the found token, or an empty optional if not found.
     */
    public Optional<Token> findByToken(final String token){ return repo.findByToken(token); }

    /**
     * Saves a token in the repository.
     *
     * @param storedToken The token to be saved.
     * @return The saved token.
     */
    public Token save(final Token storedToken) { return repo.save(storedToken); }

    /**
     * Saves a list of tokens in the repository.
     *
     * @param tokens The list of tokens to be saved.
     * @return The list of saved tokens.
     */
    public List<Token> saveAll(final List<Token> tokens) { return repo.saveAll(tokens); }

    /**
     * Finds all valid tokens associated with a specific user.
     *
     * @param id The user ID for which to retrieve valid tokens.
     * @return The list of valid tokens associated with the user.
     */
    public List<Token> findAllValidTokenByUser(final Long id) {return repo.findAllValidTokenByUser(id); }
}
