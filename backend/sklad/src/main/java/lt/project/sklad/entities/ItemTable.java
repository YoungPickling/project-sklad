package lt.project.sklad.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lt.project.sklad._security.entities.User;

import java.util.Map;
import java.util.Set;

/**
 * Item element entity. Contains metadata,
 * supplier
 * @version 1.0, 24 Jan 2024
 * @since 1.0, 24 Jan 2024
 * @author Maksim Pavlenko
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ItemTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_table_id")
    private Long id;

    private String code;

    @Column(nullable = false)
    private String name;

    /**
     * Image for this item
     */
    @OneToOne
    @JoinColumn(name = "image_id")
    private ImageData image;

    @Column(nullable = false)
    private Integer color;

    /**
     * Additional columns of the Item
     */
    @OneToMany(mappedBy = "ofTable", cascade = CascadeType.ALL, orphanRemoval = true) /*, */
    private Set<ItemColumn> columns;

    /**
     * Item's parent classes.
     * Parts that use this part.
     */
    @OneToMany
    private Set<ItemTable> parents;

    /**
     * Item's children classes.
     * Parts from which this one is made out of.
     */
    @OneToMany
    private Set<ItemTable> children;

    /**
     * Made to keeps track of which location
     * has what amount of this Item.
     */
    @ElementCollection
    @CollectionTable(name = "quantity_mapping", joinColumns = @JoinColumn(name = "item_table_id"))
    @MapKeyColumn(name = "location_id")
    private Map<Long, Integer> quantity;

    /**
     * Company this item belongs to.
     * Part of the company's item gallery
     */
    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    /**
     * Supplier of this item
     */
    @OneToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Lob
    private String description;
}
