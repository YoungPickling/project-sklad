package lt.project.sklad.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lt.project.sklad._security.entities.Company;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="location")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private Company owner;

    @Column(name = "location_name", nullable = false)
    private String locationName;

    @Column(name = "street_and_number", nullable = false)
    private String streetAndNumber;

    @Column(name = "city_or_town", nullable = false)
    private String cityOrTown;

    @Column(name = "country_code", length = 2, nullable = false)
    private String countryCode;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Lob
    private String description;
}
