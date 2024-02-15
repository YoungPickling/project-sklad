package lt.project.sklad.configurations;

import jakarta.servlet.MultipartConfigElement;
import lt.project.sklad.utils.HashUtils;
import lt.project.sklad.utils.ImageUtils;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;

@Configuration
public class AppConfiguration {
    /** Fixes maximum upload size for images  and files */
    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setMaxFileSize(DataSize.ofBytes(50L * 1024L * 1024L)); // 50MB per` upload
        factory.setMaxRequestSize(DataSize.ofBytes(50L * 1024L * 1024L));
        return factory.createMultipartConfig();
    }

    @Bean
    public ImageUtils imageUtils() {
        return new ImageUtils();
    }

    @Bean
    public HashUtils hashUtils() {
        return new HashUtils();
    }
}
