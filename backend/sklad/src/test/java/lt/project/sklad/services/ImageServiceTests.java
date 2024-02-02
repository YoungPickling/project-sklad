package lt.project.sklad.services;

import lt.project.sklad.services.ImageService;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
@Testcontainers
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ImageServiceTests {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16.0");
    @Autowired
    ImageService imageService;

    final MultipartFile TEST_FILE = new MultipartFile() {
        @Override
        public String getName() {
            return "image";
        }

        @Override
        public String getOriginalFilename() {
            return "tiny.jpg";
        }

        @Override
        public String getContentType() {
            return "image/jpeg";
        }

        @Override
        public boolean isEmpty() {
            return false;
        }

        @Override
        public long getSize() {
            return 134;
        }

        @Override
        public byte[] getBytes() throws IOException {
            return new byte[]{-1,-40,-1,-32,0,16,74,70,73,70,0,1,1,1,0,72,0,72,0,0,-1,-37,0,67,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-62,0,11,8,0,1,0,1,1,1,17,0,-1,-60,0,20,16,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-38,0,8,1,1,0,1,63,16};
        }

        @Override
        public InputStream getInputStream() throws IOException {
            return null;
        }

        @Override
        public void transferTo(File dest) throws IOException, IllegalStateException {

        }
    };

    String imageName = "tiny.jpg";

    @Test
    @Order(0)
    void checkForNullReference_CompanyService() {
        assertNotNull(imageService);
    }

    @Test
    @Order(1)
    void checkForImageUpload() {
        ResponseEntity<?> response = imageService.uploadImage(TEST_FILE);

        assertEquals(
                200,
                response.getStatusCode().value(),
                "Test failed to upload image in assertion"
        );
    }

    @Test
    @Order(2)
    void checkForImageDownload() {
        try {
            System.out.println(this.imageName);
            ResponseEntity<?> response = imageService.downloadImage(this.imageName);

            Object body = response.getBody();
            if(body instanceof byte[]) {
                assertArrayEquals(
                        TEST_FILE.getBytes(),
                        (byte[]) body
                );
            } else {
                fail("Error in ready file");
            }

        } catch (IOException e) {
            fail("IOException occurred during assertion: " + e.getMessage());
        }
    }

    @Test
    @Order(3)
    void checkIfImageWasRemoved() {
        ResponseEntity<?> response = imageService.removeImage(this.imageName);

        assertEquals(
                200,
                response.getStatusCode().value(),
                "Test failed to remove image"
        );
    }

}