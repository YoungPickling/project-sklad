package lt.project.sklad._security.services;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lt.project.sklad._security.dto_request.AuthenticationRequest;
import lt.project.sklad._security.dto_request.ChangePasswordRequest;
import lt.project.sklad._security.dto_request.RegisterRequest;
import lt.project.sklad._security.dto_response.AbstractResponse;
import lt.project.sklad._security.dto_response.AuthenticationResponse;
import lt.project.sklad._security.dto_response.ErrorResponse;
import lt.project.sklad._security.dto_response.MsgResponse;
import lt.project.sklad._security.entities.Role;
import lt.project.sklad._security.entities.Token;
import lt.project.sklad._security.entities.TokenType;
import lt.project.sklad._security.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;

import static org.springframework.http.HttpStatus.FORBIDDEN;

/**
 * Service responsible for handling user authentication,
 * registration, and token management.
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 3 Aug 2023
 * @author Maksim Pavlenko
 */
@Service
public class AuthenticationService {
    private UserService userService;
    private TokenService tokenService;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private AuthenticationManager authenticationManager;

    @Autowired
    public AuthenticationService(
            UserService userService,
            TokenService tokenService,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            @Value("${application.security.jwt.refresh-token.expiration}") long refreshExpiration
    ) {
        this.userService = userService;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.refreshExpiration = refreshExpiration;
    }

    private long refreshExpiration;

    /**
     * &ensp; Registers a new user with the provided registration details and issues
     * an <i><b>access token</b></i> in a JSON body and
     * a <i><b>refresh token</b></i> in the form of an HttpOnly cookie upon successful registration.
     *
     * @param request  The registration request containing user details.
     * @param response The HTTP response object for setting the refresh token cookie.
     * @return An instance of {@link AuthenticationResponse} containing the access token.
     */
    public AuthenticationResponse register(
            final RegisterRequest request,
            final HttpServletResponse response)
    {
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .username(request.getUsername())
                .email(request.getEmail())
                .registrationDate(LocalDateTime.now()) // System.currentTimeMillis()
                .password( passwordEncoder.encode(request.getPassword()) )
                .role( request.getRole() == null ? Role.USER : request.getRole() )
                .build();

        var savedUser = userService.save(user);
        var accessToken = jwtService.buildAccessToken(user);
        var refreshToken = jwtService.buildRefreshToken(user);
        jwtService.addRefreshTokenCookie(response, refreshToken);
        saveUserToken(savedUser, accessToken);
        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .role(user.getRole().name())
                .build();
    }

    /**
     * &ensp; Authenticates a user based on the provided
     * authentication request and issues new access and refresh tokens.
     *
     * @param request  The authentication request containing user credentials.
     * @param response The HTTP response object for setting the refresh token cookie.
     * @return An instance of {@link AuthenticationResponse} containing the new access token.
     */
    public AbstractResponse authenticate(
            final AuthenticationRequest request,
            final HttpServletResponse response)
    {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = userService.findByUsername(request.getUsername())
                .orElseThrow();
        var accessToken = jwtService.buildAccessToken(user);
        var refreshToken = jwtService.buildRefreshToken(user);
        revokeAllUserTokens(user);
        jwtService.addRefreshTokenCookie(response, refreshToken);
        saveUserToken(user, accessToken);
        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .role(user.getRole().name())
                .build();
    }

    /**
     * &ensp; Logs out the authenticated user and deletes the refresh token HttpOnly cookie.
     * In case if the request contained an <i><b>"Authorization"</b></i> header with <i><b>"Bearer + JWT token"</b></i> - invalidates their tokens.
     *
     * @param request  The HTTP request object for accessing the authorization header.
     * @param response The HTTP response object for deleting the refresh token cookie.
     * @return A {@link ResponseEntity} with an instance of {@link MsgResponse} indicating a successful logout.
     */
    public ResponseEntity<AbstractResponse> logout(
            final HttpServletRequest request,
            final HttpServletResponse response
    ) {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            var storedToken = tokenService.findByToken(jwt)
                    .orElse(null);
            if (storedToken != null) {
                storedToken.setExpired(true);
                storedToken.setRevoked(true);
                tokenService.save(storedToken);
            }
        }
        jwtService.deleteRefreshTokenCookie(response);
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new MsgResponse("Ok"));
    }

    /**
     * Saves a new user token in the database, allowing the user to be authenticated
     * for subsequent requests. The token is associated with the provided user and
     * contains necessary information for secure communication.
     *
     * @param user      The user for whom the token is generated.
     * @param jwtToken  The access token generated for the user.
     */
    private void saveUserToken(final User user, final String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenService.save(token);
    }

    /**
     * Revokes and marks as expired all tokens associated with the provided user.
     * This method is used during logout or when refreshing tokens to ensure that
     * previous tokens become invalid and cannot be used for unauthorized access.
     *
     * @param user  The user whose tokens are to be revoked.
     */
    private void revokeAllUserTokens(final User user) {
        var validUserTokens = tokenService.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenService.saveAll(validUserTokens);
    }

    /**
     * Refreshes the access token using the refresh token stored in the HttpOnly cookie. If the refresh token is valid,
     * a new access token is generated and a new refresh token is issued and stored in the HttpOnly cookie.
     *
     * @param request  The HTTP request object for accessing the refresh token cookie.
     * @param response The HTTP response object for setting the new refresh token cookie.
     * @return A {@link ResponseEntity} containing an instance of {@link AuthenticationResponse} with the new access token,
     * or an {@link ErrorResponse} indicating a 403 forbidden status.
     * @throws IOException If an I/O error occurs while handling the response.
     */
    public ResponseEntity<AbstractResponse> refreshTokenFromCookie(
            final HttpServletRequest request,
            final HttpServletResponse response
    ) throws IOException {
        String refreshToken = jwtService.extractRefreshTokenFromCookie(request);
        if (refreshToken != null) {
            String username = jwtService.extractUsername(refreshToken);
            if (username != null) {
                User user = userService.findByUsername(username).orElse(null);
                if (user != null && jwtService.isTokenValid(refreshToken, user)) {
                    String accessToken = jwtService.buildAccessToken(user);
                    String newRefreshToken = jwtService.buildRefreshToken(user);
                    jwtService.addRefreshTokenCookie(response, newRefreshToken);
                    return createTokensResponse(accessToken, user.getRole().name());
                }
            }
        }
        return ResponseEntity.status(FORBIDDEN) // status 403
                .body(new ErrorResponse(FORBIDDEN.value(), "Forbidden"));
    }

    /**
     * Creates a ResponseEntity containing an instance of {@link AuthenticationResponse} with the provided access token and role.
     *
     * @param accessToken The new access token.
     * @param role        The user's role.
     * @return A {@link ResponseEntity} with the new access token and role encapsulated in an instance of {@link AuthenticationResponse}.
     */
    private ResponseEntity<AbstractResponse> createTokensResponse(
            final String accessToken,
            final String role
    ) {
        return ResponseEntity.ok(new AuthenticationResponse(accessToken,role));
    }

    public ResponseEntity<AbstractResponse> passwordRenewal(
            final ChangePasswordRequest request,
            final HttpServletResponse response
    ) {
        return null;
    }
}
