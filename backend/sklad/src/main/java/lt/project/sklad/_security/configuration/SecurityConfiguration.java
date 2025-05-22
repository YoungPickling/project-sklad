package lt.project.sklad._security.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.sql.DataSource;
import java.util.List;

import static org.springframework.http.HttpMethod.*;

/**
 * This class configures the security for the application.
 *
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 4 Aug 2023
 * @author Maksim Pavlenko
 */

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    private JwtAuthenticationFilter jwtAuthFilter;
    private AuthenticationProvider authenticationProvider;

    @Autowired
    public SecurityConfiguration(JwtAuthenticationFilter jwtAuthFilter, AuthenticationProvider authenticationProvider) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
    }

    /**
     * Configures the security filter chain with custom settings.
     *
     * @param http The HttpSecurity object to configure security settings.
     * @return The configured SecurityFilterChain instance.
     * @throws Exception If an error occurs while configuring security.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize
                        // Allow preflight requests for Cross Origin Resource Sharing (CORS)
                        // in case if .anyRequest() is set to .authenticated()
                        .requestMatchers(OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                "**",
                                "/v2/api-docs",
                                "/v3/api-docs",
                                "/v3/api-docs/**",
                                "/swagger-resources",
                                "/swagger-resources/**",
                                "/configuration/ui",
                                "/configuration/security",
                                "/swagger-ui/**",
                                "/webjars/**",
                                "/swagger-ui.html",
                                "/api/secret/demo/**"
                        ).permitAll()
                        .requestMatchers(
                                "/api/secret/user/**",
                                "/api/secret/user/me",
                                "/api/secret/company/**",
                                "/api/secret/location/**",
                                "/api/secret/supplier/**",
                                "/api/secret/image/**",
                                "/api/secret/item/**"
                        ).authenticated()
                        .requestMatchers(GET,"/api/secret/image/**").permitAll()
                        .anyRequest().permitAll()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Creates bean with cors configuration settings.
     *
     * @return The configured CorsConfigurationSource instance.
     */

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        var corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedMethods(
                List.of(GET.name(), POST.name(),PUT.name(), DELETE.name(), OPTIONS.name())
        );
        corsConfiguration.applyPermitDefaultValues();

        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }

    /**
     * Creates and configures a UserDetailsManager bean for managing user details.
     *
     * @param dataSource The DataSource to retrieve user details from the database.
     * @return The configured UserDetailsManager instance.
     */

    @Bean
    public UserDetailsManager userDetailsManager(DataSource dataSource) {
        JdbcUserDetailsManager theUserDetailsManager = new JdbcUserDetailsManager(dataSource);

        theUserDetailsManager
                .setUsersByUsernameQuery("select id, pw, active from _user where id=?");

        theUserDetailsManager
                .setAuthoritiesByUsernameQuery("select id, role from _user where id=?");

        return theUserDetailsManager;
    }
}
