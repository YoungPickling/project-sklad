package lt.project.sklad.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ItemColumn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_column_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    /**
     * Item table this column belongs to
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_table_id", nullable = false)
    private ItemTable ofTable;

    @Lob
    private String value;

    @Column(nullable = false)
    private Integer color = 0xffffff; // metadata

    private Integer width; // metadata
}
