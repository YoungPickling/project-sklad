package lt.project.sklad;

import jakarta.servlet.MultipartConfigElement;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.util.unit.DataSize;

@SpringBootApplication
public class WarehouseApplication /*implements CommandLineRunner*/ {
	public static void main(String[] args) {
		SpringApplication.run(WarehouseApplication.class, args);
	}

//	@Override
//	public void run(String... args) throws Exception {
//
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
