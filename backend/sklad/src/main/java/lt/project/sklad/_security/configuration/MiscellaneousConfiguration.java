package lt.project.sklad._security.configuration;

import lt.project.sklad._security.utils.MessagingUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MiscellaneousConfiguration {
    @Bean
    public MessagingUtils messagingUtils() {
        return new MessagingUtils();
    }
}
