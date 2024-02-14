package lt.project.sklad.repositories;

import lt.project.sklad.entities.Company;
import lt.project.sklad.entities.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for companies
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 3 Aug 2023
 * @author Maksim Pavlenko
 */

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findById(final Long id);
    void deleteById(final Long id);
    void deleteByIdAndUserId(final Long id, final Long userId);
    Optional<Company> findByName(final String name);
    Optional<Company> findByIdAndUserId(final Long id, final Long userId);
    Optional<Company> findByIdAndUser_Username(final Long id, final String username);
}
