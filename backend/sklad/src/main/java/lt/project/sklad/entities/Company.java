package lt.project.sklad.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    @JsonIgnoreProperties({"ownedByCompany", "size", "compressedSize", "imageData", "id"})
    @JoinColumn(name = "image_id")
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Image image;

    /** Users that have access to company's information.
     * Made for cases when more than one person manages
     * one or few warehouses. */
    @ManyToMany(cascade = CascadeType.DETACH, fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"company", "image", "registrationDate"})
    @JoinTable(
            name = "company_user",
            joinColumns = @JoinColumn(name = "company_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> user;

    /** Company's gallery */
    @JsonIgnoreProperties({"ownedByCompany", "size", "compressedSize", "imageData"})
    @OneToMany(mappedBy = "ownedByCompany", fetch = FetchType.EAGER, cascade = {CascadeType.ALL}, orphanRemoval = true)
    private List<Image> imageData;

    /** Warehouses of the company or it's branch */
    @JsonIgnoreProperties("owner")
    @OneToMany(mappedBy = "owner", fetch = FetchType.EAGER, cascade = {CascadeType.ALL}, orphanRemoval = true)
    private List<Location> locations;

    /** Parts and products company uses */
    @JsonIgnoreProperties("company")
    @OneToMany(mappedBy = "company", fetch = FetchType.EAGER, cascade = {CascadeType.ALL}, orphanRemoval = true)
    private List<Item> items;

    /** Company's supplier list */
    @JsonIgnoreProperties("owner")
    @OneToMany(mappedBy = "owner", fetch = FetchType.EAGER, cascade = {CascadeType.ALL}, orphanRemoval = true)
    private List<Supplier> suppliers;

    @JsonIgnore
    @OneToMany(mappedBy = "company", fetch = FetchType.EAGER, cascade = {CascadeType.ALL}, orphanRemoval = true)
    private List<CompanyLog> log;

    // Error occurs when adding @Lob
    // When annotation is present, user can create
    // only the first company and not all the rest
    //@Lob // Large Object a.k.a psql TEXT datatype
    private String description;
}
