package lt.project.sklad;

import jakarta.servlet.MultipartConfigElement;
import lt.project.sklad._security.utils.MessagingUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.util.unit.DataSize;

@SpringBootApplication
public class WarehouseApplication  {
	public static void main(String[] args) {
		SpringApplication.run(WarehouseApplication.class, args);
	}

//	@Bean
//	CommandLineRunner commandLineRunner() {
//
//	}

//	@Bean
//	public MessagingUtils messagingUtils() {
//		return new MessagingUtils();
//	}


	//Fixes maximum upload size for images  and files
	@Bean
	public MultipartConfigElement multipartConfigElement() {
		MultipartConfigFactory factory = new MultipartConfigFactory();
		factory.setMaxFileSize(DataSize.ofBytes(50L * 1024L * 1024L)); // 50MB per` upload
		factory.setMaxRequestSize(DataSize.ofBytes(50L * 1024L * 1024L));
		return factory.createMultipartConfig();
	}
}
