package lt.project.sklad.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
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
public class Item {
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
    @JsonIgnoreProperties("ownedByCompany")
    @JoinColumn(name = "image_id")
    private Image image;

    @Column(nullable = false)
    private Integer color;

    /**
     * Additional columns of the Item
     */
    @JsonIgnoreProperties("ofTable")
    @OneToMany(mappedBy = "ofTable", cascade = CascadeType.ALL, orphanRemoval = true) /*, */
    private Set<ItemColumn> columns;

    /**
     * Item's children classes.
     * Parts from which this one is made out of.
     */
    @JsonIgnore
    @OneToMany
    private Set<Item> children;

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
    @ManyToOne(cascade = CascadeType.ALL)
    @JsonIgnoreProperties("items")
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    /**
     * Supplier of this item
     */
    @OneToOne
    @JsonIgnoreProperties("owner")
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Lob
    private String description;
}
