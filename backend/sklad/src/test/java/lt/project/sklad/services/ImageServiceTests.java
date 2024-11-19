package lt.project.sklad.services;

import lt.project.sklad._security.dto_response.BriefMsgResponse;
import lt.project.sklad._security.entities.Token;
import lt.project.sklad._security.entities.User;
import lt.project.sklad._security.repositories.UserRepository;
import lt.project.sklad._security.services.TokenService;
import lt.project.sklad._security.utils.MessagingUtils;
import lt.project.sklad.entities.Company;
import lt.project.sklad.entities.Image;
import lt.project.sklad.repositories.CompanyRepository;
import lt.project.sklad.repositories.ImageRepository;
import lt.project.sklad.utils.HashUtils;
import lt.project.sklad.utils.ImageUtils;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
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

    @Mock private ImageRepository imageRepository;
    @Mock private CompanyRepository companyRepository;
    @Mock private UserRepository userRepository;
    @Mock private TokenService tokenService;
    @Mock private MessagingUtils msgUtils;
    @Mock private ImageUtils imgUtils;
    @Mock private HashUtils hashUtils;

    private MockHttpServletRequest request;
    private MultipartFile testFile;

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

    byte[] compressedImage = new byte[]{1, 2, 3};

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
        request = new MockHttpServletRequest();
        testFile = mock(MultipartFile.class);

//        when(imgUtils.compressImage(PICTURE)).thenReturn(new byte[]{1, 2, 3});
    }

    @Test
    @Order(0)
    void checkForNullReference_ImageService() {
        assertNotNull(imageService);
    }

    @Test
    @Order(1)
    void uploadImage_Success() throws IOException {
        // Arrange
        String jwt = "mockToken";
        String hash = "mockHash";
        Company company = mock(Company.class);
        Token token = mock(Token.class);

        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + jwt);
        when(tokenService.findByToken(jwt)).thenReturn(Optional.of(token));
        when(token.getUser()).thenReturn(new User(1L, "testUser"));
        when(companyRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(company));
        when(hashUtils.hashString(anyString())).thenReturn(hash);
        when(imageRepository.findByHash(hash)).thenReturn(Optional.empty());
        when(testFile.getOriginalFilename()).thenReturn("test.jpg");
        when(testFile.getBytes()).thenReturn(new byte[]{});
        when(testFile.getContentType()).thenReturn("image/jpeg");
        when(imgUtils.compressImage(any())).thenReturn(new byte[]{1, 2, 3});
        when(imageRepository.save(any(Image.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        ResponseEntity<?> response = imageService.uploadImage(1L, testFile, request);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, String> responseBody = (Map<String, String>) response.getBody();
        assertNotNull(responseBody);
        assertEquals("Upload successful", responseBody.get("msg"));
    }

    @Test
    @Order(2)
    void uploadImage_FileEmpty() {
        // Arrange
        when(testFile.isEmpty()).thenReturn(true);

        // Act
        ResponseEntity<?> response = imageService.uploadImage(1L, testFile, request);

        // Assert
        verify(msgUtils).error(HttpStatus.BAD_REQUEST, "File is empty");
    }

    @Test
    @Order(3)
    void downloadImage_Success() {
        // Arrange
        String fileHash = "mockHash";
        Image image = mock(Image.class);

        when(imageRepository.findByHash(fileHash)).thenReturn(Optional.of(image));
        when(image.getImageData()).thenReturn(new byte[]{1, 2, 3});
        when(image.getType()).thenReturn("image/jpeg");
        when(imgUtils.decompressImage(any())).thenReturn(new byte[]{1, 2, 3});

        // Act
        ResponseEntity<?> response = imageService.downloadImage(fileHash, request);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertArrayEquals(new byte[]{1, 2, 3}, (byte[]) response.getBody());
    }

//    @Test
//    @Order(4)
//    void removeImage_Success() {
//        // Arrange
//        String linkHash = "mockHash";
//        Image image = mock(Image.class);
//        Company company = mock(Company.class);
//        User user = new User(1L, "testUser");
//        String jwt = "Bearer mockJwt";
//        request.addHeader(HttpHeaders.AUTHORIZATION, jwt);
//
//        when(msgUtils.isBearer(request.getHeader("Authorization"))).thenReturn(true);
//        when(imageRepository.findByHash(linkHash)).thenReturn(Optional.of(image));
//        when(image.getOwnedByCompany()).thenReturn(company);
//        when(company.getId()).thenReturn(1L);
//        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
//        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
//
//        // Act
//        ResponseEntity<?> response = null;
//        try {
//            response = imageService.removeImage(linkHash, request);
//            assertNotNull(response, "Response should not be null");
//        } catch (Exception e) {
//            e.printStackTrace();
//            fail("Method threw an exception: " + e.getMessage());
//        }
//
//        // Assert
//
////        assertEquals(HttpStatus.OK, response.getStatusCode());
//        verify(imageRepository).delete(image);
//    }
}