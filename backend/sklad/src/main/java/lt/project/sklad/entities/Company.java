package lt.project.sklad.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lt.project.sklad._security.entities.User;

import java.util.List;
import java.util.Set;

/**
 * Company entity that {@link User}s manage.
 * Contains notes of Users authorized to warehouse management,
 * suppliers, tables, item images and warehouse locations.
 * @version 1.0, 24 Jan 2024
 * @since 1.0, 24 Jan 2024
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

    /** Image for the company */
    @OneToOne
    @JsonIgnoreProperties("ownedByCompany")
    @JoinColumn(name = "image_id")
    private Image image;

    /** Users that have access to company's information.
     * Made for cases when more than one person manages
     * one or few warehouses. */
    @ManyToMany(cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"company", "image"})
    @JoinTable(
            name = "company_user",
            joinColumns = @JoinColumn(name = "company_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> user;

    /** Company's gallery */
    @JsonIgnoreProperties("ownedByCompany")
    @OneToMany(mappedBy = "ownedByCompany")
    private List<Image> imageData;

    /** Warehouses of the company or it's branch */
    @JsonIgnoreProperties("owner")
    @OneToMany(mappedBy = "owner")
    private Set<Location> locations;

    /** Parts and products company uses */
    @JsonIgnoreProperties("company")
    @OneToMany(mappedBy = "company")
    private List<Item> items;

    /** Company's supplier list */
    @JsonIgnoreProperties("owner")
    @OneToMany(mappedBy = "owner")
    private List<Supplier> suppliers;

    // Error occurs when adding @Lob
    // When annotation is present, user can create
    // only the first company and not all the rest
    //@Lob // Large Object a.k.a psql TEXT datatype
    private String description;
}
