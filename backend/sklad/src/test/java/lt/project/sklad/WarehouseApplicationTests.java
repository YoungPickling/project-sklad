package lt.project.sklad;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class WarehouseApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	public void givenRawPassword_whenEncodedWithArgon2_thenMatchesEncodedPassword() {
		String rawPassword = "Baeldung";
		Argon2PasswordEncoder encoder = new Argon2PasswordEncoder(24, 32, 2, 24576, 2);
		String springBouncyHash = encoder.encode(rawPassword);

		assertTrue(encoder.matches(rawPassword, springBouncyHash));
	}

}
