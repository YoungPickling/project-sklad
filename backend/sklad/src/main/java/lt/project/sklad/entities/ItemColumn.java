package lt.project.sklad.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Column for an {@link ItemColumn}
 * @version 1.0, 24 Jan 2024
 * @since 1.0, 24 Jan 2024
 * @author Maksim Pavlenko
 */
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
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_table_id", nullable = false)
    private Item ofTable;

    @Lob
    private String value;

    @Column(nullable = false)
    private Integer color = 0xffffff; // metadata

    private Long width; // metadata

    public ItemColumn(final String name, final Item ofTable, final String value, final Integer color, final Long width) {
        this.name = name;
        this.ofTable = ofTable;
        this.value = value;
        this.color = color;
        this.width = width;
    }
}
