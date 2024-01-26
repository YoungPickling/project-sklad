package lt.project.sklad.repositories;

import lt.project.sklad.entities.ItemTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemTableRepository extends JpaRepository<ItemTable, Long> {
}
