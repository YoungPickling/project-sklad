package lt.project.sklad.repositories;

import jakarta.activation.DataSource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class ImageRepositoryTest {
    @Autowired
    private DataSource dataSource;

    @Autowired
    private ImageRepository imageRepository;

    @Test
    void findByName() {
    }

    @Test
    void findAllByNameStartingWith() {
    }
}