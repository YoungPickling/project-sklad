package lt.project.sklad.services;

import lt.project.sklad._security.dto_response.BriefMsgResponse;
import lt.project.sklad.entities.Image;
import lt.project.sklad.repositories.ImageRepository;
import lt.project.sklad.utils.ImageUtils;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

//@DataJpaTest
//@Testcontainers
//@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ImageServiceTests {
    @InjectMocks
    private ImageService imageService;

    // Mocking all ImageService's imports, see the class to find out more
    @Mock
    private ImageRepository imageRepository;

    // Arrange
    final String IMAGE_NAME = "tiny.jpg";

    final byte[] PICTURE = new byte[]{-1,-40,-1,-32,0,16,74,70,73,70,0,1,1,1,0,72,0,72,0,0,-1,-37,0,67,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-62,0,11,8,0,1,0,1,1,1,17,0,-1,-60,0,20,16,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-38,0,8,1,1,0,1,63,16};

    final MultipartFile TEST_FILE = new MultipartFile() {
        @Override
        public String getName() {
            return "image";
        }

        @Override
        public String getOriginalFilename() {
            return IMAGE_NAME;
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
            return PICTURE;
        }

        @Override
        public InputStream getInputStream() throws IOException {
            return null;
        }

        @Override
        public void transferTo(File dest) throws IOException, IllegalStateException {

        }
    };

    final byte[] compressedImage = ImageUtils.compressImage(PICTURE);

    final Image image = Image.builder()
            .name(IMAGE_NAME)
            .type("image/jpeg")
            .size((long) PICTURE.length)
            .imageData(compressedImage)
            .compressedSize(compressedImage.length)
            .build();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @Order(0)
    void checkForNullReference_ImageService() {
        assertNotNull(imageService);
    }

    @Test
    @Order(1)
    void checkForImageUpload() {
        // Arrange

        when(imageRepository.save(Mockito.any(Image.class))).thenAnswer(i -> i.getArguments()[0]);
        when(imageRepository.findByName("tiny.jpg")).thenReturn(Optional.empty());
        // Act
        ResponseEntity<?> response = imageService.uploadImage(TEST_FILE);

        // Assert
        verify(imageRepository).save(image);
        assertEquals(
                200,
                response.getStatusCode().value(),
                "Test failed to upload image in assertion"
        );
        assertTrue(response.getBody() instanceof BriefMsgResponse);
    }

    @Test
    @Order(2)
    void checkForImageDownload() {
        // Arrange
        when(imageRepository.findByName("tiny.jpg")).thenReturn(Optional.of(image));
        // Act
        ResponseEntity<?> response = imageService.downloadImage(IMAGE_NAME);

        // Assert
        Object body = response.getBody();
        if(body instanceof byte[])
            assertArrayEquals(
                    PICTURE,
                    (byte[]) body
            );
        else
            assertTrue(false, "body is not instance of byte[]");
    }

    @Test
    @Order(3)
    void checkIfImageWasRemoved() {
        // Arrange
        when(imageRepository.findByName("tiny.jpg")).thenReturn(Optional.of(image));
        // Act
        ResponseEntity<?> response = imageService.removeImage(IMAGE_NAME);

        // Assert
        assertEquals(
                200,
                response.getStatusCode().value(),
                "Test failed to remove image"
        );
    }

}