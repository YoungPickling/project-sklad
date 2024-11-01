package lt.project.sklad.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
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
    @Column(name = "item_id")
    private Long id;

    private String code;

    @Column(nullable = false)
    private String name;

    /**
     * Image for this item
     */
    @ManyToOne()
    @JsonIgnoreProperties("ownedByCompany")
    @JoinColumn(name = "image_id")
    private Image image;

    @Column(nullable = false)
    private Integer color = 0xffffff;

    /**
     * Additional columns of the Item
     */
    @JsonIgnoreProperties("ofTable")
    @OneToMany(
            mappedBy = "ofTable",
            fetch = FetchType.EAGER,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ItemColumn> columns;

    /**
     * Item's parent item ids
     */
    @ElementCollection(fetch = FetchType.EAGER)
    private Map<Long, Long> parents;

    /**
     * Made to keeps track of which location
     * has what amount of this Item.
     */
    @ElementCollection(fetch = FetchType.EAGER)
    private Map<Long, Long> quantity;

    /**
     * Group Ids for which this Item belongs
     */
    private List<Long> itemGroups;

    /**
     * Company this item belongs to.
     * Part of the company's item gallery
     */
    @ManyToOne
    @JsonIgnoreProperties({"suppliers", "user", "imageData", "locations", "items", "description"})
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    /**
     * Suppliers of this item
     */
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "item_supplier",
            joinColumns = @JoinColumn(name = "item_id"),
            inverseJoinColumns = @JoinColumn(name = "supplier_id"))
    @JsonIgnoreProperties({"owner", "website", "description", "streetAndNumber", "cityOrTown", "postalCode", "phoneNumber", "phoneNumberTwo"})
    private List<Supplier> suppliers;

    private boolean product = false;

    @Lob
    private String description;

    public Item(final String code, final String name, final Image image,final Integer color, final String description, final Company company) {
        this.code = code;
        this.name = name;
        this.image = image;
        this.color = color;
        this.description = description;
        this.company = company;
        this.columns = new ArrayList<>();
    }
}
