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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/api/secret/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final TokenService tokenService;

    @GetMapping("/hello")
    public String sayHello() {
        return "Labas!";
    }

    @GetMapping("/role")
    public ResponseEntity<?> checkRole(HttpServletRequest request) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (MessagingUtils.isBearer(authHeader))
            return MessagingUtils.error(UNAUTHORIZED,"Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);
        if (token == null)
            return MessagingUtils.error(UNAUTHORIZED,"Token not found");

        User user = tokenService.getUserByToken(jwt).orElse(null);
        if (user == null)
            return MessagingUtils.error(UNAUTHORIZED,"Bad credentials");

        String role = user.getRole().name();
        return MessagingUtils.msg(role) ;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getAuthenticatedUser(
            final HttpServletRequest request
    ) {
        return userService.getAuthenticatedUser(request);
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

