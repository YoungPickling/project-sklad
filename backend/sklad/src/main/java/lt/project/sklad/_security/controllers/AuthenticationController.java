package lt.project.sklad._security.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.headers.Header;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.dto_request.AuthenticationRequest;
import lt.project.sklad._security.dto_request.RegisterRequest;
import lt.project.sklad._security.dto_response.*;
import lt.project.sklad._security.services.AuthenticationService;
import lt.project.sklad._security.services.HttpResponseService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

import static org.springframework.http.HttpStatus.CREATED;

/**
 * <p>&emsp;Authentication controller class responsible for handling authentication-related HTTP requests.
 * Provides endpoints for user registration, login, token refreshing, and logout.</p><br/>
 * <i>&emsp;Contains these endpoints:</i>
 * <ul style="list-style-type: square;">
 *   <li>{@link #register       /api/v1/auth/register      }</li>
 *   <li>{@link #authenticate   /api/v1/auth/login         }</li>
 *   <li>{@link #refreshToken   /api/v1/auth/refresh-token }</li>
 *   <li>{@link #logout         /api/v1/auth/logout        }</li>
 * </ul>
 *
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 4 Aug 2023
 * @author Maksim Pavlenko
 */
@RestController
@RequestMapping("/api/v1.00/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authService;
    private final HttpResponseService responseService;

    /**
     * Handles user registration by processing a {@link RegisterRequest}.
     *
     * @param request       The {@link RegisterRequest} containing user registration information.
     * @param response      The {@link HttpServletResponse} to set the response.
     * @param bindingResult The {@link BindingResult} for request validation.
     * @return A {@link ResponseEntity} containing the registration result or validation error.
     */
    @Operation(summary = "Registers a new USER/MANAGER/ADMIN")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Registration successful, account is created",
                    content = {@Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AuthenticationResponse.class)) }),
            @ApiResponse(
                    responseCode = "406",
                    description = "Request did not pass the annotated spring validations",
                    content = {@Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MultiErrorResponse.class)) }),
            @ApiResponse(
                    responseCode = "400",
                    description = "Username or email are taken",
                    content = {@Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)) })
    })
    @PostMapping("/register")
    public ResponseEntity<AbstractResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response,
            BindingResult bindingResult)
    {
        var error = responseService.regisrationValidation(bindingResult, request);
        if (error != null)
            return error;
        return ResponseEntity.status(CREATED).body( authService.register(request, response) );
    }

    /**
     * Handles user authentication by processing an {@link AuthenticationRequest}.
     *
     * @param request  The {@link AuthenticationRequest} containing user login credentials.
     * @param response The {@link HttpServletResponse} to set the response.
     * @return A {@link ResponseEntity} containing the authentication result.
     */
    @Operation(summary = "Logging in authentication")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Registration successful, account is created",
                    headers = {
                            @Header(name = HttpHeaders.SET_COOKIE,
                                    schema = @Schema(type = "string"),
                                    description = "HttpOnly JWT refresh token")},
                    content = {@Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AuthenticationResponse.class)) }),
            @ApiResponse(
                    responseCode = "403",
                    description = "User not authenticated",
                    content = {@Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MultiErrorResponse.class)) })
    })
    @PostMapping("/login")
    public ResponseEntity<AbstractResponse> authenticate(
            @RequestBody AuthenticationRequest request,
            HttpServletResponse response)
    {
        return ResponseEntity.ok(authService.authenticate(request, response));
    }

    /**
     * Handles token refreshing for authenticated users with a refresh token.
     *
     * @param request  The {@link HttpServletRequest} for accessing cookies.
     * @param response The {@link HttpServletResponse} to set the response.
     * @return A {@link ResponseEntity} containing the token refreshing result.
     * @throws {@link IOException} If an I/O error occurs while handling the request.
     */
    @Operation(
            summary = "Token refreshing",
            description = "Authentication for those, who have a refresh token",
            security = { @SecurityRequirement(name = "Bearer") })
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Registration successful, account is created",
                    headers = {
                            @Header(name = HttpHeaders.SET_COOKIE,
                                    schema = @Schema(type = "string"),
                                    description = "HttpOnly JWT refresh token")},
                    content = {
                            @Content(mediaType = "application/json",
                                     schema = @Schema(implementation = AuthenticationResponse.class)) }),
            @ApiResponse(
                    responseCode = "403",
                    description = "User not authenticated",
                    content = {@Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MultiErrorResponse.class)) })
    })
    @GetMapping("/refresh-token")
    public ResponseEntity<AbstractResponse> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        return authService.refreshTokenFromCookie(request, response);
    }

    /**
     * Handles user logout by clearing authentication context,
     * marks access token as expired and removes refresh token <i>HttpOnly</i> cookie.
     *
     * @param request  The {@link HttpServletRequest} for accessing cookies.
     * @param response The {@link HttpServletResponse} to set the response.
     * @return A {@link ResponseEntity} indicating the success of the logout operation.
     */
    @Operation(
            summary = "Logout",
            description = "Handles user logout by clearing authentication context and removing refresh token cookie.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Logout successful",
                    headers = {@Header(
                            name = HttpHeaders.SET_COOKIE,
                            schema = @Schema(type = "string"),
                            description = "Deletes the refresh token")},
                    content = @Content(schema = @Schema(implementation = MsgResponse.class))),
            @ApiResponse(
                    responseCode = "403",
                    description = "User not authenticated")
    })
    // Not working on front end without @CrossOrigin annotation...
    // ...even with global CORS configuration in CorsConfig.java
    @CrossOrigin
    @GetMapping("/logout")
    public ResponseEntity<AbstractResponse> logout(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        return authService.logout(request, response);
    }
}
