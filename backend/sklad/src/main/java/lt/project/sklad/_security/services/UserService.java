package lt.project.sklad._security.services;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.entities.Token;
import lt.project.sklad._security.entities.User;
import lt.project.sklad._security.repositories.UserRepository;
import lt.project.sklad._security.utils.MessagingUtils;
import lt.project.sklad.entities.Image;
import lt.project.sklad.repositories.ImageRepository;
import lt.project.sklad.utils.HashUtils;
import lt.project.sklad.utils.ImageUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

/**
 * Service class responsible for handling operations related to users.
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 3 Aug 2023
 * @author Maksim Pavlenko
 */
@Service
@RequiredArgsConstructor
public class UserService {
    private UserRepository userRepository;
    private MessagingUtils messagingUtils;
    private TokenService tokenService;
    private MessagingUtils msgUtils;
    private ImageRepository imageRepository;

    @Autowired
    public UserService(UserRepository userRepository, MessagingUtils messagingUtils, TokenService tokenService, MessagingUtils msgUtils, ImageRepository imageRepository) {
        this.userRepository = userRepository;
        this.messagingUtils = messagingUtils;
        this.tokenService = tokenService;
        this.msgUtils = msgUtils;
        this.imageRepository = imageRepository;
    }

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

    @Transactional
    public ResponseEntity<?> uploadUserImage(
            final MultipartFile file,
            final HttpServletRequest request
    ) {
        if (file == null || file.isEmpty())
            return msgUtils.error(HttpStatus.BAD_REQUEST, "File is empty");

        if (!file.getContentType().startsWith("image/"))
            return msgUtils.error(HttpStatus.BAD_REQUEST, "Not an Image!");

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isNotBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        final String jwt = authHeader.substring(7);
        final Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        User user = userRepository.findById(token.getUser().getId()).orElse(null);

        if (user == null)
            return msgUtils.error(UNAUTHORIZED, "User not found");

        String hash = HashUtils.hashString(file.getOriginalFilename());
        int i = 0;

        if(hash == null)
            return msgUtils.error(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to hash file name");

        while(imageRepository.findByHash(hash).isPresent()) {
            hash = HashUtils.hashString(file.getOriginalFilename() + i);
            i++;
        }

        try {
            final byte[] compressedImage = ImageUtils.compressImage(file.getBytes());

            final String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

            Image image = imageRepository.save(Image.builder()
                    .name(file.getOriginalFilename())
                    .hash(hash)
                    .type(file.getContentType())
                    .size(file.getSize())
                    .imageData(compressedImage)
                    .compressedSize(compressedImage.length)
                    .date(date)
                    .build()
            );

            if (image == null)
                return msgUtils.error(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save the file");

            user.setImage(image);

            Map<String, String> response = new HashMap<>();
            response.put("msg", "Upload successful");
            response.put("name", file.getOriginalFilename());
            response.put("date", date);
            response.put("hash", hash);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return msgUtils.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error during file upload", e.getMessage());
        }
    }

    @Transactional
    public ResponseEntity<?> removeUserImage(
            final HttpServletRequest request
    ) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isNotBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        User user = userRepository.findById(token.getUser().getId()).orElse(null);

        if (user == null)
            return msgUtils.error(UNAUTHORIZED, "User not found");

//        Image image = imageRepository.findByHash(linkHash).orElse(null);

        Image image = user.getImage();

        if (image == null)
            return msgUtils.msg("Removed successfully!");

        Image imageTwo = imageRepository.findByHash(image.getHash()).orElse(null);

        user.setImage(null);

        if (imageTwo == null)
            return msgUtils.msg("Removed successfully!!");

        imageRepository.deleteById(imageTwo.getId());

        return msgUtils.msg("Removed successfully");
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
