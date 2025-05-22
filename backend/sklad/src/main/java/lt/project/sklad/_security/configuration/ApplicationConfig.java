package lt.project.sklad._security.configuration;

import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * <p>&emsp;Configuration class responsible for providing various
 * beans related to application-wide settings and security
 * configuration. It defines beans for customizing user details
 * retrieval, passwordencoding, authentication provider,
 * and authentication manager.</p>
 *
 * @since 1.0, 3 Aug 2023
 * @version 1.0, 15 Aug 2023
 * @see UserDetailsService
 * @see AuthenticationProvider
 * @see AuthenticationManager
 * @see PasswordEncoder
 * @author Maksim Pavlenko
 */

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {
    private UserService userService;

    @Autowired
    public ApplicationConfig(UserService userService) {
        this.userService = userService;
    }

    /**
     * Creates and configures a {@link UserDetailsService} bean
     * that retrieves user details based on the username.
     *
     * @return An instance of {@link UserDetailsService}.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userService.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    /**
     * Creates and configures an {@link AuthenticationProvider} bean
     * that uses the configured {@link UserDetailsService}
     * and {@link PasswordEncoder} for authentication.
     *
     * @return An instance of {@link AuthenticationProvider}.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Creates and configures an {@link AuthenticationManager} bean
     * using the provided {@link AuthenticationConfiguration}.
     *
     * @param config The {@link AuthenticationConfiguration}.
     * @return An instance of {@link AuthenticationManager}.
     * @throws Exception If an exception occurs during configuration.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Creates and configures a {@link PasswordEncoder} bean
     * for securely encoding user passwords.
     *
     * @return An instance of {@link PasswordEncoder}.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new Argon2PasswordEncoder(16, 32, 3, 32768, 2);
    }
}
