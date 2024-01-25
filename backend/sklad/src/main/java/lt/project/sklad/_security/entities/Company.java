package lt.project.sklad._security.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lt.project.sklad.entities.Location;

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

    @ManyToMany
    @JoinTable(name = "company_user", joinColumns = @JoinColumn(name = "company_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> user;

    @OneToMany(mappedBy = "owner")
    private Set<Location> locations;

    @Lob // Large Object a.k.a psql TEXT datatype
    private String description;
}
