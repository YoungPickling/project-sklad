package lt.project.sklad.repositories;

import lt.project.sklad.entities.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    @Query("SELECT i FROM Item i WHERE i.image.id = :imageId")
    List<Item> findAllByImageId(@Param("imageId") final Long imageId);

    @Modifying
    @Transactional
    @Query("UPDATE Item i SET i.image = null WHERE i.image.id = :imageId")
    void setImageIdToNull(@Param("imageId") final Long imageId);
}
