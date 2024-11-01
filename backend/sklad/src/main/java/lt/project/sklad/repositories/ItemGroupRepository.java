package lt.project.sklad.repositories;

import lt.project.sklad.entities.ItemGroup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemGroupRepository extends JpaRepository<ItemGroup, Long> {
}
