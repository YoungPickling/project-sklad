package lt.project.sklad.repositories;

import lt.project.sklad._security.entities.User;
import lt.project.sklad.entities.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
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
    List<Company> findByImageDataHash(final String hash);
    Optional<Company> findByUserIdAndImageDataId(final Long id, final Long imageId);
    Optional<Company> findByUser_IdAndImageData_Hash(final Long id, final String hash);
    void deleteByIdAndUserId(final Long id, final Long userId);
    Optional<Company> findByName(final String name);
    Optional<Company> findByIdAndUserId(final Long id, final Long userId);
    Optional<Company> findByIdAndUser_Username(final Long id, final String username);
}
