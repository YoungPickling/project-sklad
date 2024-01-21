package lt.project.sklad._security.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * This class configures the
 * <i><b>Cross-Origin Resource Sharing (CORS)</b></i>
 * for the application.
 *
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 3 Aug 2023
 * @author Maksim Pavlenko
 */

@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {
    /**
     * This method adds a CORS mapping to the application.
     *
     * @param registry The CORS registry
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")// Adjust the mapping as needed
                .allowedOrigins("http://localhost:4200") // Allow requests from this origin
                .allowedMethods("*") // Allow specific HTTP methods
                .allowedHeaders("*")
                .allowCredentials(true); // Allow cookies and controllers headers
    }
}