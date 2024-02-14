package lt.project.sklad._security.configuration;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.entities.User;
import lt.project.sklad._security.services.JwtService;
import lt.project.sklad._security.services.TokenService;
import lt.project.sklad._security.services.UserService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * <p>&emsp;Custom filter responsible for JWT authentication.
 * This filter intercepts incoming requests and validates JWT tokens, setting the
 * authenticated user in the Spring Security context if the token is valid.</p>
 *
 * <p>&emsp;The filter is designed to be invoked once per request. It extracts the JWT token
 * from the request's "Authorization" header, validates its signature and expiration,
 * and if valid, loads the associated user details from the UserDetailsService and sets
 * the user in the SecurityContextHolder. The token's validity is also checked against
 * the TokenService to ensure it has not been revoked or expired.</p>
 *
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 3 Aug 2023
 * @author Maksim Pavlenko
 */

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final UserDetailsService userDetailsService;
    private final TokenService tokenService;
    private final JwtService jwtService;

    /**
     * Performs <i><b>JWT</b></i> authentication and authorization logic for incoming requests.
     *
     * @param request     The HttpServletRequest representing the incoming request.
     * @param response    The HttpServletResponse representing the response.
     * @param filterChain The FilterChain to proceed with the filtered request.
     * @throws ExpiredJwtException If the JWT has expired.
     * @throws ServletException If an exception occurs during servlet processing.
     * @throws IOException      If an I/O exception occurs.
     */

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ExpiredJwtException, ServletException, IOException {
        if (!request.getServletPath().contains("api/secret")) {
            filterChain.doFilter(request, response);
            return;
        }
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        String username;
        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        jwt = authHeader.substring(7);

        // TODO: implement exception handling for ExpiredJwtException
        try {
            username = jwtService.extractUsername(jwt);
        } catch (ExpiredJwtException e) {
            //e.printStackTrace();
            filterChain.doFilter(request, response);
            return;
        }

        if (SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails = null;
            try {
                userDetails = userDetailsService.loadUserByUsername(username);
            } catch (UsernameNotFoundException e) {
                filterChain.doFilter(request, response);
                return;
            }

            var isTokenValid = tokenService.findByToken(jwt)
                    .map(t -> !t.isExpired() && !t.isRevoked())
                    .orElse(false);

            if (jwtService.isTokenValid(jwt, userDetails) && isTokenValid) {
                var authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
