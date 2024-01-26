package lt.project.sklad._security.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lt.project.sklad.entities.ImageData;
import lt.project.sklad.entities.ItemTable;
import lt.project.sklad.entities.Location;
import lt.project.sklad.entities.Supplier;

import java.util.List;
import java.util.Set;

/**
 * Company entity that owns warehouses
 * that {@link User}s manage
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 3 Aug 2023
 * @author Maksim Pavlenko
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    private Long id;

    private String name;

    /**
     * Image for the company
     */
    @OneToOne
    @JoinColumn(name = "image_id")
    private ImageData image;

    /**
     * Users that have access to company's information.
     * Made for cases when more than one person manages
     * one or few warehouses.
     */
    @ManyToMany
    @JoinTable(
            name = "company_user",
            joinColumns = @JoinColumn(name = "company_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> user;

    /**
     * Company's gallery
     */
    @OneToMany(mappedBy = "ownedByCompany")
    private List<ImageData> imageData;

    /**
     * Warehouses of the company or it's branch
     */
    @OneToMany(mappedBy = "owner")
    private Set<Location> locations;

    /**
     * Parts and products company uses
     */
    @OneToMany(mappedBy = "company")
    private List<ItemTable> items;

    /**
     * Company's supplier list
     */
    @OneToMany(mappedBy = "owner")
    private List<Supplier> suppliers;

    @Lob // Large Object a.k.a psql TEXT datatype
    private String description;
}
