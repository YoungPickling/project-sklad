package lt.project.sklad.repositories;

import lt.project.sklad.entities.Company;
import lt.project.sklad.entities.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    Optional<Image> findById(final Long id);
    Optional<Image> findByName(final String name);
    Optional<Image> findByHash(final String hash);
    void deleteById(final Long id);

    @Modifying
    @Query("delete from Image i where i.id = ?1")
    void delete(final Long id);

    Optional<Image> findByNameAndOwnedByCompany(final String name, final Company ownedByCompany);
    List<Image> findAllByNameStartingWith(final String prefix);
}
