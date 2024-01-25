package lt.project.sklad.repositories;

import lt.project.sklad.entities.ImageData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageDataRepository extends JpaRepository<ImageData, Long> {
    Optional<ImageData> findByName(String name);
    List<ImageData> findAllByNameStartingWith(String prefix);
}
