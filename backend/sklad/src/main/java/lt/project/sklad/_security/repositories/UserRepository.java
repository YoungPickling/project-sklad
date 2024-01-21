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
	Optional<User> findById(Long id);

	Optional<User> findByEmail(String email);

	@Query(value = "SELECT u FROM User u WHERE u.username = :username")
	Optional<User> findByUsername(String username);

	@Query("SELECT u.username FROM User u")
	List<String> getAllUsernames();

	@Query(value = "SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.email = :email")
	boolean existsByEmail(String email);

	@Query(value = "SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.username = :username")
	boolean existsByUsername(String username);
}
