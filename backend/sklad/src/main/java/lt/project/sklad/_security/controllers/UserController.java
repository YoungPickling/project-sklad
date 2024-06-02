package lt.project.sklad._security.controllers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.entities.Token;
import lt.project.sklad._security.entities.User;
import lt.project.sklad._security.services.TokenService;
import lt.project.sklad._security.services.UserService;
import lt.project.sklad._security.utils.MessagingUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/api/rest/v1/secret/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final TokenService tokenService;
    private final MessagingUtils messagingUtils;

//    @GetMapping("/hello")
//    public String sayHello() {
//        return "Labas!";
//    }

    @GetMapping("/me")
    public ResponseEntity<?> getAuthenticatedUser(
            final HttpServletRequest request
    ) {
        return userService.getAuthenticatedUser(request);
    }

    @PostMapping("/image")
    public ResponseEntity<?> uploadUserImage(
            @RequestParam("image") MultipartFile file,
            HttpServletRequest request
    ) throws IOException {
        return userService.uploadUserImage(file, request);
    }

    @DeleteMapping("/image")
    public ResponseEntity<?> removeImage(
            HttpServletRequest request
    ) {
        return userService.removeUserImage(request);
    }

    @GetMapping("/role")
    public ResponseEntity<?> checkRole(final HttpServletRequest request) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (messagingUtils.isBearer(authHeader))
            return messagingUtils.error(UNAUTHORIZED,"Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);
        if (token == null)
            return messagingUtils.error(UNAUTHORIZED,"Token not found");

        User user = tokenService.getUserByToken(jwt).orElse(null);
        if (user == null)
            return messagingUtils.error(UNAUTHORIZED,"Bad credentials");

        String role = user.getRole().name();
        return messagingUtils.msg(role) ;
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getById(id).get();
    }

    // TODO: we need to finnish user CRUD operation endpoints
//    @PutMapping("/users/{id}")
//    public User updateUser(@PathVariable Long id, @RequestBody User user) {
//        return userService.updateUser(id, user);
//    }
//
//    @DeleteMapping("/users/{id}")
//    public void deleteUser(@PathVariable Long id) {
//        boolean res = userService.deleteUser(id);
//    }

}

