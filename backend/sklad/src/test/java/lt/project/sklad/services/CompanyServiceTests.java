package lt.project.sklad.services;

import lt.project.sklad.services.CompanyService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class CompanyServiceTests {
//    @Mock
    @Autowired
    CompanyService companyService;

    @Test
    void checkForNullReference_CompanyService() {
        assertNotNull(companyService);
    }
    // TODO company repository tests
}
