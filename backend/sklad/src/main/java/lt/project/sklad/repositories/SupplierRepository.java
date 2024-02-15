package lt.project.sklad.repositories;

import lt.project.sklad.entities.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * {@link Supplier} repository
 * @since 1.0, 29 Jan 2024
 * @author Maksim Pavlenko
 */

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Supplier> findByName(String name);
}