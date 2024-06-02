package lt.project.sklad._security.repositories;

import lt.project.sklad._security.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import lt.project.sklad._security.services.UserService;

import java.util.List;
import java.util.Optional;

/**
 * Repository for {@link User} entity
 * @see UserService
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 3 Aug 2023
 * @author Maksim Pavlenko
 */

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findById(final Long id);

	Optional<User> findByEmail(final String email);

//	@Query(value = "SELECT u FROM User u WHERE u.token = :username")
//	Optional<User> findByToken(final String token);

	@Query(value = "SELECT u FROM User u WHERE u.username = :username")
	Optional<User> findByUsername(final String username);

	@Query("SELECT u.username FROM User u")
	List<String> getAllUsernames();

	@Query(value = "SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.email = :email")
	boolean existsByEmail(final String email);

	@Query(value = "SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.username = :username")
	boolean existsByUsername(final String username);
}
