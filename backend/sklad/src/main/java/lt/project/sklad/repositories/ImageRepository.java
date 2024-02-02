package lt.project.sklad.repositories;

import lt.project.sklad.entities.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    Optional<Image> findByName(String name);
    List<Image> findAllByNameStartingWith(String prefix);
}
