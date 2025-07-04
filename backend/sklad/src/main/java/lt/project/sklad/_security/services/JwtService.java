package lt.project.sklad._security.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * <p>&emsp;This service class provides utility methods for generating, parsing, and validating
 * <i>JSON Web Tokens (JWTs)</i> to easily secure user authentication and authorization.
 * It handles the creation of both access tokens and refresh tokens for users, along
 * with methods to extract and manage refresh tokens stored in HttpOnly cookies.</p>
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 3 Aug 2023
 * @author Maksim Pavlenko
 */
@Service
public class JwtService {
    private String secretKey;
    private long jwtExpiration;
    private long refreshExpiration;

    public JwtService(
            //@Value("${application.security.jwt.secret-key}") String secretKey,
            @Value("${application.security.jwt.expiration}") long jwtExpiration,
            @Value("${application.security.jwt.refresh-token.expiration}") long refreshExpiration
    ) {
        this.secretKey = "86256E326557E632345366A5756575387854262F413F40472B4B4284066B59702357E63326546E5135B32566A6B5970865670657532B4878440475262F4284F4";
        this.jwtExpiration = jwtExpiration;
        this.refreshExpiration = refreshExpiration;
    }

    /**
     * Extracts the username (subject) from the provided JWT token's claims.
     *
     * @param token The JWT token from which to extract the username.
     * @return The extracted username from the token's claims.
     */
    public String extractUsername(final String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts the specified claim from the JWT token's claims using the provided resolver function.
     *
     * @param token         The JWT token from which to extract the claim.
     * @param claimsResolver The resolver function for extracting the desired claim.
     * @param <T>           The type of the claim being extracted.
     * @return The extracted claim.
     */
    public <T> T extractClaim(final String token, final Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Builds an access token for the given user details, using the default claims and expiration time.
     *
     * @param userDetails The user details for which the token is generated.
     * @return The generated access token.
     */
    public String buildAccessToken(final UserDetails userDetails) {
        return buildAccessToken(new HashMap<>(), userDetails);
    }

    /**
     * Builds an access token for the given user details, with additional claims and expiration time.
     *
     * @param extraClaims   Additional claims to be included in the token.
     * @param userDetails  The user details for which the token is generated.
     * @return The generated access token.
     */
    public String buildAccessToken(
            final Map<String, Object> extraClaims,
            final UserDetails userDetails
    ) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    /**
     * Builds a refresh token for the given user details.
     *
     * @param userDetails The user details for which the refresh token is generated.
     * @return The generated refresh token.
     */
    public String buildRefreshToken(final UserDetails userDetails) {
        final Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Builds a JWT token with the provided extra claims and expiration time.
     *
     * @param extraClaims   Additional claims to be included in the token.
     * @param userDetails  The user details for which the token is generated.
     * @param expiration    The expiration time for the token.
     * @return The generated JWT token.
     */
    private String buildToken(
            final Map<String, Object> extraClaims,
            final UserDetails userDetails,
            final long expiration
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Checks if the given token is valid for the provided user details.
     *
     * @param token        The token to be validated.
     * @param userDetails The user details for which the token is being validated.
     * @return True if the token is valid, otherwise false.
     */
    public boolean isTokenValid(
            final String token,
            final UserDetails userDetails)
    {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * Checks if the given token has expired.
     *
     * @param token The token to be checked for expiration.
     * @return True if the token has expired, otherwise false.
     */
    private boolean isTokenExpired(final String token) {
        return extractExpiration(token).before(new Date()) ;
    }

    /**
     * Extracts the expiration date from the given token's claims.
     *
     * @param token The token from which to extract the expiration date.
     * @return The expiration date of the token.
     */
    private Date extractExpiration(final String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extracts all claims from the given JWT token.
     *
     * @param token The JWT token from which to extract the claims.
     * @return All claims contained in the token.
     */
    private Claims extractAllClaims(final String token) {
        return Jwts
                .parser() // parserBuilder() 0.11.5
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Retrieves the signing key used for JWT token verification.
     *
     * @return The signing key for JWT token verification.
     */
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Extracts the refresh token value from the <i>"refreshToken"</i> HttpOnly cookie.
     *
     * @param request The HTTP request containing cookies.
     * @return The value of the refresh token cookie, or null if not found.
     */
    public String extractRefreshTokenFromCookie(final HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName()))
                    return cookie.getValue();
            }
        }
        return null;
    }

    /**
     * Adds an HttpOnly refresh token cookie to the HTTP response with the provided refresh token.
     *
     * @param response      The HTTP response object for setting the refresh token cookie.
     * @param refreshToken The refresh token to be stored in the cookie.
     */
    public void addRefreshTokenCookie(final HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setPath("/");
        cookie.setHttpOnly(true); // prevents javascript from accessing the cookie
        cookie.setMaxAge((int) (refreshExpiration) / 1000); // cookie's max age within seconds
        response.addCookie(cookie);
    }

    /**
     * Deletes the refresh token cookie by setting its max age to 0 and HttpOnly to true.
     *
     * @param response The HTTP response object to which the cookie will be added.
     */
    public void deleteRefreshTokenCookie(final HttpServletResponse response) {
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setMaxAge(0); // Set the cookie's max age to 0 to delete it
        refreshTokenCookie.setPath("/"); // Set the cookie's path to match where it was set
        refreshTokenCookie.setHttpOnly(true); // Set the cookie as HttpOnly
        response.addCookie(refreshTokenCookie);
    }

    /**
     * Makes sure the secret key works
     */
    @PostConstruct
    public void init() {
        if (secretKey == null) {
            secretKey = System.getenv("JWT_SECRET_KEY");
        }
    }
}
