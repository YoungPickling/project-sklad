package lt.project.sklad.repositories;

import lt.project.sklad.entities.ItemColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemColumnRepository extends JpaRepository<ItemColumn, Long> {
}
